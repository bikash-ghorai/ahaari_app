import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CircleAlert, CreditCard, Headset, Wallet } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import GlassLayer from '../components/GlassLayer';
import { colors, layout, typography } from '../constants/theme';
import type { RootStackParamList } from '../types/navigation';

type OrderFailedRouteProp = RouteProp<RootStackParamList, 'OrderFailed'>;

type OrderFailedNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderFailed'>;

type Issue = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
};

const issues: Issue[] = [
  {
    id: 'balance',
    title: 'Insufficient Balance',
    description: 'Please check your account balance and ensure funds are available.',
    icon: Wallet,
  },
  {
    id: 'bank',
    title: 'Bank Server Busy',
    description: 'The bank server is currently unresponsive. Try again shortly.',
    icon: CreditCard,
  },
];

const OrderFailedScreen = () => {
  const navigation = useNavigation<OrderFailedNavigationProp>();
  const route = useRoute<OrderFailedRouteProp>();
  const reason =
    route.params?.reason ??
    'Your payment could not be processed. Please try again or use a different payment method.';

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('Tabs', { screen: 'Cart' });
  };

  const handleRetry = () => {
    navigation.navigate('Tabs', { screen: 'Cart' });
  };

  const handleReturnToCart = () => {
    navigation.navigate('Tabs', { screen: 'Cart' });
  };

  const handleHelp = () => {
    navigation.navigate('Tabs', { screen: 'Orders' });
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
            <CircleAlert size={48} color={colors.accentCoral} strokeWidth={2.4} />
          </View>

          <Text style={styles.title}>Order Failed</Text>
          <Text style={styles.subtitle}>{reason}</Text>
        </View>

        <View style={styles.issueCard}>
          <GlassLayer radius={24} tint="rgba(35, 38, 44, 0.4)" />
          <View pointerEvents="none" style={styles.issueGlow} />

          <Text style={styles.issueTitle}>Common Issues</Text>
          <View style={styles.issueList}>
            {issues.map(issue => {
              const Icon = issue.icon;
              return (
                <View key={issue.id} style={styles.issueRow}>
                  <View style={styles.issueIconWrap}>
                    <Icon size={18} color={colors.textPrimary} strokeWidth={2.2} />
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
          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.92} onPress={handleRetry}>
            <LinearGradient
              colors={['#FFB53A', '#F59E0A']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.primaryGradient}
            >
              <Text style={styles.primaryText}>Retry Payment</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.92}
            onPress={handleReturnToCart}
          >
            <GlassLayer radius={16} tint="rgba(255, 255, 255, 0.03)" />
            <Text style={styles.secondaryText}>Return to Cart</Text>
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
    shadowOffset: { width: 0, height: 8 }
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
    gap: 12,
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
