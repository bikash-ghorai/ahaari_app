/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { AlertTriangle, Bell, Heart, Search, Star } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, typography } from '../constants/theme';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import WeatherAlertTooltip from '../components/WeatherAlertTooltip';
import { useWeatherAlert } from '../contexts/WeatherAlertContext';
import { useDispatch } from '../redux/store';
import { IRestaurant } from '../types';
import { getRestaurants } from '../redux/app/appAction';
import { Constant } from '../constants/Constant';

type RestaurantCard = {
  id: string;
  name: string;
  details: string;
  rating: string;
  image: string;
  insight: string;
  hasVip?: boolean;
  crowdCount?: string;
  leftFooterText?: string;
};

type RestaurantListItem = IRestaurant & {
  details?: string;
  hasVip?: boolean;
};

const cuisineChips = [
  'All Cuisines',
  'Michelin Star',
  'Artisanal Bakery',
  'Japanese Fusion',
];

const crowdAvatars = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=60',
  'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?auto=format&fit=crop&w=80&q=60',
];

const _restaurants: RestaurantCard[] = [
  {
    id: 'obsidian-table',
    name: 'The Obsidian Table',
    details: 'Modern European  -  Artisanal Butcher  -  25-\n35 min',
    rating: '4.9',
    image:
      'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=80',
    insight: 'Recommended by locals',
    hasVip: true,
    crowdCount: '+12',
  },
  {
    id: 'aurelian-sushi',
    name: 'Aurelian Sushi',
    details: 'Omakase  -  Japanese  -  15-20 min',
    rating: '4.8',
    image:
      'https://images.unsplash.com/photo-1617196038435-c55b1ff64f80?auto=format&fit=crop&w=1200&q=80',
    insight: 'Fastest in category',
    hasVip: true,
    crowdCount: '+8',
  },
  {
    id: 'lumiere-gardens',
    name: 'Lumiere Gardens',
    details: 'Organic  -  Vegan Fine Dining  -  30-45 min',
    rating: '5.0',
    image:
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80',
    insight: 'Michelin Nominee',
    hasVip: true,
    crowdCount: '+24',
  },
  {
    id: 'truffle-hearth',
    name: 'Truffle & Hearth',
    details: 'Artisan Pizza  -  Italian  -  20-30 min',
    rating: '4.7',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
    insight: 'Top Rated Locally',
    hasVip: false,
    leftFooterText: 'New Addition',
  },
];

const RestaurantList = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const { isBadWeather, show } = useWeatherAlert();

  const [restaurants, setRestaurants] = useState<Array<RestaurantListItem>>(
    [],
  );

  useEffect(() => {
    if (isFocused) {
      getShopHandler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const getShopHandler = () => {
    dispatch(getRestaurants())
      .unwrap()
      .then(({ data }: any) => {
        setRestaurants(data);
      })
      .catch((error: any) => {
        console.log('Error fetching restaurants:', error);
      });
  };
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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* -- Cuisine chips -- */}
        <ScrollView
          horizontal
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsContent}
          showsHorizontalScrollIndicator={false}
        >
          {cuisineChips.map((chip, index) => {
            const active = index === 0;
            return (
              <TouchableOpacity
                key={chip}
                activeOpacity={0.88}
                style={active ? styles.chipActive : styles.chipInactive}
              >
                <Text
                  style={
                    active ? styles.chipTextActive : styles.chipTextInactive
                  }
                >
                  {chip}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* -- Restaurant cards -- */}
        <View style={styles.cardsList}>
          {restaurants.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No restaurants found</Text>
              <Text style={styles.emptyStateText}>
                We could not find any restaurants for your current location.
              </Text>
            </View>
          ) : (
            restaurants.map(restaurant => (
              <TouchableOpacity
                key={restaurant?.id}
                activeOpacity={0.9}
                style={styles.card}
                onPress={() =>
                  navigation.navigate('RestaurantDetails', {
                    id: restaurant?.id,
                  })
                }
              >
                {/* Hero image area */}
                <View style={styles.cardHero}>
                  <Image
                    source={{ uri: Constant?.ImageURL + restaurant?.image }}
                    style={styles.cardImage}
                  />
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
                      restaurant?.hasVip === false
                        ? styles.cardTopRowNoBadge
                        : null,
                    ]}
                  >
                    {restaurant?.hasVip !== false ? (
                      <View style={styles.vipBadge}>
                        <View style={styles.vipDot} />
                        <Text style={styles.vipText}>VIP Delivery Available</Text>
                      </View>
                    ) : null}
                    <TouchableOpacity
                      style={styles.likeButton}
                      activeOpacity={0.85}
                    >
                      <Heart size={20} color="#FFFFFF" strokeWidth={2} />
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
                      <Text style={styles.ratingText}>{restaurant?.rating}</Text>
                    </View>
                  </View>

                  <Text style={styles.cardDetails}>
                    {restaurant?.details || restaurant?.address || ''}
                  </Text>

                  {/* <View style={styles.cardFooter}>
                    {restaurant.leftFooterText ? (
                      <Text style={styles.leftFooterText}>
                        {restaurant.leftFooterText}
                      </Text>
                    ) : (
                      <View style={styles.avatarsRow}>
                        {crowdAvatars.map((uri, index) => (
                          <View
                            key={uri}
                            style={[
                              styles.avatarStack,
                              {
                                marginLeft: index === 0 ? 0 : -8,
                                zIndex: crowdAvatars.length - index,
                              },
                            ]}
                          >
                            <Image
                              source={{ uri }}
                              style={styles.avatarStackImage}
                            />
                          </View>
                        ))}
                        <View style={styles.countBubble}>
                          <Text style={styles.countBubbleText}>
                            {restaurant.crowdCount}
                          </Text>
                        </View>
                      </View>
                    )}

                    <Text style={styles.insightText}>{restaurant.insight}</Text>
                  </View> */}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
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
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
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
  emptyState: {
    minHeight: 160,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 28,
    marginTop: '25%',
  },
  emptyStateTitle: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    fontWeight: '700',
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  emptyStateText: {
    marginTop: 8,
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21,
    textAlign: 'center',
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
    borderColor: 'rgba(245, 158, 11, 0.2)',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  vipDot: {
    width: 8,
    height: 10,
    borderRadius: 2,
    backgroundColor: colors.primary,
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
    fontSize: typography.body,
    lineHeight: 23,
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
});

export default RestaurantList;
