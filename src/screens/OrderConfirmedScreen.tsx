import React from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CheckCircle2, CookingPot, List, MapPin } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import GlassLayer from '../components/GlassLayer';
import { colors, layout, typography } from '../constants/theme';
import type { RootStackParamList } from '../types/navigation';

type OrderConfirmedRouteProp = RouteProp<RootStackParamList, 'OrderConfirmed'>;

type OrderConfirmedNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderConfirmed'>;

const OrderConfirmedScreen = () => {
  const navigation = useNavigation<OrderConfirmedNavigationProp>();
  const route = useRoute<OrderConfirmedRouteProp>();
  const orderId = route.params?.orderId ?? 'LE-88291';
  const etaMinutes = route.params?.etaMinutes ?? 25;
  const itemName = route.params?.itemName ?? 'Truffle Pasta';
  const chefName = route.params?.chefName ?? 'Chef Antonio';

  const handleTrackLive = () => {
    navigation.navigate('OrderDetails', { orderId });
  };

  const handleBackHome = () => {
    navigation.navigate('Tabs', { screen: 'Home' });
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={styles.checkWrap}>
            <GlassLayer radius={46} tint="rgba(255, 255, 255, 0.06)" />
            <CheckCircle2 size={48} color={colors.primary} strokeWidth={2.4} />
          </View>

          <Text style={styles.title}>Order Confirmed</Text>
          <Text style={styles.subtitle}>Your midnight feast is being prepared by {chefName}.</Text>
        </View>

        <View style={styles.statusCard}>
          <GlassLayer radius={24} tint="rgba(35, 38, 44, 0.4)" />
          <View pointerEvents="none" style={styles.statusGlow} />

          <View style={styles.statusContent}>
            <Text style={styles.kicker}>Estimated Arrival</Text>
            <View style={styles.etaRow}>
              <Text style={styles.etaValue}>{etaMinutes}</Text>
              <Text style={styles.etaUnit}>min</Text>
            </View>
            <View style={styles.prepRow}>
              <CookingPot size={16} color={colors.primary} strokeWidth={2.1} />
              <Text style={styles.prepText}>Preparing your {itemName}</Text>
            </View>
          </View>

          <View style={styles.mapWrap}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_-m3ulekqxhMaqjUr1NedlNlVbn-CW-uC5FEG1E1X8cnnmagXLFWGlUGKp9nTa_hi9CJVd8QqLUnxia_7sd71QNkjlWWPlOt7z_WopQe_IlCymzlo2Bwc2HSnEXDv-0Kd135BHZyhZd9QjdCOhq_BPTnMN1r_PY2m2UEGLPm9ppeu1rP955HNu7TcNBDNpfNObmGVSUShKraFOEsIC7rHdMvJv7EY7puzu6Iqllht4cWw4sZqOkDPjBWaJVWdIjBpLBsVPtUHgSw',
              }}
              style={styles.mapImage}
            />
            <View style={styles.mapDim} />
            <LinearGradient
              colors={['rgba(245, 158, 11, 0)', 'rgba(245, 158, 11, 0.7)', 'rgba(245, 158, 11, 0)']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.routeLine}
            />
            <View style={styles.routeDotStart} />
            <View style={styles.routeDotEnd}>
              <View style={styles.routeDotCore} />
            </View>
          </View>
        </View>

        <View style={styles.instructionsCard}>
          <GlassLayer radius={20} tint="rgba(255, 255, 255, 0.04)" />
          <View style={styles.instructionsHeader}>
            <List size={20} color={colors.primary} strokeWidth={2.2} />
            <Text style={styles.instructionsTitle}>Cooking Instructions</Text>
          </View>
          <View style={styles.instructionsBubble}>
            <Text style={styles.instructionsText}>"Extra parmesan, no parsley"</Text>
          </View>
          <Text style={styles.instructionsNote}>
            Chef {chefName} has received your requests and is preparing your meal accordingly.
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.92} onPress={handleTrackLive}>
            <LinearGradient
              colors={['#FFB53A', '#F59E0A']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.primaryGradient}
            >
              <MapPin size={20} color={colors.onPrimaryDark} strokeWidth={2.4} />
              <Text style={styles.primaryText}>Track Live</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.92} onPress={handleBackHome}>
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
    gap: 10,
  },
  checkWrap: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
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
    letterSpacing: -1.2,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.bodyPlus,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 280,
  },
  statusCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(35, 38, 44, 0.4)',
    padding: 18,
    gap: 16,
    overflow: 'hidden',
  },
  statusGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    top: -80,
    right: -80,
    borderRadius: 160,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  statusContent: {
    gap: 6,
  },
  kicker: {
    color: colors.primary,
    fontSize: typography.caption,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  etaValue: {
    color: colors.textPrimary,
    fontSize: typography.display5xl,
    lineHeight: 52,
    fontWeight: '800',
    letterSpacing: -1,
  },
  etaUnit: {
    color: colors.textMuted,
    fontSize: typography.mdPlus,
    lineHeight: 22,
    fontWeight: '600',
    marginBottom: 6,
  },
  prepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  prepText: {
    color: colors.textMuted,
    fontSize: typography.smPlus,
    lineHeight: 18,
    fontWeight: '500',
  },
  mapWrap: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    opacity: 0.85,
  },
  mapDim: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(12, 14, 18, 0.45)',
  },
  routeLine: {
    position: 'absolute',
    left: '20%',
    right: '20%',
    top: '52%',
    height: 3,
    borderRadius: 999,
    transform: [{ rotate: '-12deg' }],
  },
  routeDotStart: {
    position: 'absolute',
    left: '24%',
    top: '52%',
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.65,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  routeDotEnd: {
    position: 'absolute',
    right: '22%',
    top: '40%',
    width: 14,
    height: 14,
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.7,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  routeDotCore: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.background,
  },
  instructionsCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: 18,
    gap: 12,
    overflow: 'hidden',
  },
  instructionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  instructionsTitle: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    lineHeight: 24,
    fontWeight: '700',
  },
  instructionsBubble: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  instructionsText: {
    color: colors.textSecondary,
    fontSize: typography.mdPlus,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  instructionsNote: {
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
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  primaryGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
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

export default OrderConfirmedScreen;
