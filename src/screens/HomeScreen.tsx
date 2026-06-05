/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  Animated,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  CompositeNavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  AlertTriangle,
  ArrowRight,
  BadgePercent,
  Bell,
  Calendar,
  ChevronDown,
  LocateFixed,
  MapPin,
  MapPinOff,
  Minus,
  Plus,
  Search,
  StarIcon,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, typography } from '../constants/theme';
import WeatherAlertTooltip from '../components/WeatherAlertTooltip';
import { useWeatherAlert } from '../contexts/WeatherAlertContext';
import type { RootStackParamList, RootTabParamList } from '../types/navigation';
import { navigate } from '../utils/navigationRef';
import { useDispatch, useSelector } from '../redux/store';
import { getAddressList, updateLocation } from '../redux/user/userAction';
import { Constant } from '../constants/Constant';
import { ImagePath } from '../constants/ImagePath';
import { homePageAPI } from '../redux/app/appAction';
import { IHomePageData } from '../types';
import { useCart } from '../hooks';
import { showToaster } from '../utils/toaster';
import { fetchUserCurrentLocation } from '../utils/helper';
import { setUserCurrentCoords } from '../redux/user/userSlice';

const GlassLayer = () =>
  Platform.OS === 'ios' ? (
    <BlurView
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      blurType="dark"
      blurAmount={25}
      reducedTransparencyFallbackColor="rgba(18, 20, 24, 0.18)"
    />
  ) : null;

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const CATEGORIES = [
  { id: '1', name: 'Biryani', emoji: '🍛' },
  { id: '2', name: 'Pizza', emoji: '🍕' },
  { id: '3', name: 'Burger', emoji: '🍔' },
  { id: '4', name: 'Chinese', emoji: '🥡' },
  { id: '5', name: 'Dessert', emoji: '🍰' },
  { id: '6', name: 'Rolls', emoji: '🌯' },
  { id: '7', name: 'Thali', emoji: '🍱' },
  { id: '8', name: 'Momos', emoji: '🥟' },
  { id: '9', name: 'Drinks', emoji: '🥤' },
  { id: '10', name: 'Ice Cream', emoji: '🍦' },
];

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useDispatch();
  const { addresses } = useSelector(state => state.user);
  const { userCurrentCoords } = useSelector(state => state.user);
  const { isBadWeather, show } = useWeatherAlert();
  const { getCartQtyCount, removeProduct, addProduct } = useCart();

  const [homePageData, setHomePageData] = useState<IHomePageData | null>(null);

  const [activeHeroIndex, setActiveHeroIndex] = React.useState(0);
  const heroFadeAnim = React.useRef(new Animated.Value(0)).current;
  const heroSlideAnim = React.useRef(new Animated.Value(24)).current;

  const [selectedAddressId, setSelectedAddressId] = React.useState('');
  const [isAddressSheetOpen, setIsAddressSheetOpen] = React.useState(false);
  const [isLocating, setIsLocating] = React.useState(false);
  const [currentPlace, setCurrentPlace] = React.useState<string | null>(null);

  const heroSlideCount = homePageData?.coupons.length || 0;

  const currentLocationLabel = React.useMemo(() => {
    if (currentPlace) {
      return currentPlace;
    }

    return 'Choose delivery address';
  }, [currentPlace]);

  const resolvedLocationLabel = isLocating
    ? 'Locating current position...'
    : currentLocationLabel;

  React.useEffect(() => {
    handleFetchHomePageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFetchHomePageData = () => {
    dispatch(homePageAPI())
      .unwrap()
      .then(({ data }) => {
        setHomePageData(data);
      })
      .catch(error => {
        console.log('Error fetching home page data:', error);
        setHomePageData(null);
      });
  };

  React.useEffect(() => {
    if (heroSlideCount < 2) {
      return;
    }

    const intervalId = setInterval(() => {
      setActiveHeroIndex(prev => (prev + 1) % heroSlideCount);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [heroSlideCount]);

  React.useEffect(() => {
    heroFadeAnim.setValue(0);
    heroSlideAnim.setValue(24);

    Animated.parallel([
      Animated.timing(heroFadeAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(heroSlideAnim, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeHeroIndex, heroFadeAnim, heroSlideAnim]);

  React.useEffect(() => {
    if (!userCurrentCoords) {
      setCurrentPlace(null);
      return;
    }

    let isActive = true;

    const reverseGeocode = async () => {
      try {
        if (!Constant.MapKey) {
          return;
        }

        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${userCurrentCoords.latitude},${userCurrentCoords.longitude}&key=${Constant.MapKey}&language=en`,
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        console.log('Reverse geocoding result:', data);
        const bestResult = Array.isArray(data?.results)
          ? data.results[0]
          : null;
        const plusCodeCompound = data?.plus_code?.compound_code;
        const place = plusCodeCompound || bestResult?.formatted_address;

        if (isActive && typeof place === 'string') {
          setCurrentPlace(place);
        }
      } catch (error) {
        console.log('reverse geocoding error:', error);
        if (isActive) {
          setCurrentPlace(null);
        }
      }
    };

    reverseGeocode();

    return () => {
      isActive = false;
    };
  }, [userCurrentCoords]);

  const handleGetAddress = () => {
    dispatch(getAddressList());
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <WeatherAlertTooltip />
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <View style={styles.logoBadge}>
              <GlassLayer />
              <Image source={ImagePath.logo} style={styles.avatar} />
            </View>
          </View>
          <View style={styles.userTextContent}>
            <Text style={styles.welcomeText} numberOfLines={1}>
              Ahaari
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.locationSelector}
              onPress={() => {
                setIsAddressSheetOpen(true);
                handleGetAddress();
              }}
            >
              <MapPin size={12} color={colors.primary} />
              <Text style={styles.locationText} numberOfLines={1}>
                {resolvedLocationLabel}
              </Text>
              <ChevronDown size={14} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerRightSize}
            onPress={() => navigation.navigate('Search')}
          >
            <GlassLayer />
            <Search size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerRightSize}
            onPress={() => {
              if (isBadWeather) {
                show();
              }
            }}
            accessibilityLabel="Weather warning"
          >
            <GlassLayer />
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

      {homePageData ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {homePageData?.event ? (
            <View style={styles.heroCard}>
              <GlassLayer />
              <View style={styles.heroImageContainer}>
                <Image
                  source={{
                    uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxGNL0DERG9T_7taHIeOdBtSkXq8JXFF91p8Ku5vFG2nq9Fp4D9CzarNep_RZao1ui5qQGiBjarEGJd2rNGW8mHo9sx1EDTXKlgo8jBBlmXibf6gO2ps9lBe3bmUF_J2X0JTjIXNG4YbjscmB_hpnU-zlDA4s3QBWJwz-IkaZ85CCtAuFd0opEClyacyiZgMCcrvmDNDiacCEkHHz9mx6M-eQm8mKJeVN72a4x3J6-8upK89Je--LYh0-LvsFgARxE-Ee75BXFM5Q',
                  }}
                  style={styles.heroImage}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0, 0, 0, 0.62)']}
                  start={{ x: 0.5, y: 0.25 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.heroOverlay}
                />
              </View>
              <View style={styles.heroContent}>
                <View style={styles.eventBadge}>
                  <Calendar size={12} color="#FFB000" />
                  <Text style={styles.eventBadgeText}>UPCOMING EVENT</Text>
                </View>
                <Text style={styles.heroTitle}>
                  Celebrate Chloe's Birthday Soon!
                </Text>
                <Text style={styles.heroSubtitle}>
                  Make her day special with her favorite artisanal treats and
                  desserts from the best bakeries.
                </Text>
                <TouchableOpacity style={styles.planButton}>
                  <Text style={styles.planButtonText}>Plan Party</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.heroCard}>
              <GlassLayer />
              <View style={styles.heroImageContainer}>
                {homePageData?.slides &&
                  homePageData?.slides[activeHeroIndex] ? (
                  <Animated.View
                    style={[
                      styles.heroImageMotion,
                      {
                        opacity: heroFadeAnim,
                        transform: [{ translateX: heroSlideAnim }],
                      },
                    ]}
                  >
                    <Image
                      source={{
                        uri:
                          Constant.ImageURL +
                          homePageData?.slides[activeHeroIndex].image,
                      }}
                      style={styles.heroImage}
                    />
                  </Animated.View>
                ) : null}
                <View style={styles.heroDots}>
                  {homePageData?.slides.map((slide, index) => (
                    <View
                      key={slide.id}
                      style={[
                        styles.heroDot,
                        index === activeHeroIndex ? styles.heroDotActive : null,
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* ── Category List ──────────────────────────────────── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
            contentContainerStyle={styles.categoryScrollContent}
          >
            {CATEGORIES.map((cat, index) => {
              const isActive = index === 0;
              return (
                <TouchableOpacity
                  key={cat.id}
                  activeOpacity={0.8}
                  style={styles.categoryItem}
                  onPress={() => {
                    navigation.navigate('Search');
                  }}
                >
                  <View
                    style={[
                      styles.categoryIconContainer,
                      isActive ? styles.categoryIconContainerActive : null,
                    ]}
                  >
                    <GlassLayer />
                    {/* <Image
                      source={{
                        uri: `https://delico.definescreen.com/uploads/categories/CAT1770731544.jpg`,
                      }}
                      style={styles.categoryIcon}
                    /> */}
                    <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                  </View>
                  <Text
                    style={[
                      styles.categoryLabel,
                      isActive ? styles.categoryLabelActive : null,
                    ]}
                    numberOfLines={1}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {homePageData?.todaySpecials &&
            homePageData?.todaySpecials.length > 0 ? (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Today's Specials</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScroll}
                contentContainerStyle={styles.horizontalScrollContent}
              >
                {homePageData?.todaySpecials.map((item, index) => (
                  <View key={index} style={styles.specialCard}>
                    <View style={styles.specialImageContainer}>
                      <GlassLayer />
                      <Image
                        source={
                          item?.image
                            ? { uri: Constant.ImageURL + item.image }
                            : ImagePath.noProductPlaceholder
                        }
                        style={styles.specialImage}
                      />
                      <View style={styles.priceBadge}>
                        <GlassLayer />
                        <Text style={styles.priceText}>₹{item?.price}</Text>
                      </View>
                    </View>
                    <View style={styles.smallBottomRow}>
                      <Text style={styles.specialTitle}>{item?.name}</Text>
                      {getCartQtyCount({ product_id: item.product_id }) > 0 ? (
                        <View style={styles.qtyPillSmall}>
                          <TouchableOpacity
                            style={styles.qtyButtonSmall}
                            activeOpacity={0.85}
                            onPress={() => {
                              removeProduct({
                                product_id: item?.product_id,
                                variant_id: item?.variant_id,
                                shop_id: item?.shop_id || '',
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
                            })}
                          </Text>
                          <TouchableOpacity
                            style={styles.qtyButtonSmall}
                            activeOpacity={0.85}
                            onPress={() => {
                              addProduct({
                                product_id: item.product_id,
                                variant_id: item?.variant_id,
                                shop_id: item?.shop_id || '',
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
                            addProduct({
                              product_id: item.product_id,
                              variant_id: item?.variant_id,
                              shop_id: item?.shop_id || '',
                              quantity: 1,
                            }).then(res => {
                              console.log('ress', res);
                              if (res.type === 'different_shop_error') {
                                showToaster(
                                  'Replaced cart items with the new product from a different restaurant.',
                                );
                                addProduct({
                                  product_id: item.product_id,
                                  variant_id: item?.variant_id,
                                  shop_id: item?.shop_id || '',
                                  quantity: 1,
                                  isRecreateCart: true,
                                });
                              }
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
                    <Text style={styles.shopName} numberOfLines={2}>
                      By Kolkata Biriyani House
                    </Text>
                    <Text style={styles.descText} numberOfLines={2}>
                      {item?.description}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </>
          ) : null}

          {homePageData?.coupons && homePageData?.coupons.length > 0 ? (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Active Promotions</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScroll}
                contentContainerStyle={styles.horizontalScrollContent}
              >
                {homePageData?.coupons.map((promo, index) => {
                  return (
                    <View key={index} style={styles.promoBanner}>
                      <View style={styles.promoBannerContent}>
                        <>
                          <View style={styles.promoBannerDiscount}>
                            <LinearGradient
                              colors={['#FF7351', '#FF5733']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                              style={styles.discountGradient}
                            >
                              {promo?.discount_type === 'Percentage' ? (
                                <Text style={styles.discountValue}>
                                  {promo?.discount}%
                                </Text>
                              ) : (
                                <Text style={styles.discountValue}>
                                  ₹{promo?.discount}
                                </Text>
                              )}
                              <Text style={styles.discountLabel}>OFF</Text>
                            </LinearGradient>
                          </View>
                          <View style={styles.promoBannerText}>
                            <Text
                              style={styles.promoBannerTitle}
                              numberOfLines={2}
                            >
                              {promo?.title}
                            </Text>
                            <View style={styles.promoCodeChip}>
                              <Text style={styles.promoCodeChipText}>
                                {promo?.code}
                              </Text>
                            </View>
                            <Text style={styles.promoExpiry}>
                              {promo?.expire_on}
                            </Text>
                          </View>
                        </>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </>
          ) : null}

          {homePageData?.shops && homePageData?.shops.length > 0 ? (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Featured Restaurants</Text>
              </View>
              <View style={styles.restaurantList}>
                {homePageData?.shops.map((restaurant, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.restaurantCard}
                    onPress={() =>
                      navigation.navigate('RestaurantDetails', {
                        shopId: restaurant?.shop_id,
                      })
                    }
                  >
                    <GlassLayer />
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
            </>
          ) : null}


          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chef's Recommendation</Text>
          </View>

          <View style={styles.chefsPickCard}>
            <GlassLayer />

            {/* Hero image */}
            <View style={styles.chefsPickImageWrap}>
              <Image
                source={ImagePath.noProductPlaceholder}
                style={styles.chefsPickImage}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.55)']}
                start={{ x: 0.5, y: 0.3 }}
                end={{ x: 0.5, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            </View>

            {/* Content */}
            <View style={styles.chefsPickContent}>
              {/* Meta row */}
              <View style={styles.chefsPickMetaRow}>
                <View style={styles.chefsChoiceBadge}>
                  <Text style={styles.chefsChoiceBadgeText}>CHEF'S CHOICE</Text>
                  <Text style={styles.chefsChoiceSep}>  •  </Text>
                  <Text style={styles.chefsChoiceRestaurant} numberOfLines={1}>
                    The Baking Company
                  </Text>
                </View>
                <View style={styles.chefsPickRatingPill}>
                  <StarIcon size={11} color={colors.primary} fill={colors.primary} />
                  <Text style={styles.chefsPickRatingText}>
                    4.8
                  </Text>
                </View>
              </View>

              {/* Dish name */}
              <Text style={styles.chefsPickName}>Dish Name</Text>

              {/* Description */}
              <Text style={styles.chefsPickDesc} numberOfLines={2}>
                Indulge in our chef's special - a heavenly chocolate lava cake with a gooey center, topped with a scoop of vanilla ice cream. A perfect blend of rich chocolate and creamy sweetness that will melt your heart.
              </Text>

              {/* Price + CTA row */}
              <View style={styles.chefsPickFooter}>
                <Text style={styles.chefsPickPrice}>
                  ₹1000
                </Text>
                <TouchableOpacity
                  style={styles.chefsPickOrderBtn}
                  activeOpacity={0.88}

                >
                  <Text style={styles.chefsPickOrderBtnText}>Order Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>


          {/* --- EXCLUSIVE OFFERS --- */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Exclusive Offers</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            <TouchableOpacity style={styles.offerCard} activeOpacity={0.9}>
              <GlassLayer />
              <View style={styles.offerGlowBlob} />
              <Text style={styles.offerTag}>LIMITED TIME</Text>
              <Text style={styles.offerTitle}>50% Off First Order</Text>
              <Text style={styles.offerDesc}>Experience gourmet dining at half the price.</Text>
              <View style={styles.offerAction}>
                <Text style={styles.offerActionText}>Claim Now</Text>
                <ArrowRight size={14} color={colors.primary} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.offerCard} activeOpacity={0.9}>
              <GlassLayer />
              <View style={styles.offerGlowBlob} />
              <Text style={styles.offerTag}>PREMIUM PERK</Text>
              <Text style={styles.offerTitle}>Free Delivery</Text>
              <Text style={styles.offerDesc}>On all gourmet selections this weekend.</Text>
              <View style={styles.offerAction}>
                <Text style={styles.offerActionText}>Order Now</Text>
                <ArrowRight size={14} color={colors.primary} />
              </View>
            </TouchableOpacity>
          </ScrollView>
        </ScrollView>
      ) : (
        <View style={styles.comingSoonSection}>
          <View style={styles.comingSoonIconContainer}>
            <MapPinOff size={48} color={colors.primary} strokeWidth={1.5} />
          </View>
          <Text style={styles.comingSoonTitle}>We're not in your neighborhood</Text>
          <Text style={styles.comingSoonSubTitle}>just yet.</Text>

          <Text style={styles.comingSoonSubtitle}>
            We haven&apos;t reached this area yet. Our team is working hard to expand coverage to your neighborhood soon.
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.comingSoonButton}
            onPress={() => {
              setIsAddressSheetOpen(true);
              handleGetAddress();
            }}
          >
            <Text style={styles.comingSoonButtonText}>Change Location</Text>
          </TouchableOpacity>
          {currentPlace && (
            <Text style={styles.comingSoonPlaceText} numberOfLines={1}>
              {currentPlace}
            </Text>
          )}
        </View>
      )}

      <Modal
        transparent
        animationType="slide"
        visible={isAddressSheetOpen}
        onRequestClose={() => setIsAddressSheetOpen(false)}
      >
        <View style={styles.sheetWrapper}>
          <Pressable
            style={styles.sheetBackdrop}
            onPress={() => setIsAddressSheetOpen(false)}
          />
          <View style={styles.sheetContainer}>
            <GlassLayer />
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Choose delivery address</Text>

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.useLocationCard}
              onPress={() => {
                setIsAddressSheetOpen(false);
                setIsLocating(true);
                fetchUserCurrentLocation()
                  .then((coords: any) => {
                    console.log('coords fetch success', coords);
                    if (coords && coords?.latitude && coords?.longitude) {
                      dispatch(setUserCurrentCoords(coords));
                      dispatch(
                        updateLocation({
                          latitude: coords.latitude,
                          longitude: coords.longitude,
                        }),
                      )
                        .unwrap()
                        .then(() => {
                          handleFetchHomePageData();
                        });
                      setSelectedAddressId('');
                    }
                  })
                  .finally(() => {
                    setIsLocating(false);
                  });
              }}
            >
              <GlassLayer />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <LocateFixed color={colors.primary} />

                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.useLocationTitle}>
                    Use current location
                  </Text>
                  <Text style={styles.useLocationSub}>
                    Detect your current address
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.sheetList}>
              {addresses && addresses.length > 0 ? (
                addresses.map(option => {
                  const isSelected = option?.address_id === selectedAddressId;

                  return (
                    <TouchableOpacity
                      key={option?.address_id}
                      activeOpacity={0.9}
                      style={[
                        styles.addressOption,
                        isSelected ? styles.addressOptionActive : null,
                      ]}
                      onPress={() => {
                        setSelectedAddressId(option?.address_id);
                        setIsAddressSheetOpen(false);
                        setCurrentPlace(option?.address);
                        dispatch(
                          updateLocation({
                            address_id: option?.address_id,
                          }),
                        )
                          .unwrap()
                          .then(() => {
                            handleFetchHomePageData();
                          });
                      }}
                    >
                      <GlassLayer />
                      <View style={styles.addressOptionHeader}>
                        <Text style={styles.addressTag}>{option?.type}</Text>
                        {isSelected ? (
                          <View style={styles.addressSelectedBadge}>
                            <Text style={styles.addressSelectedBadgeText}>
                              Selected
                            </Text>
                          </View>
                        ) : null}
                      </View>
                      <Text style={styles.addressLine}>{option?.address}</Text>
                      <Text style={styles.addressLine}>
                        {(option?.landmark ? option?.landmark + ',' : '') +
                          ' ' +
                          option?.pincode}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <Text
                  style={{
                    color: colors.textTertiary,
                    fontSize: typography.body,
                    fontWeight: '500',
                    textAlign: 'center',
                    marginTop: 10,
                    marginBottom: 24,
                  }}
                >
                  No saved addresses found. Please add a new address to get
                  started.
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.manageAddressButton}
              activeOpacity={0.9}
              onPress={() => {
                setIsAddressSheetOpen(false);
                navigate('AddAddress');
              }}
            >
              <Text style={styles.manageAddressText}>+ Add new addresses</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 12,
    minHeight: 70,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 1,
  },
  avatarContainer: {
    position: 'relative',
  },
  logoBadge: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
  },
  userTextContent: {
    gap: 2,
  },
  welcomeText: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    color: colors.textMuted,
    fontSize: typography.sm,
    maxWidth: "70%",
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  headerRightSize: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  heroCard: {
    marginHorizontal: layout.screenPadding,
    backgroundColor: colors.glass,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  heroImageContainer: {
    width: '100%',
    aspectRatio: 16 / 10,
    position: 'relative',
    overflow: 'hidden',
  },
  heroImageMotion: {
    width: '100%',
    height: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroDots: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  heroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  heroDotActive: {
    width: 20,
    backgroundColor: colors.primary,
    borderColor: 'rgba(255, 176, 0, 0.5)',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  heroContent: {
    padding: 24,
    gap: 16,
  },
  eventBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 176, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 99,
    alignSelf: 'flex-start',
  },
  eventBadgeText: {
    color: colors.primary,
    fontSize: typography.sm,
    fontWeight: 'bold',
  },
  heroTitle: {
    color: colors.textPrimary,
    fontSize: typography.xxl,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  heroSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 20,
  },
  planButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 24,
    paddingHorizontal: layout.screenPadding,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
    width: '100%',
  },
  planButtonText: {
    color: colors.black,
    fontSize: typography.md,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
    marginTop: 32,
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    fontWeight: 'bold',
  },
  viewAllText: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '500',
  },
  horizontalScroll: {
    paddingLeft: 24,
  },
  horizontalScrollContent: {
    paddingRight: 48,
    gap: 20,
  },
  // ── Categories ───────────────────────────────────────────────────────────
  categoryScrollContent: {
    paddingRight: 48,
    gap: 16,
  },
  categoryItem: {
    alignItems: 'center',
    width: 72,
  },
  categoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 8,
  },
  categoryIconContainerActive: {
    // backgroundColor: 'rgba(255, 176, 0, 0.12)',
    borderColor: 'rgba(255, 176, 0, 0.4)',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    // boxShadow: `0px 0px 10px rgba(255, 176, 0, 0.3)`,
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    resizeMode: 'contain',
  },
  categoryLabel: {
    color: colors.textMuted,
    fontSize: typography.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
  categoryLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  specialCard: {
    width: 280,
  },
  specialImageContainer: {
    backgroundColor: colors.glass,
    // padding: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    aspectRatio: 4 / 3,
    overflow: 'hidden',
  },
  specialImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  priceBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(53, 50, 50, 0.91)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  priceText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: typography.body,
  },
  specialTitle: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopName: {
    color: colors.textMuted,
    fontSize: typography.sm,
    marginTop: 4,
  },
  descText: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    marginTop: 12,
  },
  smallBottomRow: {
    marginTop: 15,
    height: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 5,
  },
  smallTag: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '700',
    lineHeight: 15,
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
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
  comingSoonSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  comingSoonIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 176, 0, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 176, 0, 0.15)',
    boxShadow: '0px 2px 100px rgba(255, 176, 0, 0.2)',
  },
  comingSoonTitle: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    // marginBottom: 12,
  },
  comingSoonSubTitle: {
    color: colors.primary,
    fontSize: 26,
    fontWeight: '800',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 15,
  },
  comingSoonPlaceText: {
    color: colors.primary,
    fontSize: typography.sm,
    // fontWeight: '700',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 80,
    // backgroundColor: 'rgba(255, 176, 0, 0.08)',
    // paddingHorizontal: 16,
    // paddingVertical: 6,
    // borderRadius: 20,
    // borderWidth: 1,
    // borderColor: 'rgba(255, 176, 0, 0.12)',
  },
  comingSoonSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 40,
  },
  comingSoonButton: {
    width: '100%',
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  comingSoonButtonText: {
    color: colors.black,
    // fontSize: typography.md,
    fontWeight: 'bold',
  },
  //---New
  promoBanner: {
    width: 320,
    height: 140,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glass,
    position: 'relative',
  },
  promoBannerBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  promoBannerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
    zIndex: 1,
    gap: 12,
  },
  promoBannerText: {
    flex: 1,
    gap: 8,
  },
  promoBannerTitle: {
    color: colors.textPrimary,
    fontSize: typography.md,
    fontWeight: '700',
    lineHeight: 20,
  },
  promoCodeChip: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 176, 0, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 176, 0, 0.5)',
  },
  promoCodeChipText: {
    color: colors.primary,
    fontSize: typography.sm,
    fontWeight: 'bold',
    letterSpacing: 0.4,
  },
  promoExpiry: {
    color: colors.textMuted,
    fontSize: typography.sm,
    fontWeight: '500',
  },
  promoBannerDiscount: {
    marginLeft: 2,
  },
  discountGradient: {
    // width: 80,
    paddingHorizontal: 10,
    height: 80,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  discountValue: {
    color: colors.black,
    fontSize: typography.displayXl,
    fontWeight: '900',
    lineHeight: 32,
  },
  discountLabel: {
    color: colors.black,
    fontSize: typography.sm,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
  restaurantList: {
    paddingHorizontal: layout.screenPadding,
    gap: 16,
  },
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
  sheetWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: colors.overlayDarkStrong,
  },
  sheetContainer: {
    backgroundColor: colors.surfaceDark,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingHorizontal: layout.screenPadding,
    paddingTop: 12,
    paddingBottom: 24,
    overflow: 'hidden',
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 46,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    marginBottom: 12,
  },
  sheetTitle: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    fontWeight: '700',
    marginBottom: 12,
  },
  sheetList: {
    gap: 12,
  },
  addressOption: {
    backgroundColor: colors.glass,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: 14,
    overflow: 'hidden',
  },
  addressOptionActive: {
    borderColor: 'rgba(255, 176, 0, 0.45)',
    backgroundColor: 'rgba(255, 176, 0, 0.08)',
  },
  addressOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  addressTag: {
    color: colors.textPrimary,
    fontSize: typography.md,
    fontWeight: '600',
  },
  addressLine: {
    color: colors.textMuted,
    fontSize: typography.sm,
    lineHeight: 18,
  },
  addressSelectedBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  addressSelectedBadgeText: {
    color: colors.black,
    fontSize: typography.caption,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  useLocationCard: {
    backgroundColor: colors.glass,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  useLocationTitle: {
    color: colors.primary,
    fontSize: typography.md,
    fontWeight: '700',
  },
  useLocationSub: {
    color: colors.textMuted,
    fontSize: typography.sm,
    marginTop: 4,
  },
  manageAddressButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  manageAddressText: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '600',
  },
  // ── Chef's Recommendation ────────────────────────────────────────────────────
  chefsPickCard: {
    marginHorizontal: layout.screenPadding,
    backgroundColor: colors.glass,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
  },
  chefsPickImageWrap: {
    width: '100%',
    aspectRatio: 16 / 9,
    position: 'relative',
    overflow: 'hidden',
  },
  chefsPickImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  chefsPickContent: {
    padding: 20,
    gap: 10,
  },
  chefsPickMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chefsChoiceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chefsChoiceBadgeText: {
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: '800',
    letterSpacing: 1,
  },
  chefsChoiceSep: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
  chefsChoiceRestaurant: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '600',
    maxWidth: 130,
  },
  chefsPickRatingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,176,0,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,176,0,0.28)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  chefsPickRatingText: {
    color: colors.primary,
    fontSize: typography.sm,
    fontWeight: '700',
  },
  chefsPickName: {
    color: colors.textPrimary,
    fontSize: typography.xxl,
    fontWeight: '800',
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  chefsPickDesc: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 20,
  },
  chefsPickFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  chefsPickPrice: {
    color: colors.primary,
    fontSize: typography.xxl,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  chefsPickOrderBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 999,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  chefsPickOrderBtnText: {
    color: colors.black,
    fontSize: typography.md,
    fontWeight: 'bold',
  },

  // --- EXCLUSIVE OFFERS ---
  offerCard: {
    minWidth: 300,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  offerGlowBlob: {
    position: 'absolute',
    top: -16,
    right: -16,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 173, 58, 0.2)', // Same as bg-primary/20
    opacity: 0.5,
    // In React Native, true blur requires @react-native-community/blur on an absolute layer
    // but a soft low-opacity circle perfectly mimics the radial glow effect here
  },
  offerTag: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  offerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  offerDesc: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 16,
  },
  offerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  offerActionText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
