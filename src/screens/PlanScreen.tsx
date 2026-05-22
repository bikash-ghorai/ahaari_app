import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BadgeCheck, Calendar, CheckCircle2, Star } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, typography } from '../constants/theme';
import GlassLayer from '../components/GlassLayer';
import Header from '../components/Header';

const perks = [
  {
    title: 'Priority delivery',
    description: 'Faster handoff on peak nights and guaranteed driver assignment.',
  },
  {
    title: 'Exclusive tastings',
    description: 'Weekly chef drops and limited menu previews.',
  },
  {
    title: 'Zero service fees',
    description: 'All service fees waived on every order.',
  },
];

const PlanScreen = () => {
  const hasActivePlan = false;
  const planBadgeText = hasActivePlan ? 'Premium Member' : 'No Active Plan';
  const planSubtitle = hasActivePlan
    ? 'Your elevated dining membership.'
    : 'Unlock premium perks when you are ready.';
  const planStatusText = hasActivePlan ? 'ACTIVE' : 'AVAILABLE';
  const primaryActionText = hasActivePlan ? 'Change plan' : 'Start membership';

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <Header
        title="Plan"
        showBackButton={true}
        containerStyle={{ paddingHorizontal: layout.screenPadding }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <GlassLayer radius={24} />
          <LinearGradient
            pointerEvents="none"
            colors={['rgba(255, 176, 0, 0.18)', 'rgba(18, 20, 24, 0)']}
            start={{ x: 0, y: 0.1 }}
            end={{ x: 0.9, y: 0.8 }}
            style={styles.heroGlow}
          />

          <View style={[styles.planBadge, !hasActivePlan ? styles.planBadgeInactive : null]}>
            <Star
              size={14}
              color={hasActivePlan ? '#0F1218' : colors.textPrimary}
              fill={hasActivePlan ? '#0F1218' : 'transparent'}
            />
            <Text style={[styles.planBadgeText, !hasActivePlan ? styles.planBadgeTextInactive : null]}>
              {planBadgeText}
            </Text>
          </View>

          <Text style={styles.planTitle}>Lumina Prime</Text>
          <Text style={styles.planSubtitle}>{planSubtitle}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceAmount}>$12.99</Text>
            <Text style={styles.priceUnit}>/month</Text>
          </View>

          {hasActivePlan ? (
            <View style={styles.billingRow}>
              <Calendar size={16} color={colors.textMuted} />
              <Text style={styles.billingText}>Renews on Apr 30, 2024</Text>
            </View>
          ) : (
            <Text style={styles.billingHint}>Cancel anytime. Switch or pause in settings.</Text>
          )}
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Your perks</Text>
          <Text style={[styles.sectionPill, !hasActivePlan ? styles.sectionPillInactive : null]}>
            {planStatusText}
          </Text>
        </View>

        <View style={styles.perkCard}>
          <GlassLayer radius={20} />
          {perks.map(item => (
            <View key={item.title} style={styles.perkRow}>
              <View style={styles.perkIconWrap}>
                <CheckCircle2 size={18} color={colors.primary} />
              </View>
              <View style={styles.perkTextWrap}>
                <Text style={styles.perkTitle}>{item.title}</Text>
                <Text style={styles.perkDescription}>{item.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.billingCard}>
          <GlassLayer radius={20} />
          <View style={styles.billingHeader}>
            <View style={styles.billingIconWrap}>
              <BadgeCheck size={18} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.billingLabel}>
                {hasActivePlan ? 'Default payment' : 'Payment method'}
              </Text>
              <Text style={styles.billingValue}>
                {hasActivePlan ? 'Visa ending 1421' : 'Add after selecting a plan'}
              </Text>
            </View>
          </View>

          <View style={styles.billingDivider} />

          <View style={styles.billingFooterRow}>
            <Text style={styles.billingFooterLabel}>
              {hasActivePlan ? 'Next charge' : 'Estimated monthly'}
            </Text>
            <Text style={styles.billingFooterValue}>$12.99</Text>
          </View>
        </View>

        <View style={styles.actionCard}>
          <TouchableOpacity activeOpacity={0.9} style={styles.primaryButton}>
            <LinearGradient
              colors={[colors.primary, '#FFC94D']}
              start={{ x: 0.47, y: 1 }}
              end={{ x: 0.53, y: 0 }}
              style={styles.primaryButtonGradient}
            >
              <Text style={styles.primaryButtonText}>{primaryActionText}</Text>
            </LinearGradient>
          </TouchableOpacity>

          {hasActivePlan ? (
            <TouchableOpacity activeOpacity={0.9} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Cancel membership</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 12,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 160,
  },
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 176, 0, 0.2)',
    backgroundColor: 'rgba(27, 30, 37, 0.7)',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 24,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 24,
  },
  planBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
  },
  planBadgeInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  planBadgeText: {
    color: colors.onPrimaryDeep,
    fontSize: typography.captionPlus,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  planBadgeTextInactive: {
    color: colors.textPrimary,
  },
  planTitle: {
    marginTop: 14,
    color: colors.textPrimary,
    fontSize: typography.displayLg,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  planSubtitle: {
    marginTop: 4,
    color: colors.textMutedSoft,
    fontSize: typography.bodyPlus,
    lineHeight: 20,
    fontWeight: '500',
  },
  priceRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  priceAmount: {
    color: colors.primary,
    fontSize: typography.displayXl,
    lineHeight: 38,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  priceUnit: {
    color: colors.textMuted,
    fontSize: typography.md,
    lineHeight: 22,
    fontWeight: '600',
    paddingBottom: 4,
  },
  billingRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  billingText: {
    color: colors.textMutedSoft,
    fontSize: typography.body,
    lineHeight: 18,
    fontWeight: '500',
  },
  billingHint: {
    marginTop: 10,
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 18,
    fontWeight: '500',
  },
  sectionHeaderRow: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.titlePlus,
    lineHeight: 28,
    fontWeight: '700',
  },
  sectionPill: {
    color: colors.primary,
    fontSize: typography.captionPlus,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  sectionPillInactive: {
    color: colors.textMuted,
  },
  perkCard: {
    marginTop: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(35, 38, 44, 0.4)',
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  perkIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 176, 0, 0.24)',
    backgroundColor: 'rgba(255, 176, 0, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkTextWrap: {
    flex: 1,
  },
  perkTitle: {
    color: colors.textPrimaryAlt,
    fontSize: typography.mdPlus,
    lineHeight: 22,
    fontWeight: '700',
  },
  perkDescription: {
    marginTop: 4,
    color: colors.textMutedLight,
    fontSize: typography.body,
    lineHeight: 18,
    fontWeight: '500',
  },
  billingCard: {
    marginTop: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(35, 38, 44, 0.4)',
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  billingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  billingIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 176, 0, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  billingLabel: {
    color: colors.textMuted,
    fontSize: typography.captionPlus,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  billingValue: {
    marginTop: 4,
    color: colors.textPrimaryAlt,
    fontSize: typography.mdPlus,
    lineHeight: 22,
    fontWeight: '700',
  },
  billingDivider: {
    marginTop: 14,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  billingFooterRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  billingFooterLabel: {
    color: colors.textMutedSoft,
    fontSize: typography.body,
    lineHeight: 18,
    fontWeight: '500',
  },
  billingFooterValue: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    lineHeight: 24,
    fontWeight: '700',
  },
  actionCard: {
    marginTop: 20,
    gap: 12,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: typography.lg,
    lineHeight: 22,
    fontWeight: '700',
  },
  secondaryButton: {
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(35, 38, 44, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: colors.textMutedSoft,
    fontSize: typography.md,
    lineHeight: 20,
    fontWeight: '600',
  },
});

export default PlanScreen;
