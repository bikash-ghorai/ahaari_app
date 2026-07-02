import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  Platform,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { ShieldCheck, Monitor } from 'lucide-react-native';
import { colors, typography, radius, spacing } from '../constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const CODE_DISPLAY_SECONDS = 60;

interface AdminWebLoginPopupProps {
  isVisible: boolean;
  code: string;
  onExpire: () => void;
}

const AdminWebLoginPopup: React.FC<AdminWebLoginPopupProps> = ({
  isVisible,
  code,
  onExpire,
}) => {
  const [timeLeft, setTimeLeft] = useState(CODE_DISPLAY_SECONDS);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animate in / out when visibility changes
  useEffect(() => {
    if (isVisible) {
      setTimeLeft(CODE_DISPLAY_SECONDS);
      progressAnim.setValue(1);

      Animated.parallel([
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 60,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();

      // Animate the progress bar from full → empty over CODE_DISPLAY_SECONDS
      Animated.timing(progressAnim, {
        toValue: 0,
        duration: CODE_DISPLAY_SECONDS * 1000,
        useNativeDriver: false,
      }).start();

      // Countdown ticker
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            timerRef.current = null;
            dismissAndExpire();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      animateOut();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  const animateOut = () => {
    Animated.parallel([
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const dismissAndExpire = () => {
    animateOut();
    setTimeout(() => onExpire(), 350);
  };

  // Split the 6-digit code into individual characters
  const digits = code.padEnd(6, '-').split('');

  // Progress bar width as animated style
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const progressColor = progressAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: ['#FF4444', '#FFB000', '#4CAF50'],
  });

  return (
    <Modal visible={isVisible} transparent animationType="none" statusBarTranslucent>
      {/* Dark overlay */}
      <TouchableWithoutFeedback onPress={dismissAndExpire}>
        <Animated.View style={[styles.overlay, { opacity: overlayAnim }]} />
      </TouchableWithoutFeedback>

      {/* Bottom sheet card */}
      <Animated.View
        style={[
          styles.sheet,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Top drag pill */}
        <View style={styles.dragPill} />

        {/* Header row */}
        <View style={styles.headerRow}>
          <View style={styles.iconBadge}>
            <Monitor size={20} color={colors.primary} strokeWidth={2} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Ahaari Hub Login</Text>
            <Text style={styles.headerSub}>Someone is signing into the web panel</Text>
          </View>
          <View style={styles.shieldBadge}>
            <ShieldCheck size={18} color={colors.successBright} strokeWidth={2} />
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Instruction */}
        <Text style={styles.instruction}>Enter this code on the hub login page</Text>

        {/* 6-digit code display */}
        <View style={styles.codeRow}>
          {digits.slice(0, 3).map((digit, i) => (
            <View key={`l-${i}`} style={styles.digitBox}>
              <Text style={styles.digitText}>{digit}</Text>
            </View>
          ))}
          <View style={styles.codeSpacer} />
          {digits.slice(3, 6).map((digit, i) => (
            <View key={`r-${i}`} style={styles.digitBox}>
              <Text style={styles.digitText}>{digit}</Text>
            </View>
          ))}
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressWidth,
                backgroundColor: progressColor as any,
              },
            ]}
          />
        </View>

        {/* Countdown label */}
        <Text style={styles.countdownText}>
          {timeLeft > 0
            ? `Changes in ${timeLeft}s`
            : 'Code expired'}
        </Text>

        {/* Security note */}
        <View style={styles.securityNote}>
          <ShieldCheck size={13} color={colors.textMuted} strokeWidth={2} />
          <Text style={styles.securityNoteText}>
            Never share this code. It grants admin access.
          </Text>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#14161B',
    borderTopLeftRadius: radius.xl + 4,
    borderTopRightRadius: radius.xl + 4,
    paddingHorizontal: spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    // Premium shadow
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: -10 },
    elevation: 30,
  },
  dragPill: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255, 176, 0, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 176, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: typography.md,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  headerSub: {
    color: colors.textMuted,
    fontSize: typography.caption,
    marginTop: 2,
  },
  shieldBadge: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    marginBottom: spacing.xl,
  },
  instruction: {
    color: colors.textMutedCool,
    fontSize: typography.bodyPlus,
    textAlign: 'center',
    marginBottom: spacing.xl,
    letterSpacing: 0.1,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl + 4,
    gap: spacing.sm,
  },
  codeSpacer: {
    width: 20,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: spacing.xs,
    borderRadius: 1,
  },
  digitBox: {
    width: 44,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: '#1D2025',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 176, 0, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    // Subtle amber glow
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  digitText: {
    color: colors.textPrimary,
    fontSize: typography.displayCard,
    fontWeight: '800',
    letterSpacing: 1,
  },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  countdownText: {
    color: colors.textMuted,
    fontSize: typography.sm,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: radius.sm,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  securityNoteText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontStyle: 'italic',
  },
});

export default AdminWebLoginPopup;
