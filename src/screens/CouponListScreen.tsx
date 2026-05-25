/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Tag } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, typography } from '../constants/theme';
import Header from '../components/Header';
import GlassLayer from '../components/GlassLayer';
import { useDispatch } from '../redux/store';
import { applyCoupon, getCoupons } from '../redux/app/appAction';
import { ICoupon } from '../types';
import { reset } from '../utils/navigationRef';

const CouponListScreen = () => {
  const dispatch = useDispatch();

  const [couponList, setCouponList] = useState<ICoupon[]>([]);

  useEffect(() => {
    dispatch(getCoupons())
      .unwrap()
      .then(({ data }) => {
        setCouponList(data);
      })
      .catch(error => {
        console.error('Failed to fetch coupons:', error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyCoupon = (coupon: ICoupon) => {
    dispatch(applyCoupon({ coupon_id: coupon.coupon_id }))
      .unwrap()
      .then(() => {
        reset('Tabs', {
          screen: 'Cart',
        });
      })
      .catch(error => {
        console.error('Failed to apply coupon:', error);
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
          <Text style={styles.sectionTitle}>Available Coupons</Text>
        </View>

        <View style={styles.couponGrid}>
          {couponList.map((coupon, index) => {
            const isApplicable = coupon.is_applicable;
            const buttonColors = [colors.primary, 'rgba(245, 158, 11, 0.95)'];

            return (
              <View key={index} style={[styles.couponCard]}>
                <GlassLayer radius={16} />
                <View
                  style={[
                    styles.couponAccent,
                    {
                      backgroundColor: isApplicable
                        ? colors.primary
                        : 'rgba(255, 255, 255, 0.36)',
                    },
                  ]}
                />

                <View style={styles.couponTopRow}>
                  <View
                    style={[
                      isApplicable
                        ? styles.couponCodePill
                        : styles.couponCodePillMuted,
                    ]}
                  >
                    <Text
                      style={
                        isApplicable
                          ? styles.couponCodeText
                          : styles.couponCodeMuted
                      }
                    >
                      {coupon.code}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.couponIconWrap,
                      {
                        backgroundColor: isApplicable
                          ? 'rgba(245, 158, 11, 0.16)'
                          : 'rgba(255, 255, 255, 0.08)',
                      },
                    ]}
                  >
                    <Tag
                      size={18}
                      color={
                        isApplicable ? colors.primary : colors.textMutedLight
                      }
                      strokeWidth={2.3}
                    />
                  </View>
                </View>

                <Text
                  style={isApplicable ? styles.couponTitle : styles.lockedTitle}
                >
                  {coupon?.title}
                </Text>
                <Text
                  style={
                    isApplicable
                      ? styles.couponDescription
                      : styles.lockedDescription
                  }
                >
                  {coupon?.description}
                </Text>

                {isApplicable ? (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => handleApplyCoupon(coupon)}
                    style={styles.applyButton}
                  >
                    <LinearGradient
                      colors={buttonColors}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={styles.applyButtonGradient}
                    >
                      <Text style={[styles.applyButtonText]}>Apply Coupon</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.lockedNote, styles.lockedNoteMuted]}>
                    <Text style={styles.lockedNoteTextMuted}>
                      Not applicable for current order
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
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
