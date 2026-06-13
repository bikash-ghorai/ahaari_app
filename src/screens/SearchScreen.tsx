import React, { useState, useEffect } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, ArrowUpLeft, History, Search, X, Star, Plus, Minus, ShoppingBag, Circle, Triangle, StarIcon, BadgePercent } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, typography } from '../constants/theme';
import { useDispatch } from '../redux/store';
import { searchAPI } from '../redux/app/appAction';
import { useCart } from '../hooks';
import Loader from '../components/Loader';
import { Constant } from '../constants/Constant';
import { ImagePath } from '../constants/ImagePath';
import { IRestaurant, IProduct } from '../types';
import Header from '../components/Header';
import PopupMessage from '../components/PopupMessage';

type RecentSearch = {
  id: string;
  title: string;
  subtitle: string;
};
type ISearchProduct = {
  shop_id: string;
  shop_name: string;
  product_id: string;
  variant_id: string;
  name: string;
  description: string;
  price: number;
  type: 'Veg' | 'Non-Veg';
  image: null
}
type ISearchRestaurant = {
  shop_id: string;
  name: string;
  image: string | null;
  type: string;
  time: string | null;
  have_discount: boolean;
  offer: string | null;
  rating: number | string;
}
const trendingSearches = ['Truffle Burger', 'Sushi', 'Vegan Bowl', 'Spicy Ramen', 'Artisan Pizza'];

const initialRecentSearches: RecentSearch[] = [
  { id: 'blueberry-cheesecake', title: 'Blueberry Cheesecake', subtitle: 'Dessert  -  2 days ago' },
  { id: 'pasta-carbonara', title: 'Pasta Carbonara', subtitle: 'Italian  -  Last week' },
  { id: 'smoothie-king', title: 'Smoothie King', subtitle: 'Drinks  -  Last week' },
];

const GlassLayer = ({ radius, androidTint = 'rgba(8, 12, 18, 0.18)' }: { radius: number; androidTint?: string }) => (
  <>
    <BlurView
      pointerEvents="none"
      style={[{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        borderRadius: radius
      }]}
      blurType="dark"
      blurAmount={30}
      reducedTransparencyFallbackColor="rgba(18, 20, 24, 0.36)"
    />

    {Platform.OS === 'android' ? (
      <View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            borderRadius: radius,
            backgroundColor: androidTint,
          },
        ]}
      />
    ) : null}
  </>
);

const SearchScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useDispatch();

  const { addProduct, removeProduct, getCartQtyCount } = useCart();
  const [duplicateRestaurenProduct, setDuplicateRestaurenProduct] =
    useState<any>(null);

  const [query, setQuery] = useState('');
  const [recentList, setRecentList] = useState<RecentSearch[]>([]);
  const [searchProducts, setSearchProducts] = useState<ISearchProduct[]>([]);
  const [searchShops, setSearchShops] = useState<ISearchRestaurant[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load recent searches on mount
  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const stored = await AsyncStorage.getItem('@recent_searches');
        if (stored) {
          setRecentList(JSON.parse(stored));
        } else {
          setRecentList(initialRecentSearches);
        }
      } catch (e) {
        console.log('Error loading recent searches', e);
        setRecentList(initialRecentSearches);
      }
    };
    loadRecentSearches();
  }, []);

  // Sync route param with input query
  useEffect(() => {
    if (route.params?.initialQuery) {
      setQuery(route.params.initialQuery);
    }
  }, [route.params?.initialQuery]);

  // Trigger search whenever query changes (debounced)
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSearchProducts([]);
      setSearchShops([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const delayDebounceFn = setTimeout(() => {
      dispatch(searchAPI(trimmed))
        .unwrap()
        .then((res: any) => {
          setSearchProducts(res.data?.products || []);
          setSearchShops(res.data?.shops || []);
        })
        .catch((err: any) => {
          console.log('Error executing search API:', err);
          setSearchProducts([]);
          setSearchShops([]);
        })
        .finally(() => {
          setIsSearching(false);
        });
    }, 500); // 400ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [query, dispatch]);

  const handleSaveSearch = async (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;

    const updatedList = [
      { id: trimmed.toLowerCase().replace(/\s+/g, '-'), title: trimmed, subtitle: `Food  -  Just now` },
      ...recentList.filter(item => item.title.toLowerCase() !== trimmed.toLowerCase())
    ].slice(0, 5);

    setRecentList(updatedList);
    try {
      await AsyncStorage.setItem('@recent_searches', JSON.stringify(updatedList));
    } catch (e) {
      console.log('Error saving recent searches', e);
    }
  };

  const handleSelectSearch = (term: string) => {
    setQuery(term);
    handleSaveSearch(term);
  };

  const handleClearAll = async () => {
    setRecentList([]);
    try {
      await AsyncStorage.removeItem('@recent_searches');
    } catch (e) {
      console.log('Error clearing recent searches', e);
    }
  };

  const handleAddToCart = (_props: {
    product_id: string;
    variant_id: string;
    shop_id: string;
    quantity?: number;
  }) => {
    let { product_id, variant_id, shop_id, quantity = 1 } = _props;
    addProduct({
      product_id,
      variant_id,
      shop_id,
      quantity,
    })
      .then(res => {
        console.log('res', res);
        if (!res?.status && res?.type === 'different_shop_error') {
          setDuplicateRestaurenProduct(_props);
        }
      })
      .catch(err => {
        console.error('Error adding product to cart:', err);
      });
  };
  const handleReplaceCartItem = () => {
    setDuplicateRestaurenProduct(null);
    addProduct({
      ...duplicateRestaurenProduct,
      isRecreateCart: true,
    });
  };
  const hasResults = searchShops.length > 0 || searchProducts.length > 0;
  const isQueryActive = query.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* --- HEADER --- */}
      <Header
        title='Search'
        showBackButton={true}
        showCartButton={true}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.main}>
          {/* --- SEARCH BAR --- */}
          <View style={styles.heroSearchSection}>
            {!isQueryActive && (
              <View style={styles.heroHeadingContainer}>
                <Text style={styles.heroHeading}>
                  What are you{`\n`}
                  <Text style={styles.heroHeadingAccent}>craving</Text>
                  <Text style={styles.heroHeading}> tonight?</Text>
                </Text>
              </View>
            )}

            <View style={styles.searchFieldContainer}>
              <View pointerEvents="none" style={styles.searchGlow} />

              <View style={styles.searchFieldCard}>
                <GlassLayer radius={24} />

                <View style={styles.searchFieldContent}>
                  <View style={styles.searchIconSlot}>
                    <Search size={18} color={colors.primary} strokeWidth={2.5} />
                  </View>

                  <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search for dishes or restaurants"
                    placeholderTextColor={colors.textTertiary}
                    style={styles.searchInput}
                    onSubmitEditing={() => handleSaveSearch(query)}
                    returnKeyType="search"
                    autoFocus={!route.params?.initialQuery}
                  />

                  {isQueryActive && (
                    <TouchableOpacity
                      onPress={() => setQuery('')}
                      style={styles.clearInputButton}
                      activeOpacity={0.8}
                    >
                      <X size={18} color={colors.textMuted} strokeWidth={2.5} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* --- CONTENT CONDITIONAL STATES --- */}
          {isSearching ? (
            <View style={{ paddingVertical: 40 }}>
              <Loader message="Searching..." fullScreen={false} />
            </View>
          ) : !isQueryActive ? (
            // --- DEFAULT STATE: TRENDING & RECENT ---
            <>
              {/* Trending Searches */}
              <View style={styles.sectionBlock}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionHeadingTrending}>Trending Searches</Text>
                  <View style={styles.sectionDividerPad}>
                    <View style={styles.sectionDivider} />
                  </View>
                </View>

                <View style={styles.chipsWrap}>
                  {trendingSearches.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.searchChip}
                      activeOpacity={0.88}
                      onPress={() => handleSelectSearch(item)}
                    >
                      <GlassLayer radius={16} />
                      <Text style={styles.searchChipText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Recent Searches */}
              <View style={styles.recentSectionBlock}>
                <View style={styles.recentHeaderRow}>
                  <Text style={styles.sectionHeadingRecent}>Recent Searches</Text>
                  {recentList.length > 0 && (
                    <TouchableOpacity activeOpacity={0.8} onPress={handleClearAll}>
                      <Text style={styles.clearAllText}>Clear All</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.recentList}>
                  {recentList.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.recentCard}
                      activeOpacity={0.9}
                      onPress={() => handleSelectSearch(item.title)}
                    >
                      <GlassLayer radius={24} androidTint="rgba(8, 12, 18, 0.16)" />

                      <View style={styles.recentCardLeft}>
                        <View style={styles.recentIconShell}>
                          <History size={18} color="#71717A" strokeWidth={2.3} />
                        </View>

                        <View style={styles.recentCopyBlock}>
                          <Text style={styles.recentTitle}>{item.title}</Text>
                          <Text style={styles.recentSubtitle}>{item.subtitle}</Text>
                        </View>
                      </View>

                      <ArrowUpLeft size={15} color="#52525B" strokeWidth={2.2} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          ) : !hasResults ? (
            // --- EMPTY RESULTS ---
            <View style={styles.noResultsCard}>
              <GlassLayer radius={24} />
              <Search size={48} color={colors.textTertiary} strokeWidth={1.5} />
              <Text style={styles.noResultsTitle}>No results found</Text>
              <Text style={styles.noResultsSubtitle}>
                We couldn't find any dishes or restaurants matching "{query}".
              </Text>
            </View>
          ) : (
            // --- SEARCH RESULTS LIST ---
            <View style={styles.resultsContainer}>
              {/* Dishes results */}
              {searchProducts.length > 0 && (
                <View style={styles.sectionBlock}>
                  <Text style={styles.resultsHeading}>Dishes matching "{query}"</Text>
                  <View style={styles.resultsList}>
                    {searchProducts.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.menuCardSmall}
                        activeOpacity={0.92}
                      >
                        <View style={styles.menuCardSmallContent}>
                          <View>
                            <Image
                              source={
                                item?.image
                                  ? { uri: Constant.ImageURL + item.image }
                                  : ImagePath.noProductPlaceholder
                              }
                              style={styles.menuImageSmall}
                            />
                            <View
                              style={{
                                position: 'absolute',
                                top: 6,
                                left: 6,
                              }}
                            >
                              {item?.type === 'Veg' ? (
                                <View
                                  style={{
                                    height: 20,
                                    width: 20,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 4,
                                    borderWidth: 3,
                                    borderColor: colors.success,
                                  }}
                                >
                                  <Circle
                                    size={10}
                                    color={colors.success}
                                    fill={colors.success}
                                  />
                                </View>
                              ) : item?.type === 'Non-Veg' ? (
                                <View
                                  style={{
                                    height: 20,
                                    width: 20,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 4,
                                    borderWidth: 3,
                                    borderColor: colors.nonVeg,
                                  }}
                                >
                                  <Triangle
                                    size={10}
                                    color={colors.nonVeg}
                                    fill={colors.nonVeg}
                                  />
                                </View>
                              ) : null}
                            </View>
                          </View>

                          <View style={styles.smallTextArea}>
                            <View style={styles.smallTitleRow}>
                              <Text style={styles.smallTitle} numberOfLines={2}>
                                {item?.name}
                              </Text>
                              <Text style={styles.smallPrice}>
                                ₹{item?.price}
                              </Text>
                            </View>
                            <Text style={styles.smallDescription} numberOfLines={2}>
                              {item?.description}
                            </Text>
                            <View style={styles.smallBottomRow}>
                              <View style={styles.smallTagView}>
                                <Text style={styles.smallTag} numberOfLines={1}>
                                  {item?.shop_name}
                                </Text>
                              </View>
                              {getCartQtyCount({
                                product_id: item.product_id,
                                variant_id: item.variant_id,
                              }) > 0 ? (
                                <View style={styles.qtyPillSmall}>
                                  <TouchableOpacity
                                    style={styles.qtyButtonSmall}
                                    activeOpacity={0.85}
                                    onPress={() => {
                                      removeProduct({
                                        product_id: item.product_id,
                                        variant_id: item.variant_id,
                                        shop_id:
                                          item?.shop_id || '',
                                        quantity: 1,
                                      });
                                    }}
                                  >
                                    <Minus
                                      size={12}
                                      color={colors.primary}
                                      strokeWidth={2.6}
                                    />
                                  </TouchableOpacity>
                                  <Text style={styles.qtyTextSmall}>
                                    {getCartQtyCount({
                                      product_id: item.product_id,
                                      variant_id: item.variant_id,
                                    })}
                                  </Text>
                                  <TouchableOpacity
                                    style={styles.qtyButtonSmall}
                                    activeOpacity={0.85}
                                    onPress={() => {
                                      handleAddToCart({
                                        product_id: item.product_id,
                                        variant_id: item.variant_id,
                                        shop_id:
                                          item?.shop_id || '',
                                        quantity: 1,
                                      });
                                    }}
                                  >
                                    <Plus
                                      size={12}
                                      color={colors.primary}
                                      strokeWidth={2.6}
                                    />
                                  </TouchableOpacity>
                                </View>
                              ) : (
                                <TouchableOpacity
                                  style={styles.addButtonSmall}
                                  activeOpacity={0.9}
                                  onPress={() => {
                                    handleAddToCart({
                                      product_id: item.product_id,
                                      variant_id: item.variant_id,
                                      shop_id:
                                        item?.shop_id || '',
                                      quantity: 1,
                                    });
                                  }}
                                >
                                  <Plus
                                    size={12}
                                    color={colors.background}
                                    strokeWidth={3}
                                  />
                                </TouchableOpacity>
                              )}
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Restaurants results */}
              {searchShops.length > 0 && (
                <View style={styles.sectionBlock}>
                  <Text style={styles.resultsHeading}>Restaurants matching "{query}"</Text>
                  <View style={styles.resultsList}>
                    {searchShops.map((restaurant, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.restaurantCard}
                        onPress={() =>
                          navigation.navigate('RestaurantDetails', {
                            shopId: restaurant?.shop_id,
                          })
                        }
                      >
                        <Image
                          source={
                            restaurant?.image
                              ? { uri: Constant.ImageURL + restaurant?.image }
                              : ImagePath.noShopPlaceholder
                          }
                          style={styles.restaurantImage}
                        />
                        <View style={styles.restaurantInfo}>
                          <View style={styles.restaurantHeader}>
                            <Text style={styles.restaurantName}>
                              {restaurant?.name}
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 4,
                              }}
                            >
                              <StarIcon
                                size={12}
                                color={colors.primary}
                                fill={colors.primary}
                              />
                              <Text style={styles.badgeText}>
                                {restaurant?.rating || '0.0'}
                              </Text>
                            </View>
                          </View>
                          <Text style={styles.restaurantDetails}>
                            {restaurant?.type} - {restaurant?.time}
                          </Text>
                          {restaurant?.have_discount ? (
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 5,
                                marginTop: 5,
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                paddingHorizontal: 8,
                                paddingVertical: 5,
                                borderRadius: 6,
                                alignSelf: 'flex-start',
                              }}
                            >
                              <BadgePercent size={15} color={colors.primary} />
                              <Text style={styles.badgeText}>
                                {restaurant?.offer}
                              </Text>
                            </View>
                          ) : null}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      <PopupMessage
        title={'Replace cart items?'}
        description={
          'Your cart contains items from another restaurant. Do you want to replace them with items from this restaurant?'
        }
        isVisible={duplicateRestaurenProduct?.product_id ? true : false}
        onBtn1Press={() => setDuplicateRestaurenProduct(null)}
        onBtn2Press={handleReplaceCartItem}
        btn2Name="Replace"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 150,
  },
  header: {
    width: '100%',
    paddingTop: 24,
    paddingRight: 24,
    paddingBottom: 16,
    paddingLeft: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  cartBadgeText: {
    color: colors.black,
    fontSize: typography.caption - 2,
    fontWeight: '800',
  },
  main: {
    paddingHorizontal: layout.screenPadding,
    gap: 32,
    paddingTop: 24,
  },
  heroSearchSection: {
    width: '100%',
    gap: 24,
  },
  heroHeadingContainer: {
    width: '100%',
    alignItems: 'center',
  },
  heroHeading: {
    width: 275,
    color: colors.textPrimary,
    fontSize: typography.display2xl,
    lineHeight: 45,
    letterSpacing: -0.9,
    fontWeight: '800',
    textAlign: 'center',
  },
  heroHeadingAccent: {
    color: colors.primary,
    fontStyle: 'italic',
    fontWeight: '800',
  },
  searchFieldContainer: {
    position: 'relative',
    width: '100%',
    height: 72,
  },
  searchGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 24,
  },
  searchFieldCard: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  searchFieldContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  searchIconSlot: {
    width: 24,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: colors.textPrimary,
    fontSize: typography.md,
    fontWeight: '600',
    padding: 0,
  },
  clearInputButton: {
    width: 32,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionBlock: {
    width: '100%',
    gap: 20,
  },
  sectionHeaderRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeadingTrending: {
    color: 'rgba(245, 158, 11, 0.8)',
    fontSize: typography.sm,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  sectionDividerPad: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  sectionDivider: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  chipsWrap: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 12,
    rowGap: 12,
  },
  searchChip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  searchChipText: {
    color: colors.textSoftLight,
    fontSize: typography.body,
    lineHeight: 20,
    fontWeight: '600',
  },
  recentSectionBlock: {
    width: '100%',
    paddingTop: 8,
    gap: 20,
  },
  recentHeaderRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionHeadingRecent: {
    color: colors.textTertiary,
    fontSize: typography.sm,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  clearAllText: {
    color: 'rgba(245, 158, 11, 0.6)',
    fontSize: typography.caption,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  recentList: {
    width: '100%',
    gap: 12,
  },
  recentCard: {
    width: '100%',
    height: 72,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  recentCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  recentIconShell: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentCopyBlock: {
    justifyContent: 'center',
  },
  recentTitle: {
    color: colors.textPrimary,
    fontSize: typography.md,
    lineHeight: 22,
    fontWeight: '700',
  },
  recentSubtitle: {
    color: colors.textTertiary,
    fontSize: typography.sm,
    lineHeight: 16,
    fontWeight: '400',
  },
  resultsContainer: {
    width: '100%',
    gap: 32,
  },
  resultsHeading: {
    color: 'rgba(245, 158, 11, 0.8)',
    fontSize: typography.sm,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  resultsList: {
    width: '100%',
    gap: 16,
  },
  dishCard: {
    width: '100%',
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    flexDirection: 'row',
    gap: 16,
    overflow: 'hidden',
    alignItems: 'center',
  },
  dishImage: {
    width: 88,
    height: 88,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  dishInfo: {
    flex: 1,
    gap: 4,
  },
  dishHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dishName: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.md,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginRight: 8,
  },
  dishTypeBadge: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
  },
  dishTypeDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  dishShopName: {
    color: colors.textMuted,
    fontSize: typography.sm,
    fontWeight: '500',
  },
  dishDesc: {
    color: colors.textTertiary,
    fontSize: typography.sm,
    lineHeight: 18,
  },
  dishFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  dishPrice: {
    color: colors.primary,
    fontSize: typography.lg,
    fontWeight: '700',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  addButtonText: {
    color: colors.black,
    fontSize: typography.body - 2,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  qtyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 2,
  },
  qtyBtn: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    color: colors.textPrimary,
    fontSize: typography.body - 1,
    fontWeight: '700',
    minWidth: 16,
    textAlign: 'center',
  },

  noResultsCard: {
    width: '100%',
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    overflow: 'hidden',
  },
  noResultsTitle: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    fontWeight: '700',
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  noResultsSubtitle: {
    color: colors.textTertiary,
    fontSize: typography.body,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 260,
  },
  // --- SMALL CARD VARIANT (USED IN DISH RESULTS) ---
  menuCardSmall: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    overflow: 'hidden',
  },
  menuCardSmallContent: {
    flex: 1,
    marginHorizontal: 13,
    marginVertical: 19,
    flexDirection: 'row',
  },
  menuImageSmall: {
    width: 96,
    height: 96,
    borderRadius: 8,
  },
  smallTextArea: {
    marginLeft: 16,
    flex: 1,
  },
  smallTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    flexWrap: 'wrap',
  },
  smallTitle: {
    flex: 1,
    flexShrink: 1,
    color: colors.textPrimary,
    fontSize: typography.md,
    fontWeight: '700',
    lineHeight: 24,
  },
  smallPrice: {
    marginLeft: 'auto',
    color: colors.primary,
    fontSize: typography.md,
    fontWeight: '700',
    lineHeight: 24,
    alignSelf: 'flex-start',
    textAlign: 'right',
  },
  smallDescription: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: typography.sm,
    fontWeight: '400',
    lineHeight: 19.5,
  },
  smallBottomRow: {
    marginTop: 10,
    height: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallTagView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    maxWidth: '80%',
  },
  smallTag: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '700',
    lineHeight: 15,
    letterSpacing: 1,
  },
  addButtonSmall: {
    width: 30,
    height: 30,
    borderRadius: 11,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyPillSmall: {
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 176, 0, 0.3)',
    backgroundColor: 'rgba(255, 176, 0, 0.12)',
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  qtyButtonSmall: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyTextSmall: {
    color: colors.primary,
    fontSize: typography.smPlus,
    fontWeight: '700',
  },
  // --- RESTAURANT CARD (USED IN RESTAURANT RESULTS) ---
  restaurantCard: {
    backgroundColor: colors.glass,
    padding: 16,
    borderRadius: 24,
    flexDirection: 'row',
    gap: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  restaurantInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantName: {
    color: colors.textPrimary,
    fontSize: typography.md,
    fontWeight: 'bold',
  },
  restaurantDetails: {
    color: colors.textMuted,
    fontSize: typography.sm,
    marginTop: 4,
    marginBottom: 8,
  },
  restaurantBadges: {
    flexDirection: 'row',
    gap: 12,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    fontWeight: 'bold',
  },
});

export default SearchScreen;
