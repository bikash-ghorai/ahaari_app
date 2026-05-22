import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Bell, CookingPot, Headset, Rocket } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, typography } from '../constants/theme';
import type { RootStackParamList } from '../types/navigation';

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
    qty: 'Qty: 1',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=260&q=80',
  },
  {
    id: 'sweet-potato-fries',
    title: 'Sweet Potato Fries',
    subtitle: 'Large Size, Sea Salt',
    price: '$8.50',
    qty: 'Qty: 1',
    image:
      'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=260&q=80',
  },
];

const GlassLayer = ({ radius, tint = 'rgba(16, 20, 30, 0.32)' }: { radius: number; tint?: string }) => (
  <>
    {Platform.OS === 'ios' ? (
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
        blurAmount={26}
        reducedTransparencyFallbackColor="rgba(12, 14, 20, 0.3)"
      />
    ) : null}

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
          backgroundColor: tint,
        },
      ]}
    />
  </>
);

const OrderDetailsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'OrderDetails'>>();

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.backButton}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
              return;
            }
            navigation.navigate('Tabs');
          }}
        >
          <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2.2} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>ORDER STATUS</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statusSection}>
          <View style={styles.statusCircle}>
            <CookingPot size={40} color={colors.primary} strokeWidth={2} />
            <Text style={styles.statusLabel}>PREPARING</Text>
          </View>

          <View style={styles.headlineGroup}>
            <Text style={styles.headline}>Chef is cooking!</Text>
            <Text style={styles.subHeadline}>
              Your order at The Golden Skillet is currently being prepared with care. Estimated
              arrival in 25 mins.
            </Text>
          </View>
        </View>

        <View style={styles.itemsSection}>
          <Text style={styles.sectionLabel}>ORDER ITEMS</Text>

          <View style={styles.itemsList}>
            {orderItems.map(item => (
              <View key={item.id} style={styles.itemCard}>
                <GlassLayer radius={16} tint="rgba(255,255,255,0.03)" />
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
          <GlassLayer radius={24} tint="rgba(255,255,255,0.03)" />

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

        <TouchableOpacity activeOpacity={0.9} style={styles.supportButton}>
          <GlassLayer radius={18} tint="rgba(255,255,255,0.03)" />
          <Headset size={18} color="#E5E7EB" strokeWidth={2.1} />
          <Text style={styles.supportButtonText}>Contact Support</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ambientGlow: {
    position: 'absolute',
    top: 42,
    bottom: 0,
    alignSelf: 'center',
    width: 258,
  },
  header: {
    height: 56,
    marginTop: 6,
    paddingHorizontal: layout.screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  notificationButton: {
    width: 28,
    height: 28,
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
    paddingTop: 28,
    paddingBottom: 48,
    gap: 48,
  },
  statusSection: {
    alignItems: 'center',
    gap: 20,
  },
  statusCircle: {
    width: 164,
    height: 164,
    borderRadius: 999,
    borderWidth: 5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  statusLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  headlineGroup: {
    alignItems: 'center',
    gap: 8,
  },
  headline: {
    color: colors.textPrimary,
    fontSize: typography.displayXl,
    lineHeight: 42,
    fontWeight: '700',
    letterSpacing: -1,
    textAlign: 'center',
  },
  subHeadline: {
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: typography.bodyPlus,
    lineHeight: 22,
    fontWeight: '400',
    maxWidth: 334,
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
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 18,
  },
  itemImageWrap: {
    width: 64,
    height: 64,
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
    color: colors.primary,
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
    color: colors.textPrimary,
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
