/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  RadialGradient as SvgRadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, typography } from '../constants/theme';
import type { RootStackParamList } from '../types/navigation';
import { useDispatch } from '../redux/store';
import { resendOtp, verifyOTP } from '../redux/user/userAction';

const OTP_LENGTH = 6;
const INITIAL_COUNTDOWN = 30;

type OtpAuthNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OtpAuth'
>;
type OtpAuthRouteProp = RouteProp<RootStackParamList, 'OtpAuth'>;

const FrostedLayer = ({ radius }: { radius: number }) => (
  <>
    {Platform.OS === 'ios' ? (
      <BlurView
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            borderRadius: radius,
          },
        ]}
        blurType="dark"
        blurAmount={34}
        reducedTransparencyFallbackColor="rgba(22, 26, 30, 0.82)"
      />
    ) : null}

    <View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          borderRadius: radius,
          backgroundColor:
            Platform.OS === 'android'
              ? 'rgba(23, 26, 30, 0.76)'
              : 'rgba(18, 20, 24, 0.58)',
        },
      ]}
    />
  </>
);

const formatPhoneLabel = (phone?: string) => {
  const digits = (phone ?? '').replace(/\D/g, '');

  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }

  if (digits.length > 0) {
    return `+${digits}`;
  }

  return '+91 91234 56789';
};

const OtpAuthScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<OtpAuthNavigationProp>();
  const route = useRoute<OtpAuthRouteProp>();
  const otpInputRef = useRef<TextInput>(null);
  const phone: string = route.params?.phone || '';

  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(INITIAL_COUNTDOWN);

  const phoneLabel = useMemo(() => formatPhoneLabel(phone), [phone]);

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  const focusOtpInput = () => {
    Keyboard.dismiss();
    otpInputRef.current?.focus();
  };

  const handleOtpChange = (value: string) => {
    const onlyDigits = value.replace(/\D/g, '').slice(0, OTP_LENGTH);
    setOtp(onlyDigits);
    if (onlyDigits.length === OTP_LENGTH) {
      Keyboard.dismiss();
    }
  };

  const handleResend = () => {
    if (countdown > 0) {
      return;
    }
    dispatch(resendOtp({ phone }))
      .unwrap()
      .then(() => {
        setCountdown(INITIAL_COUNTDOWN);
        setOtp('');
        focusOtpInput();
      });
  };

  const handleVerify = () => {
    if (otp.length < OTP_LENGTH) {
      return;
    }
    dispatch(verifyOTP({ phone, otp }));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View pointerEvents="none" style={styles.backgroundLayer}>
        <Svg width="100%" height="100%" style={styles.backgroundSvg}>
          <Defs>
            <SvgLinearGradient id="otpBgBase" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#07090D" stopOpacity={1} />
              <Stop offset="48%" stopColor="#090B10" stopOpacity={1} />
              <Stop offset="100%" stopColor="#06070A" stopOpacity={1} />
            </SvgLinearGradient>

            <SvgRadialGradient id="otpBgCardHalo" cx="50%" cy="53%" r="68%">
              <Stop offset="0%" stopColor="#FFB020" stopOpacity={0.3} />
              <Stop offset="38%" stopColor="#F59E0B" stopOpacity={0.14} />
              <Stop offset="76%" stopColor="#D97706" stopOpacity={0.05} />
              <Stop offset="100%" stopColor="#D97706" stopOpacity={0} />
            </SvgRadialGradient>

            <SvgRadialGradient id="otpBgVignette" cx="50%" cy="50%" r="86%">
              <Stop offset="62%" stopColor="#000000" stopOpacity={0} />
              <Stop offset="100%" stopColor="#000000" stopOpacity={0.42} />
            </SvgRadialGradient>
          </Defs>

          <Rect x="0" y="0" width="100%" height="100%" fill="url(#otpBgBase)" />
          <Rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#otpBgCardHalo)"
          />
          <Rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#otpBgVignette)"
          />
        </Svg>
      </View>

      <View style={styles.content}>
        <View style={styles.topBar}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <MaterialIcons name="arrow-back" size={20} color="#F3F3F9" />
          </TouchableOpacity>

          <Text style={styles.topTitle}>OTP Authentication</Text>
        </View>

        <View style={styles.card}>
          <FrostedLayer radius={32} />
          <View pointerEvents="none" style={styles.cardMesh} />

          <View style={styles.cardInner}>
            <View style={styles.iconBadge}>
              <MaterialIcons name="lock-open" size={28} color="#1B1201" />
            </View>

            <Text style={styles.heading}>Enter OTP</Text>
            <Text style={styles.subheading}>We sent a 6-digit code to</Text>
            <Text style={styles.phoneLabel}>{phoneLabel}</Text>

            <Pressable style={styles.otpRow} onPress={focusOtpInput}>
              {Array.from({ length: OTP_LENGTH }).map((_, index) => {
                const digit = otp[index] ?? '';
                const isActive =
                  index === otp.length && otp.length < OTP_LENGTH;
                const isFilled = index < otp.length;

                return (
                  <View
                    key={`otp-${index}`}
                    style={[
                      styles.otpCell,
                      isActive ? styles.otpCellActive : null,
                    ]}
                  >
                    <Text
                      style={[
                        styles.otpDigit,
                        isFilled ? styles.otpDigitFilled : null,
                      ]}
                    >
                      {digit}
                    </Text>
                  </View>
                );
              })}
            </Pressable>

            <TextInput
              ref={otpInputRef}
              value={otp}
              onChangeText={handleOtpChange}
              keyboardType="number-pad"
              maxLength={OTP_LENGTH}
              textContentType="oneTimeCode"
              autoComplete="one-time-code"
              style={styles.hiddenInput}
              autoFocus
            />

            <View style={styles.metaRow}>
              <Text style={styles.metaText}>Did not receive code?</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleResend}
                disabled={countdown > 0}
              >
                <Text
                  style={[
                    styles.resendText,
                    countdown > 0 ? styles.resendDisabled : null,
                  ]}
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={otp.length === OTP_LENGTH ? 0.9 : 1}
              onPress={handleVerify}
              disabled={otp.length < OTP_LENGTH}
              style={styles.verifyButton}
            >
              <LinearGradient
                colors={
                  otp.length === OTP_LENGTH
                    ? ['#FFAD3A', '#E79400']
                    : ['#5C4A2A', '#4A3B22']
                }
                start={{ x: 0.1, y: 0 }}
                end={{ x: 0.95, y: 1 }}
                style={styles.verifyGradient}
              >
                <Text
                  style={[
                    styles.verifyText,
                    otp.length < OTP_LENGTH ? styles.verifyTextDisabled : null,
                  ]}
                >
                  Verify & Continue
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.changeNumberText}>Change mobile number</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06070A',
  },
  backgroundLayer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
  },
  backgroundSvg: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: layout.screenPadding,
    paddingTop: 20,
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    color: '#F3F3F9',
    fontSize: typography.lg,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  card: {
    flex: 1,
    maxHeight: 620,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 28,
  },
  cardMesh: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(245, 158, 10, 0.05)',
  },
  cardInner: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 26,
  },
  iconBadge: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: '#FFAD3A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.32,
    shadowRadius: 16,
  },
  heading: {
    color: '#F3F3F9',
    fontSize: typography.display,
    fontWeight: '800',
    letterSpacing: -0.8,
    textAlign: 'center',
    marginBottom: 10,
  },
  subheading: {
    color: '#AAABB0',
    fontSize: typography.body,
    fontWeight: '500',
    textAlign: 'center',
  },
  phoneLabel: {
    marginTop: 6,
    marginBottom: 24,
    color: '#FFD79A',
    fontSize: typography.md,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  otpRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 22,
  },
  otpCell: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(90, 93, 102, 0.62)',
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpCellActive: {
    borderColor: 'rgba(255, 173, 58, 0.82)',
    backgroundColor: 'rgba(255, 173, 58, 0.08)',
  },
  otpDigit: {
    color: '#F3F3F9',
    fontSize: typography.xl,
    fontWeight: '600',
  },
  otpDigitFilled: {
    color: '#FFFFFF',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  metaRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metaText: {
    color: '#AAABB0',
    fontSize: typography.body,
    fontWeight: '500',
  },
  resendText: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  resendDisabled: {
    color: 'rgba(170, 171, 176, 0.74)',
  },
  verifyButton: {
    width: '100%',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 18,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  verifyGradient: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  verifyText: {
    color: '#1B1201',
    fontSize: typography.lg,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  verifyTextDisabled: {
    color: '#B9A88A',
  },
  changeNumberText: {
    color: 'rgba(170, 171, 176, 0.9)',
    fontSize: typography.body,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default OtpAuthScreen;
