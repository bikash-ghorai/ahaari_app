/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { CheckCircle2, List, MapPin } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import GlassLayer from '../components/GlassLayer';
import { colors, layout, typography } from '../constants/theme';
import { useDispatch } from '../redux/store';
import { addCookingInstructions } from '../redux/app/appAction';
import { reset } from '../utils/navigationRef';

const OrderConfirmedScreen = () => {
  const route = useRoute<any>();
  const dispatch = useDispatch();
  const [instructionsNote, setInstructionsNote] = useState('');
  // const orderId = route.params?.orderId ?? 'LE-88291';
  const chefName = route.params?.chefName ?? 'Chef Antonio';
  const orderData = route.params?.order_data;

  console.log('route.params', route.params);

  const handleTrackLive = () => {
    if (!orderData?.order_id || !instructionsNote.trim()) {
      reset('Tabs', { screen: 'Orders' });
    }
    dispatch(
      addCookingInstructions({
        order_id: orderData?.order_id ?? '',
        instruction: instructionsNote,
      }),
    ).finally(() => {
      reset('Tabs', { screen: 'Orders' });
    });
  };

  const handleBackHome = () => {
    if (!orderData?.order_id || !instructionsNote.trim()) {
      reset('Tabs', { screen: 'Home' });
      return;
    }
    dispatch(
      addCookingInstructions({
        order_id: orderData?.order_id ?? '',
        instruction: instructionsNote,
      }),
    ).finally(() => {
      reset('Tabs', { screen: 'Home' });
    });
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView
          behavior="padding"
          style={{
            gap: 24,
          }}
        >
          <View style={styles.heroSection}>
            <View style={styles.checkWrap}>
              <GlassLayer radius={46} tint="rgba(255, 255, 255, 0.06)" />
              <CheckCircle2
                size={48}
                color={colors.primary}
                strokeWidth={2.4}
              />
            </View>

            <Text style={styles.title}>Order Confirmed</Text>
            <Text style={styles.subtitle}>
              Your delicious meal is being prepared. Get ready for a delightful
              dining experience!
            </Text>
          </View>

          <View style={styles.instructionsCard}>
            <GlassLayer radius={20} tint="rgba(255, 255, 255, 0.04)" />
            <View style={styles.instructionsHeader}>
              <List size={20} color={colors.primary} strokeWidth={2.2} />
              <Text style={styles.instructionsTitle}>Cooking Instructions</Text>
            </View>
            <View style={styles.fieldGroup}>
              <View style={[styles.inputShell, styles.inputTall]}>
                <TextInput
                  value={instructionsNote}
                  onChangeText={setInstructionsNote}
                  placeholder=" Add any special instructions for the chef (e.g., allergies, spice level, etc.)"
                  placeholderTextColor={colors.textMuted}
                  multiline={true}
                  style={[styles.inputText, styles.inputMultiline]}
                />
              </View>
            </View>
            <Text style={styles.instructionsNote}>
              Note: Please provide any specific instructions for the chef to ensure your meal is prepared to your liking. This will help us deliver a personalized dining experience.
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.92}
              onPress={handleTrackLive}
            >
              <LinearGradient
                colors={['#FFB53A', '#F59E0A']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.primaryGradient}
              >
                <MapPin
                  size={20}
                  color={colors.onPrimaryDark}
                  strokeWidth={2.4}
                />
                <Text style={styles.primaryText}>Track Live</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.92}
              onPress={handleBackHome}
            >
              <GlassLayer radius={16} tint="rgba(255, 255, 255, 0.03)" />
              <Text style={styles.secondaryText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    gap: 15,
    marginTop: '20%',
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
    shadowOffset: { width: 0, height: 8 },
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
    marginTop: 20,
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
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    color: colors.textMutedAlt,
    fontSize: typography.caption,
    letterSpacing: 1,
    fontWeight: '700',
  },
  inputShell: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(12, 14, 18, 0.6)',
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  inputTall: {
    minHeight: 68,
    paddingTop: 8,
    paddingBottom: 8,
  },
  inputText: {
    color: colors.textPrimary,
    fontSize: typography.bodyPlus,
    fontWeight: '600',
    paddingVertical: 0,
  },
  inputMultiline: {
    minHeight: 48,
    textAlignVertical: 'top',
  },
});

export default OrderConfirmedScreen;
