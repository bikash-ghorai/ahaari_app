import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
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
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
  ArrowRight,
  AlertTriangle,
  BadgeCheck,
  Bolt,
  CreditCard,
  MapPin,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Tag,
  Wallet,
} from 'lucide-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, layout, typography } from '../constants/theme';
import type { RootTabParamList } from '../types/navigation';
import GlassLayer from '../components/GlassLayer';
import { useWeatherAlert } from '../contexts/WeatherAlertContext';

type CartItem = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  qty: number;
  image: string;
};

const initialItems: CartItem[] = [
  {
    id: 'burger',
    name: 'Classic Burger',
    subtitle: 'ANGUS BEEF  -  TRUFFLE AIOLI',
    price: 12,
    qty: 1,
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=384&q=80',
  },
  {
    id: 'fries',
    name: 'Truffle Fries',
    subtitle: 'PARMESAN  -  FRESH PARSLEY',
    price: 6.5,
    qty: 1,
    image:
      'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=384&q=80',
  },
];

type RecommendedItem = {
  id: string;
  name: string;
  price: number;
  image: string;
};

const recommendedItems: RecommendedItem[] = [
  {
    id: 'garlic-bread',
    name: 'Garlic Bread',
    price: 4.5,
    image:
      'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'soft-drink',
    name: 'Soft Drink',
    price: 2,
    image:
      'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'donut',
    name: 'Donut',
    price: 3.5,
    image:
      'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=400&q=80',
  },
];

const deliveryFee = 2;
const vipFee = 2.99;
const initialPromoCode = 'AMBER20';
const initialPromoDiscount = 3.7;

const CartScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootTabParamList, 'Cart'>>();
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [vipEnabled, setVipEnabled] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash'>('online');
  const [promoAppliedCode, setPromoAppliedCode] = useState(initialPromoCode);
  const [promoDiscount, setPromoDiscount] = useState(initialPromoDiscount);
  const [isPromoApplied, setIsPromoApplied] = useState(true);
  const { isBadWeather } = useWeatherAlert();

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items],
  );
  const total = useMemo(
    () => {
      const base = subtotal + deliveryFee + (vipEnabled ? vipFee : 0);
      const discount = isPromoApplied ? promoDiscount : 0;
      return Math.max(0, base - discount);
    },
    [subtotal, vipEnabled, promoDiscount, isPromoApplied],
  );

  const freeDeliveryTarget = 25;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryTarget - subtotal);
  const freeDeliveryProgress = Math.min(1, subtotal / freeDeliveryTarget);

  const updateQty = (id: string, delta: number) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id !== id) {
          return item;
        }
        return { ...item, qty: Math.max(1, item.qty + delta) };
      }),
    );
  };

  const handleRemovePromo = () => {
    setIsPromoApplied(false);
    setPromoAppliedCode('');
    setPromoDiscount(0);
  };

  const handleViewAllCoupons = () => {
    navigation.navigate('CouponList', {
      currentCode: isPromoApplied ? promoAppliedCode : undefined,
    });
  };

  useEffect(() => {
    const applied = route.params?.appliedCoupon;
    if (!applied) {
      return;
    }

    setPromoAppliedCode(applied.code);
    setPromoDiscount(applied.discount);
    setIsPromoApplied(true);
    navigation.setParams({ appliedCoupon: undefined });
  }, [route.params?.appliedCoupon, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{
        paddingHorizontal: layout.screenPadding,
        paddingTop: 8,
        paddingBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <View style={{ gap: 4 }}>
          <Text style={{
            color: colors.textMuted,
            fontSize: typography.caption,
            letterSpacing: 1,
            textTransform: 'uppercase'
          }}>Today's picks</Text>
          <Text style={{
            color: colors.textPrimary,
            fontSize: typography.xl,
            fontWeight: '700',
            letterSpacing: -0.3
          }}>Curated Cart</Text>
        </View>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10
        }}>
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
              overflow: 'hidden'
            }}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Search')}
          >
            <GlassLayer radius={20} tint="rgba(18, 20, 24, 0.24)" />
            <Search size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 300 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.heroCard}>
          <View style={styles.premiumChip}>
            <ShoppingCart size={14} color={colors.primary} />
            <Text style={styles.premiumChipText}>PREMIUM SELECTION</Text>
          </View>

          <Text style={styles.heroTitle}>My Feast Cart</Text>
          <Text style={styles.heroSubtitle}>
            Review your handpicked selection of{`\n`}
            gourmet delicacies before proceeding to the{`\n`}
            final celebration.
          </Text>
        </View>

        <View style={styles.addressCard}>
          <View style={styles.addressLeftBlock}>
            <View style={styles.addressIconWrap}>
              <MapPin size={20} color={colors.primary} strokeWidth={2.1} />
            </View>

            <View style={styles.addressTextBlock}>
              <Text style={styles.addressLabel}>Delivery Address</Text>
              <Text style={styles.addressTitle}>Home - 123 Amber Lane</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.changeAddressButton}
            activeOpacity={0.88}
            onPress={() => navigation.navigate('SelectAddress')}
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
                {isPromoApplied ? (
                  <>
                    <Text style={styles.promoCodeText}>{promoAppliedCode}</Text>
                    <View style={styles.promoBadge}>
                      <Text style={styles.promoBadgeText}>Applied</Text>
                    </View>
                  </>
                ) : (
                  <Text style={styles.promoCodeText}>No coupon applied</Text>
                )}
              </View>
              {isPromoApplied ? (
                <Text style={styles.promoSavingsText}>You saved ${promoDiscount.toFixed(2)}!</Text>
              ) : (
                <Text style={styles.promoHintText}>View all coupons to unlock savings.</Text>
              )}
            </View>
          </View>

          <View style={styles.promoActions}>

            {isPromoApplied ? (
              <TouchableOpacity activeOpacity={0.8} onPress={handleRemovePromo}>
                <Text style={styles.promoRemoveText}>Remove</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity activeOpacity={0.8} onPress={handleViewAllCoupons}>
                <Text style={styles.promoApplyText}>View all</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.itemList}>
          {items.map(item => (
            <View key={item.id} style={styles.itemCard}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />

              <View style={styles.itemInfo}>
                <View style={styles.itemTopRow}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <BadgeCheck size={16} color={colors.primary} fill={colors.primary} />
                </View>

                <Text style={styles.itemSubtitle}>{item.subtitle}</Text>

                <View style={styles.itemBottomRow}>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>

                  <View style={styles.qtyControl}>
                    <Pressable onPress={() => updateQty(item.id, -1)} style={styles.qtyButton}>
                      <Minus size={18} color="#9BA3B5" />
                    </Pressable>
                    <Text style={styles.qtyText}>{item.qty}</Text>
                    <Pressable onPress={() => updateQty(item.id, 1)} style={styles.qtyButton}>
                      <Plus size={18} color="#9BA3B5" />
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.vipCard}>
          <View style={styles.vipLeftBlock}>
            <View style={styles.vipIconBubble}>
              <Bolt size={22} color={colors.primary} fill={colors.primary} />
            </View>

            <View style={styles.vipTextBlock}>
              <Text style={styles.vipTitle}>VIP Fast-Forward Order</Text>
              <Text style={styles.vipSubtitle}>Skip the queue for $2.99! Order becomes top priority.</Text>
            </View>
          </View>

          <Pressable
            onPress={() => setVipEnabled(value => !value)}
            style={[styles.toggleTrack, vipEnabled && styles.toggleTrackActive]}
          >
            <View style={[styles.toggleThumb, vipEnabled && styles.toggleThumbActive]} />
          </Pressable>
        </View>

        <View style={styles.recommendedSection}>
          <Text style={styles.recommendedTitle}>Recommended for You</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendedList}
          >
            {recommendedItems.map(item => (
              <View key={item.id} style={styles.recommendedCard}>
                <Image source={{ uri: item.image }} style={styles.recommendedImage} />

                <View style={styles.recommendedMeta}>
                  <Text style={styles.recommendedName} numberOfLines={1}>{item.name}</Text>

                  <View style={styles.recommendedBottomRow}>
                    <Text style={styles.recommendedPrice}>${item.price.toFixed(2)}</Text>

                    <TouchableOpacity style={styles.recommendedAddButton} activeOpacity={0.88}>
                      <Plus size={13} color={colors.primary} strokeWidth={2.9} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          <View style={styles.paymentGrid}>
            <Pressable
              style={[
                styles.paymentCard,
                paymentMethod === 'online' ? styles.paymentCardActive : null,
              ]}
              onPress={() => setPaymentMethod('online')}
            >
              <View style={styles.paymentCardTopRow}>
                <View style={styles.paymentIconRow}>
                  <CreditCard
                    size={18}
                    color={paymentMethod === 'online' ? colors.primary : '#B4BBC7'}
                    strokeWidth={2.2}
                  />
                </View>
                <View
                  style={[
                    styles.radioOuter,
                    paymentMethod === 'online' ? styles.radioOuterActive : null,
                  ]}
                >
                  {paymentMethod === 'online' ? <View style={styles.radioInner} /> : null}
                </View>
              </View>

              <View>
                <Text style={styles.paymentCardTitle}>Online Payment</Text>
                <Text style={styles.paymentCardSubtitle}>Card, Apple Pay</Text>
              </View>
            </Pressable>

            <Pressable
              style={[
                styles.paymentCard,
                paymentMethod === 'cash' ? styles.paymentCardActive : null,
              ]}
              onPress={() => setPaymentMethod('cash')}
            >
              <View style={styles.paymentCardTopRow}>
                <Wallet
                  size={18}
                  color={paymentMethod === 'cash' ? colors.primary : '#B4BBC7'}
                  strokeWidth={2.2}
                />
                <View
                  style={[
                    styles.radioOuter,
                    paymentMethod === 'cash' ? styles.radioOuterActive : null,
                  ]}
                >
                  {paymentMethod === 'cash' ? <View style={styles.radioInner} /> : null}
                </View>
              </View>

              <View>
                <Text style={styles.paymentCardTitle}>Cash on Delivery</Text>
                <Text style={styles.paymentCardSubtitle}>Pay at doorstep</Text>
              </View>
            </Pressable>
          </View>
        </View>

        <View style={styles.breakdownSection}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Subtotal</Text>
            <Text style={styles.breakdownValue}>${subtotal.toFixed(2)}</Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>VIP Priority Fee</Text>
            <Text style={styles.breakdownValue}>${(vipEnabled ? vipFee : 0).toFixed(2)}</Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Delivery Fee</Text>
            <Text style={styles.breakdownValue}>${deliveryFee.toFixed(2)}</Text>
          </View>

          {isPromoApplied ? (
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownDiscountLabel}>
                Coupon Discount ({promoAppliedCode})
              </Text>
              <Text style={styles.breakdownDiscountValue}>-${promoDiscount.toFixed(2)}</Text>
            </View>
          ) : null}

          <View style={styles.breakdownDivider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footerShell, { paddingBottom: Math.max(16, insets.bottom) }]}>

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
                <Text style={styles.weatherSubtitle}>Bad weather conditions may cause delays.</Text>
              </View>
            </View>
          ) : null}
          <View style={styles.progressFooterSection}>
            <View style={styles.progressFooterHeader}>
              <Text style={styles.progressFooterLabel}>FREE DELIVERY PROGRESS</Text>
              <Text style={styles.progressFooterAmount}>
                {remainingForFreeDelivery > 0
                  ? `ADD $${remainingForFreeDelivery.toFixed(2)} MORE`
                  : 'FREE DELIVERY UNLOCKED'}
              </Text>
            </View>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${freeDeliveryProgress * 100}%` }]} />
            </View>
          </View>

          <TouchableOpacity
            style={styles.checkoutButton}
            activeOpacity={0.92}
            onPress={() =>
              navigation.navigate('OrderConfirmed', {
                orderId: 'LE-88291',
                etaMinutes: 25,
                itemName: 'Truffle Pasta',
                chefName: 'Chef Antonio',
              })
              // navigation.navigate('OrderFailed')
            }
          >
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>

            <View style={styles.checkoutRightBlock}>
              <Text style={styles.checkoutAmountText}>${total.toFixed(2)}</Text>
              <ArrowRight size={20} color="#111111" strokeWidth={2.8} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 12,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 380,
    gap: 32,
  },
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 24,
    minHeight: 196,
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
    bottom: 96,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  footerBlur: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.overlayDarkStrong,
  },
  footerOverlay: {
    position: "absolute",
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
    // shadowColor: colors.primary,
    // shadowOpacity: 0.45,
    // shadowRadius: 20,
    // shadowOffset: { width: 0, height: 0 },
    // elevation: 10,
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
});

export default CartScreen;
