import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { colors, layout, typography, radius, spacing } from '../constants/theme';

type Props = {
  title?: string;
  description?: string;
  isVisible: boolean;
  onBtn1Press?: () => void;
  onBtn2Press?: () => void;
  hideBtn1?: boolean;
  hideBtn2?: boolean;
  btn1Name?: string;
  btn2Name?: string;
  btn1Style?: any;
  btn2Style?: any;
};

const PopupMessage: React.FC<Props> = ({
  title,
  description,
  isVisible,
  onBtn1Press = () => { },
  onBtn2Press = () => { },
  btn1Name = 'Cancel',
  btn2Name = 'Okay',
  hideBtn1 = false,
  hideBtn2 = false,
  btn1Style,
  btn2Style,
}) => {
  return (
    <Modal visible={isVisible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.cardWrapper}>
          {/* Subtle amber glow behind icon */}
          <View style={styles.card}>
            {/* Icon */}
            <View style={styles.iconCircle}>
              <AlertTriangle size={26} color={colors.primary} strokeWidth={2} />
            </View>

            {/* Text */}
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{description}</Text>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Actions */}
            <View style={styles.actions}>
              {!hideBtn1 && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.cancelButton, btn1Style]}
                  onPress={onBtn1Press}
                >
                  <Text style={styles.cancelText}>{btn1Name}</Text>
                </TouchableOpacity>
              )}

              {!hideBtn2 && (
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.primaryButton, btn2Style]}
                  onPress={onBtn2Press}
                >
                  <Text style={styles.primaryText}>{btn2Name}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
  },

  /* Card shell — matches UpdatePopup cardWrapper pattern */
  cardWrapper: {
    width: '100%',
    maxWidth: 340,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: '#14161B',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
  },

  /* Subtle amber radial glow — top centre, echoes AppBackground */
  glowOrb: {
    position: 'absolute',
    top: -40,
    alignSelf: 'center',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.primary,
    opacity: 0.07,
  },

  card: {
    padding: spacing.xl,
    paddingTop: spacing.xl * 1.5,
    alignItems: 'center',
  },

  /* Amber-tinted icon circle — mirrors UpdatePopup iconCircle */
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 176, 0, 0.10)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 176, 0, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },

  iconInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 176, 0, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.sm,
    letterSpacing: 0.2,
  },

  subtitle: {
    color: colors.textMutedCool,
    fontSize: typography.body,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
  },

  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: spacing.xl,
  },

  actions: {
    flexDirection: 'row',
    width: '100%',
    gap: spacing.md,
  },

  /* Ghost / cancel button — glass surface */
  cancelButton: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },

  cancelText: {
    color: colors.textSecondary,
    fontSize: typography.body,
    fontWeight: '700',
  },

  /* Primary / confirm button — amber with glow shadow */
  primaryButton: {
    flex: 1,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    shadowColor: colors.primary,
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },

  primaryText: {
    color: colors.onPrimaryDeep,
    fontSize: typography.body,
    fontWeight: '800',
  },
});

export default PopupMessage;
