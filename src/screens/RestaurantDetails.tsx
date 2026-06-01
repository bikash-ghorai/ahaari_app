/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import {
  Circle,
  Clock3,
  Minus,
  Plus,
  Search,
  Star,
  Triangle,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

import { colors, layout, typography } from '../constants/theme';
import Header from '../components/Header';
import { getRestaurantDetails } from '../redux/app/appAction';
import { useDispatch } from '../redux/store';
import { ImagePath } from '../constants/ImagePath';
import { IProduct, IRestaurantDetails, IVariant } from '../types';
import { Constant } from '../constants/Constant';
import { useCart } from '../hooks';
import PopupMessage from '../components/PopupMessage';

const SCREEN_HEIGHT = Dimensions.get('window').height;
// const signatureDishes: MenuItem[] = [
//   {
//     id: 'truffle-zen-garden',
//     title: 'Truffle Zen Garden',
//     description:
//       'Micro-greens, black truffle shavings,\nand honey balsamic glaze.',
//     price: '$24',
//     calories: '180 kcal',
//     image:
//       'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=320&q=80',
//   },
//   {
//     id: 'midnight-wagyu',
//     title: 'Midnight Wagyu',
//     description: 'A5 Grade Wagyu with a charcoal-\ninfused butter reduction.',
//     price: '$85',
//     calories: '420 kcal',
//     image:
//       'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=320&q=80',
//   },
//   {
//     id: 'saffron-scallops',
//     title: 'Saffron Scallops',
//     description: 'Hand-dived scallops with a molecular\nsaffron cloud.',
//     price: '$42',
//     calories: '210 kcal',
//     image:
//       'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=320&q=80',
//   },
// ];

interface IProps {
  route: {
    params: {
      shopId: string;
    };
  };
}

const RestaurantDetails = (props: IProps) => {
  const dispatch = useDispatch();
  const shopId = props?.route?.params?.shopId || '';

  const { getCartQtyCount, addProduct, removeProduct } = useCart();
  const [duplicateRestaurenProduct, setDuplicateRestaurenProduct] =
    useState<any>(null);

  const [selectedItem, setSelectedItem] = useState<IProduct | null>(null);
  const [selectedTempVariant, setSelectedTempVariant] =
    useState<IVariant | null>(null);
  const sheetRef = useRef<BottomSheet>(null);
  const scrollRef = useRef<ScrollView>(null);
  const heroHeightRef = useRef<number>(0);
  // const snapPoints = useMemo(() => ['48%', '72%'], []);

  const [shopDetails, setShopDetails] = useState<IRestaurantDetails | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const [searchText, setSearchText] = useState<any>(null);
  const [filteredProducts, setFilteredProducts] = useState<Array<IProduct>>([]);

  useEffect(() => {
    if (shopId) {
      handleGetRestaurantDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopId]);

  const handleGetRestaurantDetails = () => {
    dispatch(getRestaurantDetails(shopId))
      .unwrap()
      .then(({ data }) => {
        if (data) {
          setShopDetails(data);
          setSelectedCategory(data.categories[0]);
          setFilteredProducts(data.categories[0].products);
        }
      })
      .catch((error: any) => {
        console.error('Error fetching restaurant details:', error);
      });
  };

  const openPreview = (item: IProduct) => {
    setSelectedItem(item);
    setSelectedTempVariant(item.variants?.[0] || null);
    sheetRef.current?.snapToIndex(0);
  };

  const closePreview = () => {
    sheetRef.current?.close();
  };

  const handleScrollToStickyHeader = () => {
    scrollRef.current?.scrollTo({ y: heroHeightRef.current, animated: true });
  };

  const handleSearch = (text: string, products: IProduct[]) => {
    if (text.trim() === '') {
      setFilteredProducts(products || []);
    } else {
      const filtered = products.filter((product: IProduct) =>
        product.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredProducts(filtered || []);
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

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Restaurant Details"
        showCartButton={true}
        containerStyle={{ paddingHorizontal: layout.screenPadding }}
      />
      {shopDetails ? (
        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[1]}
        >
          <View
            style={styles.heroSection}
            onLayout={e => {
              heroHeightRef.current = e.nativeEvent.layout.height;
            }}
          >
            <Image
              source={
                shopDetails?.shop?.image
                  ? { uri: Constant.ImageURL + shopDetails.shop.image }
                  : ImagePath.noShopPlaceholder
              }
              style={styles.heroImage}
            />

            <View style={styles.heroGlowLarge} />
            <View style={styles.heroGlowSmall} />

            <LinearGradient
              colors={[
                'rgba(12, 14, 18, 0.08)',
                'rgba(12, 14, 18, 0.62)',
                'rgba(12, 14, 18, 0.92)',
              ]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.heroGradient}
            />

            <View style={styles.heroDetails}>
              <Text style={styles.heroKicker}>
                {shopDetails?.shop?.address}
              </Text>
              <Text style={styles.heroTitle}>{shopDetails?.shop?.name}</Text>

              <View style={styles.metaRow}>
                <View style={styles.ratingRow}>
                  <Star
                    size={14}
                    color={colors.primary}
                    fill={colors.primary}
                    strokeWidth={1.9}
                  />
                  <Text style={styles.metaStrong}>
                    {shopDetails?.shop?.rating || '0.0'}
                  </Text>
                </View>
                <View style={styles.metaDivider} />
                {shopDetails?.shop?.delivery_time ? (
                  <View style={styles.timeRow}>
                    <Clock3
                      size={15}
                      color={colors.textMuted}
                      strokeWidth={2.1}
                    />
                    <Text style={styles.metaStrong}>
                      {shopDetails?.shop?.delivery_time}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          </View>

          <View style={styles.stickySection}>
            <View style={styles.stickyCard}>
              <BlurView
                style={styles.bottomNavBlur}
                blurType="dark"
                blurAmount={15}
                blurRadius={10}
                downsampleFactor={1}
                overlayColor="transparent"
                reducedTransparencyFallbackColor="rgba(0, 0, 0, 0)"
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
                contentContainerStyle={styles.categoryScrollContent}
              >
                {shopDetails?.categories && shopDetails?.categories.length > 0
                  ? shopDetails?.categories.map((category, index) => {
                      const isActive =
                        selectedCategory?.category_id === category?.category_id;

                      return (
                        <TouchableOpacity
                          key={index}
                          activeOpacity={0.9}
                          style={
                            isActive
                              ? styles.categoryPillActive
                              : styles.categoryPill
                          }
                          onPress={() => {
                            setSelectedCategory(category);
                            handleSearch(
                              searchText || '',
                              category?.products || [],
                            );
                            handleScrollToStickyHeader();
                          }}
                        >
                          <Text
                            style={
                              isActive
                                ? styles.categoryPillTextActive
                                : styles.categoryPillText
                            }
                          >
                            {category?.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })
                  : null}
              </ScrollView>

              <View style={styles.searchBar}>
                <Search
                  size={18}
                  color="rgba(170, 171, 176, 0.7)"
                  strokeWidth={2.1}
                />
                <TextInput
                  value={searchText}
                  onChangeText={txt => {
                    handleSearch(txt, selectedCategory?.products || []);
                    setSearchText(txt);
                  }}
                  onFocus={handleScrollToStickyHeader}
                  placeholder="Search through 200+ delicacies..."
                  placeholderTextColor={colors.textMuted}
                  style={[styles.inputText]}
                />
              </View>
            </View>
          </View>

          <View style={styles.menuSection}>
            {/* <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Signature Dishes</Text>
            <View style={styles.sectionDivider} />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.signatureList}
          >
            {signatureDishes.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuCardLarge}
                activeOpacity={0.92}
                onPress={() =>
                  openPreview({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    price: item.price,
                    image: item.image,
                    metaLabel: item.calories,
                    metaCaption: 'Calories',
                  })
                }
              >
                <View style={styles.menuCardLargeContent}>
                  <View style={styles.menuCardBody}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemDescription}>
                      {item.description}
                    </Text>
                    <View style={styles.itemBottomRow}>
                      <View>
                        <Text style={styles.itemPrice}>{item.price}</Text>
                        <Text style={styles.itemTag}>{item.calories}</Text>
                      </View>
                      {getQty(item.id) === 0 ? (
                        <TouchableOpacity
                          style={styles.addButtonLarge}
                          activeOpacity={0.9}
                          onPress={() => updateQty(item.id, 1)}
                        >
                          <Plus
                            size={12}
                            color={colors.primary}
                            strokeWidth={2.6}
                          />
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.qtyPill}>
                          <TouchableOpacity
                            style={styles.qtyButton}
                            activeOpacity={0.85}
                            onPress={() => updateQty(item.id, -1)}
                          >
                            <Minus
                              size={14}
                              color={colors.primary}
                              strokeWidth={2.6}
                            />
                          </TouchableOpacity>
                          <Text style={styles.qtyText}>{getQty(item.id)}</Text>
                          <TouchableOpacity
                            style={styles.qtyButton}
                            activeOpacity={0.85}
                            onPress={() => updateQty(item.id, 1)}
                          >
                            <Plus
                              size={14}
                              color={colors.primary}
                              strokeWidth={2.6}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.menuImageOrbWrap}>
                    <View style={styles.menuImageOrbGlow} />
                    <Image
                      source={{ uri: item.image }}
                      style={styles.menuImageOrb}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView> */}

            <View style={styles.sectionHeaderAlt}>
              <Text style={styles.sectionTitle}>Sommelier Selection</Text>
              <View style={styles.sectionDividerAlt} />
            </View>

            <View style={styles.sommelierList}>
              {filteredProducts && filteredProducts.length > 0 ? (
                filteredProducts.map((item, ind) => {
                  const isOneItemAvailable = item.variants.some(
                    (variant: IVariant) => variant.status === 'Available',
                  );
                  return (
                    <TouchableOpacity
                      key={ind}
                      style={styles.menuCardSmall}
                      activeOpacity={0.92}
                      onPress={() => openPreview(item)}
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
                            ) : (
                              <View
                                style={{
                                  height: 20,
                                  width: 20,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  borderRadius: 4,
                                  borderWidth: 3,
                                  borderColor: colors.red,
                                }}
                              >
                                <Triangle
                                  size={10}
                                  color={colors.red}
                                  fill={colors.red}
                                />
                              </View>
                            )}
                          </View>
                        </View>

                        <View style={styles.smallTextArea}>
                          <View style={styles.smallTitleRow}>
                            <Text style={styles.smallTitle} numberOfLines={2}>
                              {item?.name}
                            </Text>
                            <Text style={styles.smallPrice}>
                              ₹{item.variants[0]?.price}
                            </Text>
                          </View>
                          <Text style={styles.smallDescription}>
                            {item?.description}
                          </Text>
                          <View style={styles.smallBottomRow}>
                            {/* <Text style={styles.smallTag}>{item.tag}</Text> */}
                            <View />
                            {!isOneItemAvailable ? (
                              <View style={styles.outOfStockBadge}>
                                <Text style={styles.outOfStockBadgeText}>
                                  Out of stock
                                </Text>
                              </View>
                            ) : getCartQtyCount({
                                product_id: item.product_id,
                              }) > 0 ? (
                              <View style={styles.qtyPillSmall}>
                                <TouchableOpacity
                                  style={styles.qtyButtonSmall}
                                  activeOpacity={0.85}
                                  onPress={() => {
                                    if (item.variants.length === 1) {
                                      removeProduct({
                                        product_id: item.product_id,
                                        variant_id: item.variants[0].variant_id,
                                        shop_id:
                                          shopDetails?.shop?.shop_id || '',
                                        quantity: 1,
                                      });
                                    } else {
                                      openPreview(item);
                                    }
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
                                    if (item.variants.length === 1) {
                                      handleAddToCart({
                                        product_id: item.product_id,
                                        variant_id: item.variants[0].variant_id,
                                        shop_id:
                                          shopDetails?.shop?.shop_id || '',
                                        quantity: 1,
                                      });
                                    } else {
                                      openPreview(item);
                                    }
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
                                  if (item.variants.length === 1) {
                                    handleAddToCart({
                                      product_id: item.product_id,
                                      variant_id: item.variants[0].variant_id,
                                      shop_id: shopDetails?.shop?.shop_id || '',
                                      quantity: 1,
                                    });
                                  } else {
                                    openPreview(item);
                                  }
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
                  );
                })
              ) : (
                <View style={{ padding: 24, alignItems: 'center' }}>
                  <Text
                    style={{
                      color: colors.textMuted,
                      fontSize: typography.body,
                    }}
                  >
                    No products found matching "{searchText}"
                  </Text>
                </View>
              )}
              {filteredProducts.length < 3 && (
                <View
                  style={{
                    height:
                      SCREEN_HEIGHT * 0.15 * (3 - filteredProducts.length),
                  }}
                />
              )}
            </View>
          </View>
        </ScrollView>
      ) : null}
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

      <BottomSheet
        ref={sheetRef}
        index={-1}
        // snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.sheetHandle}
        onClose={() => {
          setSelectedItem(null);
          setSelectedTempVariant(null);
        }}
      >
        <BlurView
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 10,
          }}
          blurType="dark"
          blurAmount={24}
          reducedTransparencyFallbackColor="rgba(18, 20, 24, 0.22)"
        />
        <BottomSheetView style={styles.sheetContent}>
          {selectedItem ? (
            <>
              <View style={styles.sheetImageWrap}>
                <Image
                  source={
                    selectedItem?.image
                      ? { uri: Constant?.ImageURL + selectedItem.image }
                      : ImagePath.noProductPlaceholder
                  }
                  style={styles.sheetImage}
                />
                <LinearGradient
                  colors={['rgba(12, 14, 18, 0.1)', 'rgba(12, 14, 18, 0.6)']}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.sheetImageOverlay}
                />
              </View>

              <View style={styles.sheetBody}>
                <View style={styles.sheetTitleRow}>
                  <Text style={styles.sheetTitle}>{selectedItem?.name}</Text>
                  {selectedItem?.variants &&
                    selectedItem.variants.length === 1 && (
                      <Text style={styles.sheetPrice}>
                        ₹{selectedItem.variants[0].price}
                      </Text>
                    )}
                </View>
                <Text style={styles.sheetDescription}>
                  {selectedItem?.description}
                </Text>

                {/* <View style={styles.sheetMetaRow}>
                  <View style={styles.sheetMetaPill}>
                    <Text style={styles.sheetMetaText}>
                      {selectedItem?.metaLabel}
                    </Text>
                  </View>
                </View> */}

                {selectedItem?.variants && selectedItem.variants.length > 1 && (
                  <View style={styles.variantsSection}>
                    <View style={styles.variantsList}>
                      {selectedItem.variants.map((variant, index) => {
                        const isSelected =
                          selectedTempVariant?.variant_id ===
                          variant.variant_id;

                        return (
                          <TouchableOpacity
                            key={index}
                            style={styles.variantItem}
                            activeOpacity={0.7}
                            onPress={() => setSelectedTempVariant(variant)}
                          >
                            <View style={styles.variantRadio}>
                              <View
                                style={[
                                  styles.radioOuter,
                                  isSelected && styles.radioOuterActive,
                                ]}
                              >
                                {isSelected && (
                                  <View style={styles.radioInner} />
                                )}
                              </View>
                            </View>

                            <View style={styles.variantTextContent}>
                              <Text style={styles.variantName}>
                                {variant.name}
                              </Text>
                            </View>

                            <Text style={styles.variantItemPrice}>
                              ₹{variant.price}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}

                <View style={styles.sheetActions}>
                  {!selectedTempVariant ||
                  selectedTempVariant.status !== 'Available' ? (
                    <View style={styles.sheetAddButton}>
                      <View
                        style={[
                          styles.sheetAddGradient,
                          { backgroundColor: 'rgba(255, 82, 82, 0.24)' },
                        ]}
                      >
                        <Text
                          style={{
                            color: '#FF9C9C',
                            fontSize: typography.body,
                            fontWeight: '700',
                          }}
                        >
                          Out of Stock
                        </Text>
                      </View>
                    </View>
                  ) : getCartQtyCount({
                      product_id: selectedItem.product_id,
                      variant_id: selectedTempVariant?.variant_id,
                    }) > 0 ? (
                    <View style={styles.sheetQtyPill}>
                      <TouchableOpacity
                        style={styles.sheetQtyButton}
                        activeOpacity={0.85}
                        onPress={() =>
                          removeProduct({
                            product_id: selectedItem.product_id,
                            variant_id: selectedTempVariant?.variant_id || '',
                            shop_id: shopDetails?.shop?.shop_id || '',
                            quantity: 1,
                          }).then(res => {
                            console.log('clg', res);
                          })
                        }
                      >
                        <Minus
                          size={16}
                          color={colors.primary}
                          strokeWidth={2.6}
                        />
                      </TouchableOpacity>
                      <Text style={styles.sheetQtyText}>
                        {getCartQtyCount({
                          product_id: selectedItem.product_id,
                          variant_id: selectedTempVariant?.variant_id,
                        })}
                      </Text>
                      <TouchableOpacity
                        style={styles.sheetQtyButton}
                        activeOpacity={0.85}
                        onPress={() =>
                          handleAddToCart({
                            product_id: selectedItem.product_id,
                            variant_id: selectedTempVariant?.variant_id || '',
                            shop_id: shopDetails?.shop?.shop_id || '',
                            quantity: 1,
                          })
                        }
                      >
                        <Plus
                          size={16}
                          color={colors.primary}
                          strokeWidth={2.6}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.sheetAddButton}
                      activeOpacity={0.9}
                      onPress={() =>
                        handleAddToCart({
                          product_id: selectedItem.product_id,
                          variant_id: selectedTempVariant?.variant_id || '',
                          shop_id: shopDetails?.shop?.shop_id || '',
                          quantity: 1,
                        })
                      }
                    >
                      <View
                        style={[
                          styles.sheetAddGradient,
                          { backgroundColor: colors.primary },
                        ]}
                      >
                        <Plus
                          size={16}
                          color={colors.onPrimaryDeep}
                          strokeWidth={2.6}
                        />
                        <Text style={styles.sheetAddText}>
                          Add to cart ₹{selectedTempVariant?.price || 0}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={styles.sheetCloseButton}
                    activeOpacity={0.9}
                    onPress={closePreview}
                  >
                    <Text style={styles.sheetCloseText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : null}
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bottomNavBlur: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    // backgroundColor: colors.overlayDarkStrong,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 128,
  },
  heroSection: {
    width: '100%',
    height: 397,
    overflow: 'hidden',
    position: 'relative',
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  heroGlowLarge: {
    position: 'absolute',
    width: 384,
    height: 384,
    borderRadius: 999,
    right: -96,
    top: -96,
    backgroundColor: 'rgba(255, 173, 58, 0.1)',
  },
  heroGlowSmall: {
    position: 'absolute',
    width: 256,
    height: 256,
    borderRadius: 999,
    left: -96,
    bottom: -58,
    backgroundColor: 'rgba(252, 183, 37, 0.05)',
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  heroDetails: {
    position: 'absolute',
    left: 32,
    right: 32,
    bottom: 32,
  },
  heroKicker: {
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: '600',
    lineHeight: 15,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  heroTitle: {
    color: colors.textPrimary,
    fontSize: typography.display2xl,
    fontWeight: '800',
    lineHeight: 40,
    letterSpacing: -1.8,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    gap: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaStrong: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '500',
    lineHeight: 20,
  },
  metaMuted: {
    color: colors.textMuted,
    fontSize: typography.body,
    fontWeight: '500',
    lineHeight: 20,
  },
  metaDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(70, 72, 76, 0.3)',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stickySection: {
    width: '100%',
    // paddingTop: 16,
    // paddingHorizontal: layout.screenPadding,
    // paddingBottom: 24,
  },
  stickyCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  categoryScroll: {
    height: 54,
  },
  categoryScrollContent: {
    alignItems: 'center',
    gap: 12,
    paddingRight: 16,
  },
  categoryPillActive: {
    height: 38,
    borderRadius: 99,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
  },
  categoryPill: {
    height: 38,
    borderRadius: 99,
    backgroundColor: 'rgba(29, 32, 37, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
  },
  categoryPillTextActive: {
    color: colors.onPrimaryDeep,
    fontSize: typography.body,
    fontWeight: '700',
    lineHeight: 20,
  },
  categoryPillText: {
    color: colors.textMuted,
    fontSize: typography.body,
    fontWeight: '500',
    lineHeight: 20,
  },
  searchBar: {
    marginTop: 16,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    overflow: 'hidden',
  },
  searchPlaceholder: {
    color: 'rgba(170, 171, 176, 0.5)',
    fontSize: typography.body,
    fontWeight: '400',
  },
  inputText: {
    flex: 1,
    color: colors.textSecondary,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: typography.body,
    lineHeight: 18,
    fontWeight: '500',
  },
  menuSection: {
    paddingTop: 16,
  },
  sectionHeader: {
    marginHorizontal: layout.screenPadding,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    fontWeight: '700',
    lineHeight: 28,
    letterSpacing: -0.5,
  },
  sectionDivider: {
    flex: 1,
    height: 1,
    marginLeft: 24,
    backgroundColor: 'rgba(70, 72, 76, 0.3)',
  },
  sectionHeaderAlt: {
    marginHorizontal: layout.screenPadding,
    marginTop: 16,
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionDividerAlt: {
    flex: 1,
    height: 1,
    marginLeft: 24,
    backgroundColor: 'rgba(70, 72, 76, 0.3)',
  },
  signatureList: {
    paddingHorizontal: layout.screenPadding,
    paddingRight: layout.screenPadding,
    flexDirection: 'row',
    gap: 16,
  },
  menuCardLarge: {
    width: 320,
    height: 180,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    overflow: 'hidden',
  },
  menuCardLargeContent: {
    flex: 1,
    marginHorizontal: layout.screenPadding,
    marginVertical: 25,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  menuCardBody: {
    width: 228,
    height: 130,
  },
  itemTitle: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    fontWeight: '700',
    lineHeight: 28,
  },
  itemDescription: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: typography.sm,
    fontWeight: '400',
    lineHeight: 19.5,
  },
  itemBottomRow: {
    marginTop: 4,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemPrice: {
    color: colors.primary,
    fontSize: typography.lg,
    fontWeight: '700',
    lineHeight: 28,
  },
  itemTag: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '700',
    lineHeight: 15,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  addButtonLarge: {
    width: 36,
    height: 36,
    borderRadius: 99,
    backgroundColor: 'rgba(255, 173, 58, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyPill: {
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 176, 0, 0.3)',
    backgroundColor: 'rgba(255, 176, 0, 0.12)',
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyButton: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    color: colors.primary,
    fontSize: typography.bodyPlus,
    fontWeight: '700',
  },
  menuImageOrbWrap: {
    width: 80,
    height: 80,
    position: 'relative',
    marginTop: -15,
  },
  menuImageOrbGlow: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
  },
  menuImageOrb: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  sommelierList: {
    paddingHorizontal: layout.screenPadding,
    gap: 16,
  },
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
  sheetBackground: {
    backgroundColor: colors.glass,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  sheetHandle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: layout.screenPadding,
    paddingTop: 8,
    paddingBottom: 18,
    gap: 16,
  },
  sheetImageWrap: {
    height: 180,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  sheetImage: {
    width: '100%',
    height: '100%',
  },
  sheetImageOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  sheetBody: {
    gap: 12,
  },
  sheetTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  sheetTitle: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.xl,
    fontWeight: '700',
    lineHeight: 28,
  },
  sheetPrice: {
    color: colors.primary,
    fontSize: typography.xl,
    fontWeight: '700',
    lineHeight: 28,
  },
  sheetDescription: {
    color: colors.textMuted,
    fontSize: typography.bodyPlus,
    lineHeight: 22,
  },
  sheetMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sheetMetaPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  sheetMetaText: {
    color: colors.textPrimary,
    fontSize: typography.captionPlus,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  sheetMetaCaption: {
    color: colors.textMuted,
    fontSize: typography.captionPlus,
    fontWeight: '600',
  },
  sheetActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  sheetAddButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sheetAddGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  sheetAddText: {
    color: colors.onPrimaryDeep,
    fontSize: typography.bodyPlus,
    fontWeight: '700',
  },
  sheetQtyPill: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 176, 0, 0.3)',
    backgroundColor: 'rgba(255, 176, 0, 0.12)',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetQtyButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetQtyText: {
    color: colors.textPrimary,
    fontSize: typography.bodyPlus,
    fontWeight: '700',
  },
  sheetCloseButton: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetCloseText: {
    color: colors.textPrimary,
    fontSize: typography.bodyPlus,
    fontWeight: '700',
  },
  variantsSection: {
    marginTop: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  variantsLabel: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    fontWeight: '700',
    lineHeight: 28,
    marginBottom: 6,
  },
  variantsSubtitle: {
    color: colors.textMuted,
    fontSize: typography.sm,
    fontWeight: '500',
    lineHeight: 19.5,
    marginBottom: 16,
  },
  variantsList: {
    gap: 12,
  },
  variantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    gap: 12,
  },
  variantRadio: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  variantTextContent: {
    flex: 1,
  },
  variantName: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '600',
    lineHeight: 20,
  },
  variantItemPrice: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '700',
    lineHeight: 20,
  },
  //
  outOfStockBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 82, 82, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 82, 82, 0.28)',
  },
  outOfStockBadgeText: {
    color: '#FF9C9C',
    fontSize: typography.captionPlus,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});

export default RestaurantDetails;
