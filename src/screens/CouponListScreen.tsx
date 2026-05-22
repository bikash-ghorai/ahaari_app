import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Check, Tag } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, typography } from '../constants/theme';
import type { RootStackParamList } from '../types/navigation';
import Header from '../components/Header';
import GlassLayer from '../components/GlassLayer';

type CouponItem = {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: number;
};

type LockedOffer = {
  id: string;
  code: string;
  title: string;
  description: string;
  note: string;
  noteTone: 'error' | 'muted';
};

const applicableCoupons: CouponItem[] = [
  {
    id: 'amber20',
    code: 'AMBER20',
    title: '20% Off Premium Orders',
    description: 'Get 20% off on all orders above $15. Valid until midnight.',
    discount: 3.7,
  },
  {
    id: 'nocturne5',
    code: 'NOCTURNE5',
    title: 'Flat $5 Delivery Discount',
    description: 'Save $5 on delivery fees for your next boutique meal.',
    discount: 5,
  },
];

const lockedOffers: LockedOffer[] = [
  {
    id: 'feast50',
    code: 'FEAST50',
    title: '50% Off Feast Menu',
    description: 'Valid only on orders above $50 from partner restaurants.',
    note: 'Add $12.50 more to unlock',
    noteTone: 'error',
  },
  {
    id: 'newuser',
    code: 'NEWUSER',
    title: 'Free Dessert',
    description: 'Get a complimentary dessert with your first order.',
    note: 'Not applicable for current users',
    noteTone: 'muted',
  },
];

const CouponListScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'CouponList'>>();
  const currentCode = route.params?.currentCode;

  const applyCoupon = (coupon: CouponItem) => {
    navigation.navigate('Tabs', {
      screen: 'Cart',
      params: {
        appliedCoupon: {
          code: coupon.code,
          discount: coupon.discount,
        },
      },
    });
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <Header
        title="Coupons"
        showBackButton={true}
        containerStyle={{ paddingHorizontal: layout.screenPadding }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Applicable Coupons</Text>
          <Text style={styles.sectionMeta}>{applicableCoupons.length} Available</Text>
        </View>

        <View style={styles.couponGrid}>
          {applicableCoupons.map(coupon => {
            const isSelected = coupon.code === currentCode;
            const buttonColors = isSelected
              ? ['rgba(255, 255, 255, 0.16)', 'rgba(255, 255, 255, 0.08)']
              : [colors.primary, 'rgba(245, 158, 11, 0.95)'];

            return (
              <View
                key={coupon.id}
                style={[styles.couponCard, isSelected ? styles.couponCardActive : null]}
              >
                <GlassLayer radius={16} />
                <View style={styles.couponAccent} />

                <View style={styles.couponTopRow}>
                  <View style={styles.couponCodePill}>
                    <Text style={styles.couponCodeText}>{coupon.code}</Text>
                  </View>
                  {isSelected ? (
                    <View style={styles.appliedBadge}>
                      <Check size={14} color={colors.black} strokeWidth={2.6} />
                      <Text style={styles.appliedBadgeText}>Applied</Text>
                    </View>
                  ) : (
                    <View style={styles.couponIconWrap}>
                      <Tag size={18} color={colors.primary} strokeWidth={2.3} />
                    </View>
                  )}
                </View>

                <Text style={styles.couponTitle}>{coupon.title}</Text>
                <Text style={styles.couponDescription}>{coupon.description}</Text>

                <TouchableOpacity
                  activeOpacity={0.9}
                  disabled={isSelected}
                  onPress={() => applyCoupon(coupon)}
                  style={styles.applyButton}
                >
                  <LinearGradient
                    colors={buttonColors}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.applyButtonGradient}
                  >
                    <Text
                      style={[
                        styles.applyButtonText,
                        isSelected ? styles.applyButtonTextActive : null,
                      ]}
                    >
                      {isSelected ? 'Applied' : 'Apply Coupon'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        <View style={styles.sectionHeaderMuted}>
          <Text style={styles.sectionTitleMuted}>More Offers</Text>
        </View>

        <View style={styles.couponGridMuted}>
          {lockedOffers.map(offer => (
            <View key={offer.id} style={styles.lockedCard}>
              <GlassLayer radius={16} />

              <View style={styles.couponTopRow}>
                <View style={styles.couponCodePillMuted}>
                  <Text style={styles.couponCodeMuted}>{offer.code}</Text>
                </View>
                <View style={styles.lockedBadge}>
                  <Text style={styles.lockedBadgeText}>Locked</Text>
                </View>
              </View>

              <Text style={styles.lockedTitle}>{offer.title}</Text>
              <Text style={styles.lockedDescription}>{offer.description}</Text>

              <View
                style={[
                  styles.lockedNote,
                  offer.noteTone === 'error' ? styles.lockedNoteError : styles.lockedNoteMuted,
                ]}
              >
                <Text
                  style={
                    offer.noteTone === 'error'
                      ? styles.lockedNoteTextError
                      : styles.lockedNoteTextMuted
                  }
                >
                  {offer.note}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
    paddingTop: 16,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 220,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  sectionMeta: {
    color: colors.primary,
    fontSize: typography.captionPlus,
    fontWeight: '600',
  },
  sectionHeaderMuted: {
    marginTop: 28,
    marginBottom: 16,
  },
  sectionTitleMuted: {
    color: colors.textMuted,
    fontSize: typography.lg,
    fontWeight: '600',
  },
  couponGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  couponGridMuted: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    opacity: 0.72,
  },
  couponCard: {
    flexBasis: 320,
    flexGrow: 1,
    minWidth: 280,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 18,
    overflow: 'hidden',
  },
  couponCardActive: {
    borderColor: 'rgba(245, 158, 11, 0.45)',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
  },
  couponAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.primary,
    opacity: 0.9,
  },
  couponTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  couponIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.16)',
  },
  couponCodePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(12, 14, 18, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  couponCodeText: {
    color: colors.primary,
    fontSize: typography.bodyPlus,
    fontWeight: '700',
    letterSpacing: 1,
  },
  couponCodePillMuted: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(12, 14, 18, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  couponCodeMuted: {
    color: colors.textMuted,
    fontSize: typography.bodyPlus,
    fontWeight: '700',
    letterSpacing: 1,
  },
  couponTitle: {
    marginTop: 14,
    color: colors.textPrimary,
    fontSize: typography.md,
    fontWeight: '700',
  },
  appliedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  appliedBadgeText: {
    color: colors.black,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  couponDescription: {
    marginTop: 12,
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 20,
  },
  applyButton: {
    marginTop: 18,
    height: 44,
    borderRadius: 10,
    overflow: 'hidden',
  },
  applyButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: colors.onPrimaryDeep,
    fontSize: typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  applyButtonTextActive: {
    color: colors.textPrimary,
  },
  lockedCard: {
    flexBasis: 320,
    flexGrow: 1,
    minWidth: 280,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 18,
    overflow: 'hidden',
  },
  lockedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  lockedBadgeText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  lockedTitle: {
    marginTop: 14,
    color: colors.textMuted,
    fontSize: typography.md,
    fontWeight: '700',
  },
  lockedDescription: {
    marginTop: 12,
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 20,
  },
  lockedNote: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
  },
  lockedNoteError: {
    backgroundColor: 'rgba(255, 115, 81, 0.12)',
  },
  lockedNoteMuted: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  lockedNoteTextError: {
    color: '#FFB4A8',
    fontSize: typography.captionPlus,
    fontWeight: '600',
  },
  lockedNoteTextMuted: {
    color: colors.textMuted,
    fontSize: typography.captionPlus,
    fontWeight: '600',
  },
});

export default CouponListScreen;
