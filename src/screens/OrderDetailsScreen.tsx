import React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Bell,
  Check,
  CookingPot,
  Headset,
  List,
  MessageCircle,
  Phone,
  Rocket,
  UtensilsCrossed,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, typography } from '../constants/theme';
import type { RootStackParamList } from '../types/navigation';
import Header from '../components/Header';

type OrderItem = {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  qty: string;
  image: string;
};

const orderItems: OrderItem[] = [
  {
    id: 'truffle-burger-bowl',
    title: 'Truffle Burger Bowl',
    subtitle: 'Extra Aioli, No Onions',
    price: '$24.00',
    qty: 'Qty:1',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=260&q=80',
  },
  {
    id: 'sweet-potato-fries',
    title: 'Sweet Potato Fries',
    subtitle: 'Large Size, Sea Salt',
    price: '$8.50',
    qty: 'Qty:1',
    image:
      'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=260&q=80',
  },
];

const OrderDetailsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'OrderDetails'>>();
  const route = useRoute<RouteProp<RootStackParamList, 'OrderDetails'>>();
  const orderId = route.params?.orderId ?? '';
  const isPreparing = false;
  const isOnTheWay = false;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <Header title="Restaurant Details" showNotificationButton={true} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isPreparing ? (
          <View style={styles.preparingCard}>
            <View style={styles.preparingCircle}>
              <CookingPot size={36} color={colors.primary} strokeWidth={2} />
              <Text style={styles.preparingLabel}>PREPARING</Text>
            </View>

            <Text style={styles.preparingTitle}>Chef is cooking!</Text>
            <Text style={styles.preparingSubtitle}>
              Your order at The Golden Skillet is currently being prepared with care. Estimated
              arrival in 25 mins.
            </Text>
          </View>
        ) : isOnTheWay ? (
          <View style={styles.onwayTopCard}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80',
              }}
              style={styles.onwayMapImage}
            />
            <View style={styles.onwayMapDim} />

            <View style={styles.routeLineA} />
            <View style={styles.routeLineB} />
            <View style={styles.routeDotStart} />
            <View style={styles.routeDotEnd} />

            <View style={styles.arrivalCard}>
              <View>
                <Text style={styles.arrivalLabel}>ESTIMATED ARRIVAL</Text>
                <Text style={styles.arrivalValue}>Arriving in 12 mins</Text>
              </View>

              <View style={styles.priorityPill}>
                <Rocket size={12} color="#FFAD3A" strokeWidth={2.2} />
                <Text style={styles.priorityText}>PRIORITY</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.summaryCard}>
            <View style={styles.summaryTopRow}>
              <View style={styles.summaryLeftBlock}>
                <Text style={styles.orderNumber}>ORDER #LE-88291</Text>
                <Text style={styles.restaurantName}>The Golden Skillet</Text>
                <Text style={styles.deliveryTime}>Today at 7:42 PM</Text>
              </View>

              <View style={styles.arrivedPill}>
                <Check size={12} color="#2AC28A" strokeWidth={2.6} />
                <Text style={styles.arrivedText}>ARRIVED</Text>
              </View>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.courierRow}>
              <View style={styles.courierIconWrap}>
                <UtensilsCrossed size={18} color={colors.primary} strokeWidth={2.2} />
              </View>
              <View>
                <Text style={styles.courierTitle}>Delivered by Marcus</Text>
                <Text style={styles.courierSubtitle}>Handed to resident</Text>
              </View>
            </View>
          </View>
        )}

        {isOnTheWay ? (
          <View style={styles.onwayCourierCard}>
            <View style={styles.onwayCourierLeft}>
              <View style={styles.onwayCourierAvatarWrap}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                  }}
                  style={styles.onwayCourierAvatar}
                />
                <View style={styles.onwayCourierOnlineDot} />
              </View>

              <View>
                <Text style={styles.onwayCourierName}>Marco V.</Text>
                <Text style={styles.onwayCourierStatus}>OUT FOR DELIVERY</Text>
              </View>
            </View>

            <View style={styles.onwayCourierActions}>
              <TouchableOpacity activeOpacity={0.88} style={styles.onwayCourierActionBtn}>
                <Phone size={16} color="#FFAD3A" strokeWidth={2.2} />
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.88} style={styles.onwayCourierActionBtn}>
                <MessageCircle size={16} color="#FFAD3A" strokeWidth={2.2} />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        <View style={styles.itemsSection}>
          <Text style={styles.sectionLabel}>ORDER ITEMS</Text>

          <View style={styles.itemsList}>
            {orderItems.map(item => (
              <View key={item.id} style={styles.itemCard}>
                <LinearGradient
                  pointerEvents="none"
                  colors={['rgba(255, 255, 255, 0.01)', 'rgba(255, 255, 255, 0)']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.itemCardHighlight}
                />

                <View style={styles.itemRow}>
                  <View style={styles.itemImageWrap}>
                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                  </View>

                  <View style={styles.itemTextColumn}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                  </View>

                  <View style={styles.itemPriceColumn}>
                    <Text style={styles.itemPrice}>{item.price}</Text>
                    <Text style={styles.itemQty}>{item.qty}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.breakdownCard}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Subtotal</Text>
            <Text style={styles.breakdownValue}>$32.50</Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Delivery Fee</Text>
            <Text style={styles.breakdownValue}>$0.00</Text>
          </View>

          <View style={styles.breakdownRow}>
            <View style={styles.feeLabelGroup}>
              <Text style={styles.breakdownLabel}>VIP Fast-Forward Fee</Text>
              <Rocket size={14} color={colors.primary} strokeWidth={2.2} />
            </View>
            <Text style={styles.breakdownValue}>$2.99</Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text style={styles.discountLabel}>Family Discount</Text>
            <Text style={styles.discountValue}>-$5.00</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalCaption}>TOTAL AMOUNT</Text>
              <Text style={styles.totalValue}>$30.49</Text>
            </View>

            <Text style={styles.paymentMethod}>PAID VIA APPLE PAY</Text>
          </View>
        </View>

        {isPreparing || isOnTheWay ? (
          <TouchableOpacity activeOpacity={0.9} style={styles.supportButton}>
            <Headset size={18} color="#E5E7EB" strokeWidth={2.1} />
            <Text style={styles.supportButtonText}>Contact Support</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity activeOpacity={0.92} style={styles.reorderButton}>
            <LinearGradient
              colors={['#FFB53A', '#F59E0B']}
              start={{ x: 0, y: 0.4 }}
              end={{ x: 1, y: 0.6 }}
              style={styles.reorderGradient}
            >
              <List size={20} color="#2A1700" strokeWidth={2.2} />
              <Text style={styles.reorderText}>Reorder Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topGlow: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 280,
    height: 380,
  },
  bottomGlow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -120,
    height: 340,
  },
  header: {
    height: 58,
    marginTop: 4,
    paddingHorizontal: layout.screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    lineHeight: 28,
    fontWeight: '800',
    letterSpacing: -1,
    marginLeft: -22,
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrap: {
    width: 30,
    height: 30,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    backgroundColor: colors.accentTan,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 18,
    paddingBottom: 48,
    gap: 32,
  },
  summaryCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 24,
    overflow: 'hidden',
  },
  summaryCardGlow: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 220,
    height: 220,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLeftBlock: {
    width: '70%',
  },
  orderNumber: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  restaurantName: {
    marginTop: 4,
    color: colors.textPrimary,
    fontSize: typography.displayCard,
    lineHeight: 48,
    fontWeight: '700',
  },
  deliveryTime: {
    marginTop: 6,
    color: colors.textMuted,
    fontSize: typography.bodyPlus,
    lineHeight: 22,
    fontWeight: '400',
  },
  arrivedPill: {
    marginTop: 6,
    height: 32,
    borderRadius: 999,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(42, 194, 138, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(42, 194, 138, 0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  arrivedText: {
    color: colors.successTeal,
    fontSize: typography.caption,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  summaryDivider: {
    marginTop: 20,
    marginBottom: 16,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  courierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  courierIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  courierTitle: {
    color: colors.textPrimary,
    fontSize: typography.bodyPlus,
    lineHeight: 22,
    fontWeight: '600',
  },
  courierSubtitle: {
    color: colors.textMuted,
    fontSize: typography.smPlus,
    lineHeight: 20,
    fontWeight: '400',
  },
  preparingCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 22,
    alignItems: 'center',
    overflow: 'hidden',
  },
  preparingCircle: {
    width: 160,
    height: 160,
    borderRadius: 999,
    borderWidth: 5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  preparingLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  preparingTitle: {
    marginTop: 18,
    color: colors.textPrimary,
    fontSize: typography.displayXl,
    lineHeight: 42,
    fontWeight: '700',
    letterSpacing: -1,
    textAlign: 'center',
  },
  preparingSubtitle: {
    marginTop: 8,
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: typography.bodyPlus,
    lineHeight: 22,
    fontWeight: '400',
    maxWidth: 334,
  },
  onwayTopCard: {
    marginHorizontal: -24,
    height: 380,
    overflow: 'hidden',
    position: 'relative',
  },
  onwayMapImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  onwayMapDim: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(12, 14, 18, 0.52)',
  },
  routeLineA: {
    position: 'absolute',
    left: 122,
    top: 108,
    width: 194,
    height: 184,
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderColor: colors.primary,
    borderTopLeftRadius: 152,
  },
  routeLineB: {
    position: 'absolute',
    left: 116,
    top: 182,
    width: 12,
    height: 74,
    borderLeftWidth: 5,
    borderColor: colors.primary,
  },
  routeDotStart: {
    position: 'absolute',
    left: 108,
    top: 244,
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  routeDotEnd: {
    position: 'absolute',
    right: 48,
    top: 108,
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  arrivalCard: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 32,
    minHeight: 82,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  arrivalLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1,
  },
  arrivalValue: {
    marginTop: 2,
    color: colors.textPrimary,
    fontSize: typography.xl,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  priorityPill: {
    height: 34,
    borderRadius: 999,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 173, 58, 0.45)',
    backgroundColor: 'rgba(255, 173, 58, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priorityText: {
    color: colors.primary,
    fontSize: typography.caption,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  onwayCourierCard: {
    minHeight: 96,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  onwayCourierLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  onwayCourierAvatarWrap: {
    width: 54,
    height: 54,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.primary,
    padding: 2,
    position: 'relative',
  },
  onwayCourierAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },
  onwayCourierOnlineDot: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 14,
    height: 14,
    borderRadius: 999,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.background,
  },
  onwayCourierName: {
    color: colors.textPrimary,
    fontSize: typography.mdPlus,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  onwayCourierStatus: {
    color: colors.primary,
    fontSize: typography.caption,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  onwayCourierActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  onwayCourierActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(23, 26, 30, 0.6)',
  },
  itemsSection: {
    gap: 16,
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: typography.sm,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 2.4,
  },
  itemsList: {
    gap: 12,
  },
  itemCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    overflow: 'hidden',
  },
  itemCardHighlight: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  itemRow: {
    minHeight: 98,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 18,
  },
  itemImageWrap: {
    width: 74,
    height: 74,
    borderRadius: 12,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemTextColumn: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    lineHeight: 28,
    fontWeight: '700',
  },
  itemSubtitle: {
    color: colors.textMuted,
    fontSize: typography.sm,
    lineHeight: 18,
    fontWeight: '400',
  },
  itemPriceColumn: {
    alignItems: 'flex-end',
    gap: 2,
  },
  itemPrice: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    lineHeight: 28,
    fontWeight: '700',
  },
  itemQty: {
    color: colors.textMuted,
    fontSize: typography.sm,
    lineHeight: 18,
    fontWeight: '400',
  },
  breakdownCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    overflow: 'hidden',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 22,
    gap: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  feeLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  breakdownLabel: {
    color: colors.textMuted,
    fontSize: typography.md,
    lineHeight: 24,
    fontWeight: '400',
  },
  breakdownValue: {
    color: colors.textPrimary,
    fontSize: typography.md,
    lineHeight: 24,
    fontWeight: '500',
  },
  discountLabel: {
    color: colors.primary,
    fontSize: typography.md,
    lineHeight: 24,
    fontWeight: '500',
  },
  discountValue: {
    color: colors.primary,
    fontSize: typography.md,
    lineHeight: 24,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginTop: 2,
    marginBottom: 4,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  totalCaption: {
    color: colors.textMuted,
    fontSize: typography.sm,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 2.4,
    marginBottom: 2,
  },
  totalValue: {
    color: colors.primary,
    fontSize: typography.display3xl,
    lineHeight: 50,
    fontWeight: '700',
    letterSpacing: -1,
  },
  paymentMethod: {
    color: colors.textMuted,
    fontSize: typography.sm,
    lineHeight: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  reorderButton: {
    height: 72,
    borderRadius: 18,
    overflow: 'hidden',
  },
  reorderGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  reorderText: {
    color: colors.onPrimaryDark,
    fontSize: typography.lg,
    lineHeight: 28,
    fontWeight: '700',
  },
  supportButton: {
    height: 72,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
    overflow: 'hidden',
  },
  supportButtonText: {
    color: colors.textSecondary,
    fontSize: typography.mdPlus,
    lineHeight: 28,
    fontWeight: '600',
  },
});

export default OrderDetailsScreen;
