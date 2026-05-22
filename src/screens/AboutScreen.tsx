import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BadgeCheck,
  ExternalLink,
  Heart,
  Rocket,
  Star,
} from 'lucide-react-native';

import { colors, layout, typography } from '../constants/theme';
import Header from '../components/Header';

const highlights = [
  {
    id: 'curated',
    title: 'Curated menus',
    subtitle: 'Chef-designed collections updated daily.',
    icon: Star,
    tone: colors.primary,
  },
  {
    id: 'priority',
    title: 'Priority delivery',
    subtitle: 'Fast-track orders with VIP routing.',
    icon: Rocket,
    tone: colors.primary,
  },
  {
    id: 'community',
    title: 'Loved locally',
    subtitle: 'Trusted by food lovers across the city.',
    icon: Heart,
    tone: colors.accentCoral,
  },
];

const AboutScreen = () => {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <Header
        title="About"
        showBackButton={true}
        containerStyle={{ paddingHorizontal: layout.screenPadding }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.brandRow}>
            <View style={styles.logoWrap}>
              <Image
                source={require('../assets/name_logo.png')}
                style={styles.logoImage}
              />
            </View>

            <View style={styles.brandText}>
              <Text style={styles.brandTitle}>BiteO</Text>
              <Text style={styles.brandSubtitle}>Curated dining, delivered.</Text>
            </View>
          </View>

          <View style={styles.heroMetaRow}>
            <View style={styles.heroPill}>
              <BadgeCheck size={13} color={colors.primary} strokeWidth={2.4} />
              <Text style={styles.heroPillText}>Chef Verified</Text>
            </View>
            <View style={styles.heroPillMuted}>
              <Text style={styles.heroPillMutedText}>Version 1.4.0</Text>
            </View>
          </View>

          <Text style={styles.heroBody}>
            BiteO curates premium menus from top kitchens, pairing seasonal ingredients with
            delightful delivery experiences.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>What we deliver</Text>
          <View style={styles.highlightList}>
            {highlights.map(item => {
              const Icon = item.icon;

              return (
                <View key={item.id} style={styles.highlightRow}>
                  <View style={styles.highlightIconWrap}>
                    <Icon size={18} color={item.tone} strokeWidth={2.2} />
                  </View>
                  <View style={styles.highlightTextWrap}>
                    <Text style={styles.highlightTitle}>{item.title}</Text>
                    <Text style={styles.highlightSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Legal & support</Text>

          <TouchableOpacity style={styles.linkRow} activeOpacity={0.8}>
            <Text style={styles.linkLabel}>Privacy policy</Text>
            <ExternalLink size={18} color={colors.textMuted} />
          </TouchableOpacity>
          <View style={styles.cardDivider} />

          <TouchableOpacity style={styles.linkRow} activeOpacity={0.8}>
            <Text style={styles.linkLabel}>Terms of service</Text>
            <ExternalLink size={18} color={colors.textMuted} />
          </TouchableOpacity>
          <View style={styles.cardDivider} />

          <TouchableOpacity style={styles.linkRow} activeOpacity={0.8}>
            <Text style={styles.linkLabel}>Help center</Text>
            <ExternalLink size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Share feedback</Text>
          <Text style={styles.cardBodyText}>
            Tell us what you love, what you want next, and what would make delivery even better.
          </Text>

          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.92}>
            <LinearGradient
              colors={[colors.primary, '#FFC94D']}
              start={{ x: 0.45, y: 1 }}
              end={{ x: 0.55, y: 0 }}
              style={styles.primaryButtonGradient}
            >
              <Text style={styles.primaryButtonText}>Send feedback</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 12,
    paddingBottom: 160,
    gap: 24,
  },
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 18,
    gap: 14,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  logoWrap: {
    width: 54,
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  brandText: {
    flex: 1,
    gap: 3,
  },
  brandTitle: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    fontWeight: '500',
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  heroPillText: {
    color: colors.primary,
    fontSize: typography.captionPlus,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  heroPillMuted: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  heroPillMutedText: {
    color: colors.textMutedPale,
    fontSize: typography.captionPlus,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  heroBody: {
    color: colors.textSecondary,
    fontSize: typography.bodyPlus,
    lineHeight: 22,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 18,
    gap: 16,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: typography.titlePlus,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  cardBodyText: {
    color: colors.textMuted,
    fontSize: typography.bodyPlus,
    lineHeight: 22,
  },
  highlightList: {
    gap: 14,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  highlightIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightTextWrap: {
    flex: 1,
    gap: 2,
  },
  highlightTitle: {
    color: colors.textPrimary,
    fontSize: typography.bodyPlus,
    fontWeight: '700',
  },
  highlightSubtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 20,
  },
  linkRow: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  linkLabel: {
    color: colors.textPrimary,
    fontSize: typography.bodyPlus,
    fontWeight: '600',
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  primaryButton: {
    height: 52,
    borderRadius: 16,
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: colors.black,
    fontSize: typography.lg,
    fontWeight: '700',
  },
});

export default AboutScreen;
