/* eslint-disable react-native/no-inline-styles */
import React, { useMemo, useState } from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import MaterialIcons from '@react-native-vector-icons/material-icons';
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
import { useDispatch } from '../redux/store';
import { login } from '../redux/user/userAction';

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

const LoginScreen = () => {
  const dispatch = useDispatch();
  const [phone, setPhone] = useState('');

  const phoneDigits = useMemo(() => phone.replace(/\D/g, ''), [phone]);
  const canRequestOtp = phoneDigits.length === 10;

  const handleGetOtp = () => {
    if (!canRequestOtp) {
      return;
    }
    dispatch(login({ phone: phoneDigits }));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View pointerEvents="none" style={styles.backgroundLayer}>
        <Svg width="100%" height="100%" style={styles.backgroundSvg}>
          <Defs>
            <SvgLinearGradient
              id="loginBgBase"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="#07090D" stopOpacity={1} />
              <Stop offset="48%" stopColor="#090B10" stopOpacity={1} />
              <Stop offset="100%" stopColor="#06070A" stopOpacity={1} />
            </SvgLinearGradient>

            <SvgRadialGradient id="loginBgCardHalo" cx="50%" cy="53%" r="68%">
              <Stop offset="0%" stopColor="#FFB020" stopOpacity={0.36} />
              <Stop offset="36%" stopColor="#F59E0B" stopOpacity={0.18} />
              <Stop offset="72%" stopColor="#D97706" stopOpacity={0.06} />
              <Stop offset="100%" stopColor="#D97706" stopOpacity={0} />
            </SvgRadialGradient>

            <SvgRadialGradient id="loginBgVignette" cx="50%" cy="50%" r="86%">
              <Stop offset="62%" stopColor="#000000" stopOpacity={0} />
              <Stop offset="100%" stopColor="#000000" stopOpacity={0.42} />
            </SvgRadialGradient>
          </Defs>

          <Rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#loginBgBase)"
          />
          <Rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#loginBgCardHalo)"
          />
          <Rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#loginBgVignette)"
          />
        </Svg>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <FrostedLayer radius={32} />
          <View pointerEvents="none" style={styles.cardMesh} />

          <View style={styles.cardInner}>
            <View style={styles.header}>
              <View style={styles.brandWrap}>
                <View style={styles.brandGlow} />

                <LinearGradient
                  colors={['#FFAD3A', '#D97706']}
                  start={{ x: 0.2, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.brandIconShell}
                >
                  <Image
                    source={require('../assets/logo.png')}
                    style={{ width: 80, height: 80 }}
                  />
                </LinearGradient>
                {/* <Text style={styles.brandLuxe}>BiteO</Text>
                <Text style={styles.brandEats}>Your Food, Faster.</Text> */}
              </View>

              <Text style={styles.heading}>Let's Get Started</Text>
              <Text style={styles.subheading}>
                Enter your mobile number to continue
              </Text>
            </View>

            <View style={styles.inputShell}>
              <TouchableOpacity
                activeOpacity={0.86}
                style={styles.countryCodeButton}
              >
                <Text style={styles.countryCodeText}>IN +91</Text>
                <MaterialIcons name="expand-more" color="#AAABB0" size={20} />
              </TouchableOpacity>

              <TextInput
                keyboardType="phone-pad"
                placeholder="91234 56789"
                placeholderTextColor="rgba(170, 171, 176, 0.62)"
                style={styles.phoneInput}
                value={phone}
                onChangeText={text => setPhone(text)}
                maxLength={10}
              />
            </View>

            <TouchableOpacity
              activeOpacity={canRequestOtp ? 0.92 : 1}
              style={styles.otpButton}
              onPress={handleGetOtp}
              disabled={!canRequestOtp}
            >
              <LinearGradient
                colors={
                  canRequestOtp
                    ? ['#FFAD3A', '#E79400']
                    : ['#5C4A2A', '#4A3B22']
                }
                start={{ x: 0.1, y: 0 }}
                end={{ x: 0.95, y: 1 }}
                style={styles.otpGradient}
              >
                <Text
                  style={[
                    styles.otpText,
                    !canRequestOtp ? styles.otpTextDisabled : null,
                  ]}
                >
                  Get OTP
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.footerText}>
              By continuing, you agree to our{`\n`}
              <Text style={styles.footerLink}>Terms of Service</Text>
            </Text>
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
    justifyContent: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 24,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.2,
    shadowRadius: 34,
    // elevation: 12,
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
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    gap: 24,
  },
  header: {
    alignItems: 'center',
  },
  brandWrap: {
    marginBottom: 34,
    alignItems: 'center',
    position: 'relative',
  },
  brandGlow: {
    position: 'absolute',
    top: 0,
    width: 80,
    height: 80,
    borderRadius: 100,
    boxShadow: '0px 0px 40px 12px rgba(245, 158, 11, 0.28)',
  },
  brandIconShell: {
    width: 80,
    height: 80,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  brandLuxe: {
    color: '#FFFFFF',
    fontSize: typography.display,
    fontWeight: '900',
    // letterSpacing: 7,
    lineHeight: 36,
  },
  brandEats: {
    marginTop: 2,
    color: colors.primary,
    fontSize: typography.sm,
    fontWeight: '800',
    // letterSpacing: 8,
  },
  heading: {
    color: '#F3F3F9',
    fontSize: typography.display2xl,
    fontWeight: '800',
    letterSpacing: -0.8,
    textAlign: 'center',
    marginBottom: 8,
  },
  subheading: {
    color: '#AAABB0',
    fontSize: typography.body,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.25,
  },
  inputShell: {
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(70, 72, 76, 0.46)',
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  countryCodeButton: {
    width: 108,
    borderRightWidth: 1,
    borderRightColor: 'rgba(70, 72, 76, 0.52)',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  countryCodeText: {
    color: '#F3F3F9',
    fontSize: typography.md,
    fontWeight: '700',
    letterSpacing: 0.35,
  },
  phoneInput: {
    flex: 1,
    height: '100%',
    color: '#F3F3F9',
    fontSize: typography.md,
    fontWeight: '500',
    paddingHorizontal: 14,
  },
  otpButton: {
    borderRadius: 999,
    overflow: 'hidden',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.38,
    shadowRadius: 24,
    elevation: 8,
  },
  otpGradient: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  otpText: {
    color: '#1B1201',
    fontSize: typography.lg,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  otpTextDisabled: {
    color: '#B9A88A',
  },
  footerText: {
    marginTop: 4,
    color: 'rgba(170, 171, 176, 0.74)',
    textAlign: 'center',
    fontSize: typography.sm,
    lineHeight: 18,
    fontWeight: '500',
  },
  footerLink: {
    color: colors.primary,
    fontWeight: '700',
  },
});

export default LoginScreen;
