/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { useIsFocused } from '@react-navigation/native';
import {
  ArrowRight,
  AlertTriangle,
  CreditCard,
  MapPin,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Tag,
  Wallet,
  SquareCheckBig,
  Square,
  Zap,
  Circle,
  Triangle,
} from 'lucide-react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { colors, layout, typography } from '../constants/theme';
import GlassLayer from '../components/GlassLayer';
import { useWeatherAlert } from '../contexts/WeatherAlertContext';
import { useCart } from '../hooks';
import { useDispatch, useSelector } from '../redux/store';
import {
  addCartItem,
  checkoutCart,
  removeCoupon,
} from '../redux/app/appAction';
import { ICartItemRes, IPaymentMethod } from '../types';
import { ImagePath } from '../constants/ImagePath';
import { Constant } from '../constants/Constant';
import { navigate } from '../utils/navigationRef';
import RazorpayCheckout from 'react-native-razorpay';
import { showToaster } from '../utils/toaster';
import Loader from '../components/Loader';

const { height } = Dimensions.get('window');

const CartScreen = () => {
  const { cartValue, addProduct, removeProduct, getCartQtyCount, emptyCart } =
    useCart();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const { userData } = useSelector(state => state.user);

  const isNonEmptyCart =
    cartValue && cartValue?.products && cartValue?.products.length > 0;

  const [vipEnabled, setVipEnabled] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<IPaymentMethod | ''>('');
  const [useWalletBalance, setUseWalletBalance] = useState(false);
  const [isShowLoader, setIsShowLoader] = useState(true);
  const { isBadWeather } = useWeatherAlert();

  const [originalCartValue, setOriginalCartValue] =
    useState<ICartItemRes | null>(null);

  const handleRemovePromo = () => {
    dispatch(removeCoupon())
      .unwrap()
      .then(() => {
        fetchCartDetails();
      });
  };

  const handleViewAllCoupons = () => {
    navigate('CouponList');
  };

  useEffect(() => {
    if (cartValue && isFocused && isNonEmptyCart) {
      fetchCartDetails();
    } else {
      setIsShowLoader(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartValue, isFocused, isNonEmptyCart]);

  const fetchCartDetails = () => {
    setIsShowLoader(true);
    setUseWalletBalance(false);
    dispatch(addCartItem(cartValue))
      .unwrap()
      .then(({ data }) => {
        console.log('data', data);
        setOriginalCartValue(data);
        setPaymentMethod(
          data.payment_method.cod.is_selected
            ? 'COD'
            : data.payment_method.online.is_selected
              ? 'Online'
              : '',
        );
      })
      .catch(error => {
        console.error('Error adding cart item:', error);
      })
      .finally(() => {
        setIsShowLoader(false);
      });
  };

  const totalAmount = useMemo(() => {
    if (originalCartValue) {
      const base =
        originalCartValue.sub_total +
        originalCartValue.delivery_charge +
        originalCartValue.tax;
      const vipCharge = vipEnabled ? originalCartValue.vip_charge : 0;
      const paymentCharge =
        paymentMethod === 'COD'
          ? originalCartValue.payment_method.cod.charge
          : originalCartValue.payment_method.online.charge;
      const extraCharges = originalCartValue.extra_charges.reduce(
        (sum, charge) => sum + charge.amount,
        0,
      );
      const discount =
        originalCartValue?.coupon?.applied &&
          originalCartValue?.coupon?.discount
          ? originalCartValue.coupon.discount
          : 0;
      return base + extraCharges + vipCharge + paymentCharge - discount;
    } else {
      return 0;
    }
  }, [originalCartValue, vipEnabled, paymentMethod]);

  const payableAmount = useMemo(() => {
    if (useWalletBalance) {
      return Math.max(
        0,
        totalAmount - (originalCartValue?.wallet_balance || 0),
      );
    } else {
      return totalAmount;
    }
  }, [totalAmount, useWalletBalance, originalCartValue]);

  const handleCheckout = () => {
    if (!originalCartValue?.address) {
      return showToaster(
        'Please select a delivery address before proceeding to checkout.',
      );
    }
    if (!paymentMethod) {
      return showToaster(
        'Please select a payment method before proceeding to checkout.',
      );
    }
    setIsShowLoader(true);
    dispatch(
      checkoutCart({
        is_vip: vipEnabled,
        payment_method: paymentMethod,
        tips: 0,
        use_wallet_balance: useWalletBalance,
      }),
    )
      .unwrap()
      .then(({ data }) => {
        console.log('data', data);
        if (data && data?.payment_type === 'COD') {
          setIsShowLoader(false);
          navigate('OrderConfirmed', {
            order_data: data,
          });
          emptyCart();
        } else {
          if (data?.gateway_info?.key) {
            var options = {
              description: data?.order_id,
              // image: ,
              currency: 'INR',
              key: data?.gateway_info?.key,
              amount: data?.gateway_info?.amount,
              name: 'Ahaari',
              order_id: data?.gateway_info?.order_id,
              prefill: {
                email: userData?.first_name,
                contact: userData?.phone,
                name: userData?.first_name + ' ' + userData?.last_name,
              },
              theme: {
                color: colors.primary,
                hide_topbar: true,
                backdrop_color: '#000',
              },
              modal: {
                escape: false,
                confirm_close: true,
              },
              hidden: {
                email: true,
                contact: true,
              },
              readonly: {
                contact: true,
                email: true,
                name: true,
              },
            };
            paynow({ options, orderCreateData: data });
          } else {
            setIsShowLoader(false);
            navigate('OrderFailed');
          }
        }
      })
      .catch(() => {
        setIsShowLoader(false);
        navigate('OrderFailed');
      });
  };

  const paynow = ({ options, orderCreateData }: any) => {
    RazorpayCheckout.open(options)
      .then(data => {
        console.log('payment success', data);
        navigate('OrderConfirmed', {
          order_data: orderCreateData,
        });
        emptyCart();
      })
      .catch(error => {
        console.log('error', error);

        navigate('OrderFailed');
      })
      .finally(() => {
        setIsShowLoader(false);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
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
            Your Cart
          </Text>
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: typography.xl,
              fontWeight: '700',
              letterSpacing: -0.3,
            }}
          >
            Curated Cart
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.glass,
              borderWidth: 1,
              borderColor: colors.glassBorder,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
            activeOpacity={0.9}
            onPress={() => navigate('Search')}
          >
            <GlassLayer radius={20} tint="rgba(18, 20, 24, 0.24)" />
            <Search size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
      {isShowLoader && <Loader />}
      {isNonEmptyCart && originalCartValue?.cart_id ? (
        <>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.heroCard}>
              <View style={styles.premiumChip}>
                <ShoppingCart size={14} color={colors.primary} />
                <Text style={styles.premiumChipText}>PREMIUM SELECTION</Text>
              </View>

              <Text style={styles.heroTitle}>
                {originalCartValue?.shop?.name || ''}
              </Text>
              <Text style={styles.heroSubtitle} numberOfLines={2}>
                {originalCartValue?.shop?.address || ''}
              </Text>
            </View>

            <View style={styles.addressCard}>
              <View style={styles.addressLeftBlock}>
                <View style={styles.addressIconWrap}>
                  <MapPin size={20} color={colors.primary} strokeWidth={2.1} />
                </View>

                {originalCartValue?.address ? (
                  <View style={styles.addressTextBlock}>
                    <Text style={styles.addressLabel}>Delivery Address</Text>
                    <Text style={styles.addressTitle}>
                      {originalCartValue?.address?.address +
                        ', ' +
                        (originalCartValue?.address?.landmark
                          ? originalCartValue?.address?.landmark + ', '
                          : '') +
                        originalCartValue?.address?.pincode}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.addressTextBlock}>
                    <Text style={styles.addressLabel}>Delivery Address</Text>
                    <Text style={styles.addressTitle}>
                      Please select an address
                    </Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={styles.changeAddressButton}
                activeOpacity={0.88}
                onPress={() =>
                  navigate('AddressesScreen', { routeFor: 'checkout' })
                }
              >
                <Text style={styles.changeAddressButtonText}>Change</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.promoCard}>
              <View style={styles.promoLeftBlock}>
                <View style={styles.promoIconBubble}>
                  <Tag size={18} color={colors.primary} />
                </View>

                <View>
                  <View style={styles.promoCodeRow}>
                    {originalCartValue?.coupon?.applied ? (
                      <>
                        <Text style={styles.promoCodeText}>
                          {originalCartValue?.coupon?.code || ''}
                        </Text>
                        <View style={styles.promoBadge}>
                          <Text style={styles.promoBadgeText}>Applied</Text>
                        </View>
                      </>
                    ) : (
                      <Text style={styles.promoCodeText}>
                        No coupon applied
                      </Text>
                    )}
                  </View>
                  {originalCartValue?.coupon?.applied ? (
                    <Text style={styles.promoSavingsText}>
                      You saved ₹
                      {originalCartValue?.coupon?.discount
                        ? originalCartValue?.coupon?.discount.toFixed(2)
                        : 0}
                      !
                    </Text>
                  ) : (
                    <Text style={styles.promoHintText}>
                      View all coupons to unlock savings.
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.promoActions}>
                {originalCartValue?.coupon?.applied ? (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleRemovePromo}
                  >
                    <Text style={styles.promoRemoveText}>Remove</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleViewAllCoupons}
                  >
                    <Text style={styles.promoApplyText}>View all</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.itemList}>
              {originalCartValue?.items &&
                originalCartValue?.items.length > 0 ? (
                originalCartValue?.items?.map((item, index) => (
                  <View key={index} style={styles.itemCard}>
                    <View>
                      <Image
                        source={
                          item?.image
                            ? { uri: Constant.ImageURL + item.image }
                            : ImagePath.noProductPlaceholder
                        }
                        style={styles.itemImage}
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
                              borderColor: colors.veg,
                            }}
                          >
                            <Circle
                              size={10}
                              color={colors.veg}
                              fill={colors.veg}
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

                    <View style={styles.itemInfo}>
                      <View style={styles.itemTopRow}>
                        <Text style={styles.itemName}>{item?.name}</Text>
                      </View>

                      <Text style={styles.itemSubtitle} numberOfLines={2}>
                        {item?.description}
                      </Text>

                      <View style={styles.itemBottomRow}>
                        <Text style={styles.itemPrice}>
                          ₹
                          {item?.status === 'Available'
                            ? item.price.toFixed(2)
                            : '0.00'}
                        </Text>
                        {item?.status === 'Available' ? (
                          <View style={styles.qtyControl}>
                            <Pressable
                              style={styles.qtyButton}
                              onPress={() => {
                                removeProduct({
                                  product_id: item?.product_id || '',
                                  variant_id: item?.variant_id,
                                  shop_id:
                                    originalCartValue?.shop?.shop_id || '',
                                  quantity: 1,
                                });
                              }}
                            >
                              <Minus size={18} color="#9BA3B5" />
                            </Pressable>
                            <Text style={styles.qtyText}>
                              {getCartQtyCount({ variant_id: item.variant_id })}
                            </Text>
                            <Pressable
                              onPress={() => {
                                addProduct({
                                  product_id: item?.product_id || '',
                                  variant_id: item?.variant_id,
                                  shop_id:
                                    originalCartValue?.shop?.shop_id || '',
                                  quantity: 1,
                                });
                              }}
                              style={styles.qtyButton}
                            >
                              <Plus size={18} color="#9BA3B5" />
                            </Pressable>
                          </View>
                        ) : (
                          <View style={styles.outOfStockBadge}>
                            <Text style={styles.outOfStockBadgeText}>
                              Out of stock
                            </Text>
                          </View>
                        )}
                      </View>
                      {/* {item?.status !== 'Available' ?
                        <Pressable style={{
                          position: "absolute",
                          top: -8,
                          right: -5,
                          backgroundColor: colors.accentTan,
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 10,
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                          onPress={() => {
                            removeProduct({
                              product_id: item?.product_id || '',
                              variant_id: item?.variant_id,
                              shop_id:
                                originalCartValue?.shop?.shop_id || '',
                              quantity: 10000,
                            });
                          }}
                        >
                          <Text style={{
                            color: colors.black,
                            fontSize: typography.caption,
                          }}>Remove</Text>
                        </Pressable> : null} */}
                    </View>
                  </View>
                ))
              ) : (
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: typography.body,
                    textAlign: 'center',
                  }}
                >
                  Your cart is empty.
                </Text>
              )}
            </View>

            {originalCartValue?.vip_charge &&
              originalCartValue?.vip_charge > 0 ? (
              <View style={styles.vipCard}>
                <View style={styles.vipLeftBlock}>
                  <View style={styles.vipIconBubble}>
                    <Zap
                      size={22}
                      color={colors.primary}
                      fill={colors.primary}
                    />
                  </View>

                  <View style={styles.vipTextBlock}>
                    <Text style={styles.vipTitle}>VIP Fast-Forward Order</Text>
                    <Text style={styles.vipSubtitle}>
                      Skip the queue for ₹
                      {originalCartValue.vip_charge.toFixed(2)}! Order becomes
                      top priority.
                    </Text>
                  </View>
                </View>

                <Pressable
                  onPress={() => setVipEnabled(value => !value)}
                  style={[
                    styles.toggleTrack,
                    vipEnabled && styles.toggleTrackActive,
                  ]}
                >
                  <View
                    style={[
                      styles.toggleThumb,
                      vipEnabled && styles.toggleThumbActive,
                    ]}
                  />
                </Pressable>
              </View>
            ) : null}

            {/* <View style={styles.recommendedSection}>
          <Text style={styles.recommendedTitle}>Recommended for You</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendedList}
          >
            {recommendedItems.map(item => (
              <View key={item.id} style={styles.recommendedCard}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.recommendedImage}
                />

                <View style={styles.recommendedMeta}>
                  <Text style={styles.recommendedName} numberOfLines={1}>
                    {item.name}
                  </Text>

                  <View style={styles.recommendedBottomRow}>
                    <Text style={styles.recommendedPrice}>
                      ${item.price.toFixed(2)}
                    </Text>

                    <TouchableOpacity
                      style={styles.recommendedAddButton}
                      activeOpacity={0.88}
                    >
                      <Plus
                        size={13}
                        color={colors.primary}
                        strokeWidth={2.9}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View> */}

            <View style={styles.paymentSection}>
              {originalCartValue?.wallet_balance &&
                originalCartValue?.wallet_balance > 0 ? (
                <View style={styles.walletSection}>
                  <View style={styles.walletCopyBlock}>
                    <Text style={styles.walletEyebrow}>Wallet balance</Text>
                    <Text style={styles.walletAmount}>
                      ₹{originalCartValue?.wallet_balance?.toFixed(2) || '0.00'}
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => setUseWalletBalance(value => !value)}
                    style={[]}
                  >
                    {useWalletBalance ? (
                      <SquareCheckBig color={colors.primary} />
                    ) : (
                      <Square color={colors.primary} />
                    )}
                  </Pressable>
                </View>
              ) : null}

              <Text style={styles.sectionTitle}>Payment Method</Text>

              <View style={styles.paymentGrid}>
                {originalCartValue?.payment_method?.online?.available ? (
                  <Pressable
                    style={[
                      styles.paymentCard,
                      paymentMethod === 'Online'
                        ? styles.paymentCardActive
                        : null,
                    ]}
                    onPress={() => setPaymentMethod('Online')}
                  >
                    <View style={styles.paymentCardTopRow}>
                      <View style={styles.paymentIconRow}>
                        <CreditCard
                          size={18}
                          color={
                            paymentMethod === 'Online'
                              ? colors.primary
                              : '#B4BBC7'
                          }
                          strokeWidth={2.2}
                        />
                      </View>
                      <View
                        style={[
                          styles.radioOuter,
                          paymentMethod === 'Online'
                            ? styles.radioOuterActive
                            : null,
                        ]}
                      >
                        {paymentMethod === 'Online' ? (
                          <View style={styles.radioInner} />
                        ) : null}
                      </View>
                    </View>

                    <View>
                      <Text style={styles.paymentCardTitle}>
                        Online Payment
                      </Text>
                      <Text style={styles.paymentCardSubtitle}>
                        Card, UPI, Wallets
                      </Text>
                    </View>
                  </Pressable>
                ) : null}

                {originalCartValue?.payment_method?.cod?.available ? (
                  <Pressable
                    style={[
                      styles.paymentCard,
                      paymentMethod === 'COD' ? styles.paymentCardActive : null,
                    ]}
                    onPress={() => setPaymentMethod('COD')}
                  >
                    <View style={styles.paymentCardTopRow}>
                      <Wallet
                        size={18}
                        color={
                          paymentMethod === 'COD' ? colors.primary : '#B4BBC7'
                        }
                        strokeWidth={2.2}
                      />
                      <View
                        style={[
                          styles.radioOuter,
                          paymentMethod === 'COD'
                            ? styles.radioOuterActive
                            : null,
                        ]}
                      >
                        {paymentMethod === 'COD' ? (
                          <View style={styles.radioInner} />
                        ) : null}
                      </View>
                    </View>

                    <View>
                      <Text style={styles.paymentCardTitle}>
                        Cash on Delivery
                      </Text>
                      <Text style={styles.paymentCardSubtitle}>
                        Pay at doorstep
                      </Text>
                    </View>
                  </Pressable>
                ) : null}
              </View>
            </View>

            <View style={styles.breakdownSection}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Subtotal</Text>
                <Text style={styles.breakdownValue}>
                  ₹{originalCartValue?.sub_total.toFixed(2)}
                </Text>
              </View>

              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Tax</Text>
                <Text style={styles.breakdownValue}>
                  ₹{originalCartValue?.tax.toFixed(2)}
                </Text>
              </View>

              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Delivery Fee</Text>
                <Text style={styles.breakdownValue}>
                  ₹{originalCartValue?.delivery_charge.toFixed(2)}
                </Text>
              </View>

              {vipEnabled ? (
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>VIP Priority Fee</Text>
                  <Text style={styles.breakdownValue}>
                    ₹{originalCartValue?.vip_charge.toFixed(2)}
                  </Text>
                </View>
              ) : null}

              {paymentMethod === 'COD' &&
                originalCartValue?.payment_method?.cod &&
                originalCartValue?.payment_method?.cod?.charge > 0 ? (
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>COD Charge</Text>
                  <Text style={styles.breakdownValue}>
                    ₹{originalCartValue?.payment_method?.cod?.charge.toFixed(2)}
                  </Text>
                </View>
              ) : null}
              {paymentMethod === 'Online' &&
                originalCartValue?.payment_method?.online &&
                originalCartValue?.payment_method?.online?.charge > 0 ? (
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>
                    Online Payment Charge
                  </Text>
                  <Text style={styles.breakdownValue}>
                    ₹
                    {originalCartValue?.payment_method?.online?.charge.toFixed(
                      2,
                    )}
                  </Text>
                </View>
              ) : null}

              {originalCartValue?.extra_charges?.map((charge, index) => (
                <View style={styles.breakdownRow} key={index}>
                  <Text style={styles.breakdownLabel}>{charge.label}</Text>
                  <Text style={styles.breakdownValue}>
                    ₹{charge.amount.toFixed(2)}
                  </Text>
                </View>
              ))}

              {originalCartValue?.coupon?.applied ? (
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownDiscountLabel}>
                    Coupon Discount ({originalCartValue?.coupon?.code})
                  </Text>
                  <Text style={styles.breakdownDiscountValue}>
                    -₹{originalCartValue?.coupon?.discount.toFixed(2)}
                  </Text>
                </View>
              ) : null}

              <View style={styles.breakdownDivider} />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text>
              </View>

              {useWalletBalance ? (
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownDiscountLabel}>
                    Wallet Balance
                  </Text>
                  <Text style={styles.breakdownDiscountValue}>
                    -₹{originalCartValue?.wallet_balance > totalAmount ? totalAmount.toFixed(2) : originalCartValue?.wallet_balance.toFixed(2)}
                  </Text>
                </View>
              ) : null}
            </View>
            {isBadWeather && originalCartValue?.delivery_charge_discount.progress > 0 ?
              <View style={{ height: 320 + insets.bottom }} />
              : isBadWeather || originalCartValue?.delivery_charge_discount.progress > 0 ?
                <View style={{ height: 280 + insets.bottom }} /> :
                <View style={{ height: 200 + insets.bottom }} />}
          </ScrollView>

          <View
            style={[
              styles.footerShell,
              {
                paddingBottom: 16,
                bottom: insets.bottom
                  ? insets.bottom + height * 0.087
                  : height * 0.11,
              },
            ]}
          >
            <BlurView
              style={styles.footerBlur}
              blurType="dark"
              blurAmount={15}
              blurRadius={10}
              downsampleFactor={1}
              overlayColor="transparent"
              reducedTransparencyFallbackColor="rgba(18, 21, 28, 0.32)"
            />

            <View pointerEvents="none" style={styles.footerOverlay} />

            <View style={styles.footerContent}>
              {isBadWeather ? (
                <View style={styles.weatherNotice}>
                  <View style={styles.weatherIconWrap}>
                    <AlertTriangle size={16} color={colors.accentCoral} />
                  </View>
                  <View style={styles.weatherTextGroup}>
                    <Text style={styles.weatherTitle}>Weather delay</Text>
                    <Text style={styles.weatherSubtitle}>
                      Bad weather conditions may cause delays.
                    </Text>
                  </View>
                </View>
              ) : null}
              {originalCartValue?.delivery_charge_discount && originalCartValue?.delivery_charge_discount.progress > 0 ?
                <View style={styles.progressFooterSection}>
                  <View style={styles.progressFooterHeader}>
                    <Text style={styles.progressFooterAmount}>
                      {originalCartValue?.delivery_charge_discount?.message || ''}
                    </Text>
                  </View>

                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${originalCartValue?.delivery_charge_discount?.progress}%` },
                      ]}
                    />
                  </View>
                </View> : null}

              <TouchableOpacity
                style={[
                  styles.checkoutButton,
                  {
                    backgroundColor: originalCartValue?.checkout
                      ? colors.primary
                      : colors.primary + '80',
                  },
                ]}
                activeOpacity={0.92}
                onPress={handleCheckout}
                disabled={!originalCartValue?.checkout}
              >
                <Text style={styles.checkoutButtonText}>
                  Proceed to Checkout
                </Text>
                {/* <ArrowRight size={20} color="#111111" strokeWidth={2.8} /> */}
                <View style={styles.checkoutRightBlock}>
                  <Text style={styles.checkoutAmountText}>
                    ₹{payableAmount.toFixed(2)}
                  </Text>
                  <ArrowRight size={20} color="#111111" strokeWidth={2.8} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : isShowLoader ? null : (
        <View style={styles.emptyCartContainer}>
          <View style={styles.emptyCartContent}>
            <View style={styles.emptyCartIconWrapper}>
              <ShoppingCart
                size={64}
                color={colors.primary}
                strokeWidth={1.5}
              />
            </View>

            <Text style={styles.emptyCartTitle}>Your Cart is Empty</Text>
            <Text style={styles.emptyCartSubtitle}>
              Looks like you haven't added anything yet. Start exploring and
              find something delicious!
            </Text>
          </View>
        </View>
      )}
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
    paddingTop: 12,
    paddingHorizontal: layout.screenPadding,
    gap: 32,
  },
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 24,
    overflow: 'hidden',
  },
  premiumChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 20,
  },
  premiumChipText: {
    color: colors.primary,
    fontSize: typography.captionPlus,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  heroTitle: {
    color: colors.textPrimary,
    fontSize: typography.titlePlus,
    fontWeight: '700',
    marginBottom: 14,
  },
  heroSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
  },
  addressCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  addressLeftBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  addressIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressTextBlock: {
    flex: 1,
  },
  addressLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  addressTitle: {
    color: colors.textPrimary,
    fontSize: typography.bodyPlus,
    lineHeight: 20,
    fontWeight: '700',
  },
  changeAddressButton: {
    minWidth: 78,
    height: 38,
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  changeAddressButtonText: {
    color: colors.primary,
    fontSize: typography.smPlus,
    lineHeight: 17,
    fontWeight: '700',
  },
  promoCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  promoLeftBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  promoIconBubble: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  promoCodeText: {
    color: colors.textPrimary,
    fontSize: typography.bodyPlus,
    fontWeight: '700',
  },
  promoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  promoBadgeText: {
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  promoSavingsText: {
    color: colors.successBright,
    fontSize: typography.captionPlus,
    marginTop: 4,
    fontWeight: '600',
  },
  promoHintText: {
    color: colors.textMuted,
    fontSize: typography.captionPlus,
    marginTop: 4,
    fontWeight: '500',
  },
  promoRemoveText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  promoApplyText: {
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  promoActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  itemList: {
    gap: 16,
  },
  itemCard: {
    flexDirection: 'row',
    gap: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 16,
  },
  itemImage: {
    width: 96,
    height: 96,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    fontWeight: '700',
  },
  itemSubtitle: {
    color: colors.textMuted,
    fontSize: typography.captionPlus,
    lineHeight: 16,
    letterSpacing: 1,
  },
  itemBottomRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemPrice: {
    color: colors.primary,
    fontSize: typography.xl,
    fontWeight: '700',
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 10,
    height: 42,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 10,
  },
  qtyButton: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    color: colors.textPrimary,
    fontSize: typography.md,
    fontWeight: '700',
    minWidth: 18,
    textAlign: 'center',
  },
  vipCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  vipLeftBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  vipIconBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vipTextBlock: {
    flex: 1,
  },
  vipTitle: {
    color: colors.textPrimary,
    fontSize: typography.md,
    fontWeight: '700',
    marginBottom: 3,
  },
  vipSubtitle: {
    color: colors.textMuted,
    fontSize: typography.sm,
    lineHeight: 16,
  },
  toggleTrack: {
    width: 44,
    height: 24,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.22)',
    padding: 2,
    justifyContent: 'center',
  },
  toggleTrackActive: {
    backgroundColor: colors.primary,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.textPrimary,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  recommendedSection: {
    gap: 14,
  },
  recommendedTitle: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    lineHeight: 24,
    fontWeight: '700',
    paddingHorizontal: 2,
  },
  recommendedList: {
    paddingHorizontal: 2,
    gap: 12,
  },
  recommendedCard: {
    width: 144,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 10,
    gap: 10,
  },
  recommendedImage: {
    width: '100%',
    height: 96,
    borderRadius: 10,
  },
  recommendedMeta: {
    gap: 4,
  },
  recommendedName: {
    color: colors.textPrimary,
    fontSize: typography.body,
    lineHeight: 18,
    fontWeight: '600',
  },
  recommendedBottomRow: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recommendedPrice: {
    color: colors.primary,
    fontSize: typography.body,
    lineHeight: 18,
    fontWeight: '700',
  },
  recommendedAddButton: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.45)',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentSection: {
    gap: 14,
  },
  walletSection: {
    position: 'relative',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 173, 58, 0.16)',
    backgroundColor: 'rgba(255,255,255,0.02)',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  walletAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.primary,
    opacity: 0.95,
  },
  walletTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  walletCopyBlock: {
    flex: 1,
  },
  walletEyebrow: {
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    marginBottom: 6,
  },
  walletAmount: {
    color: colors.textPrimary,
    fontSize: typography.titlePlus,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  walletBodyText: {
    color: colors.textMuted,
    fontSize: typography.captionPlus,
    lineHeight: 16,
    marginTop: 6,
    maxWidth: 240,
  },
  walletCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.24)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletCheckboxActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(245, 158, 11, 0.14)',
  },
  walletCheckboxMark: {
    width: 10,
    height: 10,
    borderRadius: 3,
    backgroundColor: 'transparent',
  },
  walletCheckboxMarkActive: {
    backgroundColor: colors.primary,
  },
  walletBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    flexWrap: 'wrap',
  },
  walletAppliedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.24)',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
  },
  walletAppliedText: {
    color: colors.primary,
    fontSize: typography.captionPlus,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  walletHelperText: {
    color: colors.textMuted,
    fontSize: typography.captionPlus,
    fontWeight: '600',
  },
  walletHintText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '500',
    opacity: 0.8,
  },
  walletTitle: {
    color: colors.textPrimary,
    fontSize: typography.bodyPlus,
    fontWeight: '700',
    marginBottom: 2,
  },
  walletSubtitle: {
    color: colors.textMuted,
    fontSize: typography.captionPlus,
    lineHeight: 16,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    lineHeight: 24,
    fontWeight: '700',
    paddingHorizontal: 2,
  },
  paymentGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  paymentCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 14,
    gap: 10,
  },
  paymentCardActive: {
    borderColor: 'rgba(245, 158, 11, 0.5)',
    backgroundColor: 'rgba(245, 158, 11, 0.06)',
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  paymentCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  paymentCardTitle: {
    color: colors.textPrimary,
    fontSize: typography.smPlus,
    fontWeight: '700',
  },
  paymentCardSubtitle: {
    color: colors.textMuted,
    fontSize: typography.captionPlus,
    marginTop: 2,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
  breakdownSection: {
    paddingHorizontal: 4,
    gap: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    color: colors.textMuted,
    fontSize: typography.bodyPlus,
    fontWeight: '500',
  },
  breakdownValue: {
    color: colors.textPrimary,
    fontSize: typography.bodyPlus,
    fontWeight: '500',
  },
  breakdownDiscountLabel: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  breakdownDiscountValue: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginTop: 2,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    color: colors.textPrimary,
    fontSize: typography.title,
    fontWeight: '700',
  },
  totalValue: {
    color: colors.primary,
    fontSize: typography.displayLg,
    fontWeight: '700',
    letterSpacing: -0.8,
    textShadowColor: 'rgba(245, 158, 11, 0.5)',
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
  },
  footerShell: {
    position: 'absolute',
    left: layout.screenPadding,
    right: layout.screenPadding,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  footerBlur: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.overlayDarkStrong,
  },
  footerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  footerContent: {
    padding: 16,
    gap: 16,
  },
  weatherNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 122, 89, 0.35)',
    backgroundColor: 'rgba(255, 122, 89, 0.12)',
  },
  weatherIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 122, 89, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 122, 89, 0.4)',
  },
  weatherTextGroup: {
    flex: 1,
    gap: 2,
  },
  weatherTitle: {
    color: colors.accentCoral,
    fontSize: typography.smPlus,
    fontWeight: '700',
  },
  weatherSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.captionPlus,
    lineHeight: 16,
  },
  progressFooterSection: {
    gap: 8,
  },
  progressFooterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressFooterLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.3,
  },
  progressFooterAmount: {
    color: colors.primary,
    fontSize: typography.caption,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: 1,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowRadius: 10,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
  },
  checkoutButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  checkoutButtonText: {
    color: colors.black,
    fontSize: typography.lgPlus,
    fontWeight: '700',
  },
  checkoutRightBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkoutAmountText: {
    color: 'rgba(0, 0, 0, 0.6)',
    fontSize: typography.smPlus,
    lineHeight: 17,
    fontWeight: '700',
  },
  emptyCartContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 120,
    paddingHorizontal: layout.screenPadding,
  },
  emptyCartContent: {
    alignItems: 'center',
    gap: 20,
  },
  emptyCartIconWrapper: {
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
  emptyCartTitle: {
    color: colors.textPrimary,
    fontSize: typography.title,
    fontWeight: '700',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  emptyCartSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 280,
  },
  emptyCartButton: {
    marginTop: 12,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyCartButtonText: {
    color: colors.black,
    fontSize: typography.md,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  //------

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

export default CartScreen;
