/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  AlertTriangle,
  Bell,
  Flame,
  Heart,
  Search,
  Star,
  Store,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, typography } from '../constants/theme';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import WeatherAlertTooltip from '../components/WeatherAlertTooltip';
import { useWeatherAlert } from '../contexts/WeatherAlertContext';
import { useDispatch } from '../redux/store';
import { IRestaurant } from '../types';
import { getRestaurants, toggleWishlist } from '../redux/app/appAction';
import { Constant } from '../constants/Constant';
import { ImagePath } from '../constants/ImagePath';
import Loader from '../components/Loader';

const CARD_IMAGE_HEIGHT = 256;
const SLIDER_WIDTH = Dimensions.get('window').width - layout.screenPadding * 2;

const RestaurantImageSlider = React.memo(({
  images,
  shopId,
}: {
  images: string[];
  shopId: string;
}) => {
  const isMultiple = images.length > 1;
  // [last, img0, img1, ..., imgN-1, first] — clones at both ends for seamless loop
  const extendedImages = isMultiple
    ? [images[images.length - 1], ...images, images[0]]
    : images;

  const startIndex = isMultiple ? 1 : 0;
  const [activeIndex, setActiveIndex] = useState(startIndex);
  const flatRef = useRef<FlatList>(null);
  const activeIndexRef = useRef(startIndex);

  // Initialise scroll position to index 1 (skip the leading clone)
  useEffect(() => {
    if (!isMultiple) {
      return;
    }
    const t = setTimeout(() => {
      flatRef.current?.scrollToIndex({ index: 1, animated: false });
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-slide: always go forward; silently reset when clone is shown
  useEffect(() => {
    if (!isMultiple) {
      return;
    }
    const timer = setInterval(() => {
      const next = activeIndexRef.current + 1;
      flatRef.current?.scrollToIndex({ index: next, animated: true });
      activeIndexRef.current = next;
      setActiveIndex(next);

      // Landed on the trailing clone (copy of first image) → jump to real first
      if (next === extendedImages.length - 1) {
        setTimeout(() => {
          flatRef.current?.scrollToIndex({ index: 1, animated: false });
          activeIndexRef.current = 1;
          setActiveIndex(1);
        }, 400);
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [isMultiple, extendedImages.length]);

  // Handle manual swipes hitting the clone frames
  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!isMultiple) {
      return;
    }
    const idx = Math.round(e.nativeEvent.contentOffset.x / SLIDER_WIDTH);
    activeIndexRef.current = idx;
    setActiveIndex(idx);

    if (idx === 0) {
      // Swiped backward past the first image → jump to real last
      const realLast = images.length;
      flatRef.current?.scrollToIndex({ index: realLast, animated: false });
      activeIndexRef.current = realLast;
      setActiveIndex(realLast);
    } else if (idx === extendedImages.length - 1) {
      // Swiped forward past the last image → jump to real first
      flatRef.current?.scrollToIndex({ index: 1, animated: false });
      activeIndexRef.current = 1;
      setActiveIndex(1);
    }
  };

  // Map extended index → original 0-based dot index
  const dotIndex = isMultiple
    ? (activeIndex - 1 + images.length) % images.length
    : 0;

  // Memoized renderItem to avoid recreating it on every render
  const renderItem = useCallback(({ item }: { item: string }) => (
    <Image
      source={{ uri: Constant.ImageURL + item }}
      style={[sliderStyles.image, { width: SLIDER_WIDTH }]}
    />
  ), []);

  const keyExtractor = useCallback((_: string, i: number) => `${shopId}-img-${i}`, [shopId]);

  return (
    <View style={sliderStyles.root}>
      <FlatList
        ref={flatRef}
        data={extendedImages}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: SLIDER_WIDTH,
          offset: SLIDER_WIDTH * index,
          index,
        })}
        onScrollToIndexFailed={({ index }) => {
          flatRef.current?.scrollToOffset({
            offset: SLIDER_WIDTH * index,
            animated: false,
          });
        }}
        renderItem={renderItem}
      />
      {isMultiple && (
        <View style={sliderStyles.dots}>
          {images.map((_, i) => (
            <View
              key={i}
              style={[
                sliderStyles.dot,
                i === dotIndex && sliderStyles.dotActive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
});

const RestaurantList = (props: any) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const { isBadWeather, show } = useWeatherAlert();

  const category_id_params = props?.route?.params?.category_id || '';

  const scrollRef = useRef<ScrollView>(null);
  const chipXPositions = useRef<number[]>([]);

  const [restaurants, setRestaurants] = useState<Array<IRestaurant>>([]);
  const [categories, setCategories] = useState<
    Array<{ category_id: string; name: string }>
  >([]);
  const [isFetching, setIsFetching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    category_id_params,
  );

  useEffect(() => {
    if (!category_id_params || categories.length === 0) {
      return;
    }
    setSelectedCategory(category_id_params);
    const index = categories.findIndex(
      (item) => item.category_id === category_id_params
    );
    if (index === -1) {
      return;
    }
    // Small defer ensures layout has settled before we scroll
    const timer = setTimeout(() => {
      const x = chipXPositions.current[index];
      if (x !== undefined) {
        // Subtract a small margin so the chip isn't flush against the edge
        scrollRef.current?.scrollTo({ x: Math.max(0, x - 16), y: 0, animated: true });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [category_id_params, categories]);

  useEffect(() => {
    if (isFocused) {
      getShopHandler(selectedCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, selectedCategory]);

  const getShopHandler = (categoryId: string | null, silent = false) => {
    if (!silent) {
      setIsFetching(true);
    }
    dispatch(getRestaurants(categoryId))
      .unwrap()
      .then(({ data }: any) => {
        setRestaurants(data?.shops || []);
        let cats = [{ category_id: '', name: 'All Cuisines' }];
        if (data?.categories && data?.categories.length > 0) {
          cats = [
            { category_id: '', name: 'All Cuisines' },
            ...data?.categories,
          ];
        }
        setCategories(cats);
      })
      .catch((error: any) => {
        console.log('Error fetching restaurants:', error);
      })
      .finally(() => {
        setIsFetching(false);
        setRefreshing(false);
      });
  };

  const onRefresh = () => {
    setRefreshing(true);
    getShopHandler(selectedCategory, true);
  };

  const handleSelectCategory = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    // getShopHandler(categoryId);
  };

  const handleToggleWishlist = (shopId: string) => {
    dispatch(toggleWishlist(shopId))
      .unwrap()
      .then((res: any) => {
        console.log('Wishlist toggled:', res);
        getShopHandler(selectedCategory);
      })
      .catch((error: any) => {
        console.log('Error toggling wishlist:', error);
      })
  };

  const renderRestaurantItem = useCallback(({ item: restaurant }: { item: IRestaurant }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={() =>
        navigation.navigate('RestaurantDetails', {
          shopId: restaurant?.shop_id,
        })
      }
    >
      {/* Hero image area */}
      <View style={styles.cardHero}>
        {restaurant?.images && restaurant.images.length > 0 ? (
          <RestaurantImageSlider
            images={restaurant.images}
            shopId={restaurant.shop_id}
          />
        ) : (
          <Image
            source={
              restaurant?.image
                ? { uri: Constant?.ImageURL + restaurant?.image }
                : ImagePath.noShopPlaceholder
            }
            style={styles.cardImage}
          />
        )}
        <LinearGradient
          colors={[
            'rgba(18, 20, 24, 0.8)',
            'rgba(18, 20, 24, 0)',
            'rgba(18, 20, 24, 0)',
          ]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.cardImageGradient}
        />
        <View
          style={[
            styles.cardTopRow,
            restaurant?.status ? null : styles.cardTopRowNoBadge,
          ]}
        >
          {restaurant?.status ? (
            <View style={[styles.vipBadge, {
              backgroundColor: restaurant?.status === "Open" ? "rgba(245, 158, 11, 0.2)" : "rgba(245, 58, 11, 0.2)",
              borderColor: restaurant?.status === "Open" ? "rgba(245, 158, 11, 0.2)" : "rgba(245, 58, 11, 0.2)",
            }]}>
              <Flame size={14} color={restaurant?.status === "Open" ? colors.primary : colors.red} />
              <Text style={[styles.vipText, { color: restaurant?.status === "Open" ? colors.primary : colors.red }]}>{restaurant?.status}</Text>
            </View>
          ) : null}
          <TouchableOpacity
            style={styles.likeButton}
            activeOpacity={0.85}
          // onPress={() => {
          //   handleToggleWishlist(restaurant?.shop_id);
          // }}
          >
            {restaurant?.is_wishlist ? (
              <Heart
                size={20}
                color={colors.accentCoral}
                strokeWidth={2}
              />
            ) : (
              <Heart size={20} color="#FFFFFF" strokeWidth={2} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Card body */}
      <View style={styles.cardBody}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>{restaurant?.name}</Text>
          <View style={styles.ratingBadge}>
            <Star
              size={12}
              color={colors.primary}
              fill={colors.primary}
              strokeWidth={1.8}
            />
            <Text style={styles.ratingText}>
              {restaurant?.rating}
            </Text>
          </View>
        </View>

        <Text style={styles.cardDetails} numberOfLines={2}>
          {restaurant?.type} - {restaurant?.time}
        </Text>
      </View>
    </TouchableOpacity>
  ), [navigation]);

  const restaurantKeyExtractor = useCallback((item: IRestaurant) => item?.shop_id, []);

  return (
    <SafeAreaView style={styles.container}>
      <WeatherAlertTooltip />

      <View
        style={{
          paddingHorizontal: layout.screenPadding,
          paddingTop: 8,
          paddingBottom: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ gap: 4 }}>
          <Text
            style={{
              color: colors.textMuted,
              fontSize: typography.caption,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            Today's picks
          </Text>
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: typography.xl,
              fontWeight: '700',
              letterSpacing: -0.3,
            }}
          >
            Restaurants Near You
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: 12,
          }}
        >
          <TouchableOpacity
            style={{
              width: 44,
              height: 44,
              backgroundColor: colors.glass,
              borderRadius: 24,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.glassBorder,
              overflow: 'hidden',
            }}
            onPress={() => navigation.navigate('Search')}
          >
            <Search size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 44,
              height: 44,
              backgroundColor: colors.glass,
              borderRadius: 24,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.glassBorder,
              overflow: 'hidden',
            }}
            onPress={() => {
              if (isBadWeather) {
                show();
              }
            }}
            accessibilityLabel="Weather warning"
          >
            {isBadWeather ? (
              <AlertTriangle size={20} color={colors.accentCoral} />
            ) : (
              <>
                <Bell size={20} color="#FFF" />
                <View
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    width: 8,
                    height: 8,
                    backgroundColor: colors.primary,
                    borderRadius: 4,
                  }}
                />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {isFetching && <Loader />}

      <FlatList
        data={restaurants}
        keyExtractor={restaurantKeyExtractor}
        renderItem={renderRestaurantItem}
        ItemSeparatorComponent={useCallback(() => <View style={{ height: 32 }} />, [])}
        ListHeaderComponent={
          <ScrollView
            horizontal
            style={styles.chipsScroll}
            contentContainerStyle={styles.chipsContent}
            showsHorizontalScrollIndicator={false}
            ref={scrollRef}
          >
            {categories && categories.length > 0
              ? categories.map((item, index) => {
                const active = item?.category_id == selectedCategory;
                return (
                  <View
                    key={index}
                    onLayout={(e) => {
                      chipXPositions.current[index] = e.nativeEvent.layout.x;
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.88}
                      style={active ? styles.chipActive : styles.chipInactive}
                      onPress={() => handleSelectCategory(item?.category_id)}
                    >
                      <Text
                        style={
                          active ? styles.chipTextActive : styles.chipTextInactive
                        }
                      >
                        {item?.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })
              : null}
          </ScrollView>
        }
        ListEmptyComponent={
          isFetching ? null : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyContent}>
                <View style={styles.emptyIconWrapper}>
                  <Store size={64} color={colors.primary} strokeWidth={1.5} />
                </View>

                <Text style={styles.emptyTitle}>No Restaurants Found</Text>
                <Text style={styles.emptySubtitle}>
                  We couldn't find any restaurants near your location.
                </Text>
              </View>
            </View>
          )
        }
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
            progressBackgroundColor="#1A1A1A"
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  /* -- Layout -- */
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 12,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 128,
  },

  /* -- Delivery progress card -- */
  progressCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 24,
    overflow: 'hidden',
    marginBottom: 32,
  },
  progressTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressTextGroup: {
    width: 196,
    gap: 4,
  },
  progressCaption: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 15,
    letterSpacing: 1,
  },
  progressAmount: {
    color: colors.primary,
    fontSize: typography.lg,
    lineHeight: 28,
    fontWeight: '700',
  },
  progressTrack: {
    width: '100%',
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 2,
    justifyContent: 'center',
  },
  progressFill: {
    width: '64%',
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },

  /* -- Cuisine chips -- */
  chipsScroll: {
    marginHorizontal: -24,
    marginBottom: 32,
  },
  chipsContent: {
    gap: 16,
    paddingHorizontal: layout.screenPadding,
  },
  chipActive: {
    borderRadius: 999,
    backgroundColor: colors.primary,
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 13,
  },
  chipInactive: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 12,
  },
  chipTextActive: {
    color: colors.black,
    fontSize: typography.body,
    lineHeight: 20,
    fontWeight: '700',
  },
  chipTextInactive: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 20,
    fontWeight: '700',
  },

  /* -- Restaurant cards -- */
  cardsList: {
    gap: 32,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    overflow: 'hidden',
  },
  cardHero: {
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 256,
  },
  cardImageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 256,
  },
  cardTopRow: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTopRowNoBadge: {
    justifyContent: 'flex-end',
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  vipText: {
    color: colors.primary,
    fontSize: typography.caption,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  likeButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* -- Card body -- */
  cardBody: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 24,
    paddingBottom: 24,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
  },
  cardTitle: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.xxl,
    lineHeight: 32,
    letterSpacing: -0.6,
    fontWeight: '700',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    color: colors.textPrimary,
    fontSize: typography.body,
    lineHeight: 20,
    fontWeight: '700',
  },
  cardDetails: {
    color: colors.textMuted,
    fontSize: typography.sm,
    marginTop: 7,
  },

  /* -- Card footer -- */
  cardFooter: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarStack: {
    width: 32,
    height: 32,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.background,
    overflow: 'hidden',
  },
  avatarStackImage: {
    width: '100%',
    height: '100%',
  },
  countBubble: {
    marginLeft: -8,
    height: 32,
    minWidth: 32,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 2,
    borderColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 7,
  },
  countBubbleText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '700',
    lineHeight: 15,
  },
  leftFooterText: {
    color: colors.primary,
    fontSize: typography.caption,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1,
  },
  insightText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 15,
    fontWeight: '400',
    letterSpacing: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: layout.screenPadding,
  },
  emptyContent: {
    alignItems: 'center',
    gap: 20,
  },
  emptyIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    marginBottom: 12,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: typography.title,
    fontWeight: '700',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 280,
  },
});

const sliderStyles = StyleSheet.create({
  root: {
    height: CARD_IMAGE_HEIGHT,
    overflow: 'hidden',
  },
  image: {
    height: CARD_IMAGE_HEIGHT,
    resizeMode: 'cover',
  },
  dots: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  dotActive: {
    width: 14,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
});

export default RestaurantList;
