import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CircleAlert,
  Computer,
  CreditCard,
  ServerCrash,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import GlassLayer from '../components/GlassLayer';
import { colors, layout, typography } from '../constants/theme';
import { reset } from '../utils/navigationRef';
import socketService from '../utils/socket-service';

type Issue = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{
    size?: number;
    color?: string;
    strokeWidth?: number;
  }>;
};

const issues: Issue[] = [
  {
    id: 'card',
    title: 'Payment Declined',
    description:
      'Your payment method was declined by the bank. Please check with your provider or try a different payment method.',
    icon: CreditCard,
  },
  {
    id: 'bank',
    title: 'Payment Gateway Error',
    description:
      'The payment gateway is currently unresponsive. Try again shortly.',
    icon: ServerCrash,
  },
  {
    id: 'balance',
    title: 'Technical Glitch',
    description:
      'A technical issue occurred while processing your order. Please retry.',
    icon: Computer,
  },
];

const OrderFailedScreen = () => {
  const handleReturnToHome = () => {
    socketService.logAnalytics({
      action: 'page_view',
      name: 'Home Screen',
      from: 'OrderFailed Screen',
    });
    reset('Tabs', { screen: 'Home' });
  };

  const handleReturnToCart = () => {
    socketService.logAnalytics({
      action: 'page_view',
      name: 'Cart Screen',
      from: 'OrderFailed Screen',
    });
    reset('Tabs', { screen: 'Cart' });
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={styles.warningWrap}>
            <GlassLayer radius={46} tint="rgba(255, 115, 81, 0.12)" />
            <CircleAlert
              size={48}
              color={colors.accentCoral}
              strokeWidth={2.4}
            />
          </View>

          <Text style={styles.title}>Order Failed</Text>
          <Text style={styles.subtitle}>
            Your order could not be processed. Please try again or use a
            different payment method.
          </Text>
        </View>

        <View style={styles.issueCard}>
          <GlassLayer radius={24} tint="rgba(35, 38, 44, 0.4)" />

          <Text style={styles.issueTitle}>Common Issues</Text>
          <View style={styles.issueList}>
            {issues.map(issue => {
              const Icon = issue.icon;
              return (
                <View key={issue.id} style={styles.issueRow}>
                  <View style={styles.issueIconWrap}>
                    <Icon
                      size={18}
                      color={colors.textPrimary}
                      strokeWidth={2.2}
                    />
                  </View>
                  <View style={styles.issueTextBlock}>
                    <Text style={styles.issueLabel}>{issue.title}</Text>
                    <Text style={styles.issueBody}>{issue.description}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.92}
            onPress={handleReturnToCart}
          >
            <LinearGradient
              colors={['#FFB53A', '#F59E0A']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.primaryGradient}
            >
              <Text style={styles.primaryText}>Try Again</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.92}
            onPress={handleReturnToHome}
          >
            <GlassLayer radius={16} tint="rgba(255, 255, 255, 0.03)" />
            <Text style={styles.secondaryText}>Back to Home</Text>
          </TouchableOpacity>
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
    paddingHorizontal: layout.screenPadding,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 24,
  },
  heroSection: {
    alignItems: 'center',
    gap: 12,
  },
  warningWrap: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 1,
    borderColor: 'rgba(255, 115, 81, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.display3xl,
    lineHeight: 48,
    fontWeight: '800',
    letterSpacing: -1.1,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 280,
  },
  issueCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: 20,
    gap: 16,
    overflow: 'hidden',
  },
  issueGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    top: -70,
    right: -70,
    borderRadius: 140,
    backgroundColor: 'rgba(255, 115, 81, 0.18)',
  },
  issueTitle: {
    color: colors.textPrimary,
    fontSize: typography.captionPlus,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  issueList: {
    gap: 16,
  },
  issueRow: {
    flexDirection: 'row',
    gap: 12,
  },
  issueIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(12, 14, 18, 0.45)',
  },
  issueTextBlock: {
    flex: 1,
    gap: 4,
  },
  issueLabel: {
    color: colors.textPrimary,
    fontSize: typography.md,
    lineHeight: 22,
    fontWeight: '700',
  },
  issueBody: {
    color: colors.textMuted,
    fontSize: typography.smPlus,
    lineHeight: 18,
  },
  actions: {
    gap: 15,
    marginTop: 50,
  },
  primaryButton: {
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  primaryGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: colors.onPrimaryDark,
    fontSize: typography.lg,
    lineHeight: 24,
    fontWeight: '800',
  },
  secondaryButton: {
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  secondaryText: {
    color: colors.textPrimary,
    fontSize: typography.mdPlus,
    lineHeight: 22,
    fontWeight: '600',
  },
});

export default OrderFailedScreen;
