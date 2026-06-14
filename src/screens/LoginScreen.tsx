/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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
import auth from '@react-native-firebase/auth';

import { colors, layout, typography } from '../constants/theme';
import { useDispatch, useSelector } from '../redux/store';
import { firebaseLogin, updateLocation } from '../redux/user/userAction';
import { showToaster } from '../utils/toaster';
import { reset } from '../utils/navigationRef';
import messaging from '@react-native-firebase/messaging';
import { setApiToken } from '../utils/axios';
import {
  setAuthTokenToAsyncStore,
  setUserDetailsToAsyncStore,
} from '../utils/storage';

const OTP_LENGTH = 6;

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
  const [isLoading, setIsLoading] = useState(false);

  const phoneDigits = useMemo(() => phone.replace(/\D/g, ''), [phone]);

  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const { userCurrentCoords } = useSelector(state => state.user);

  const otpInputRef = useRef<TextInput>(null);

  const [phoneAuthSnapshotState, setPhoneAuthSnapshotState] =
    useState<any>(null);
  const [otp, setOtp] = useState('');

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

  useEffect(() => {
    const fetchFcmToken = async () => {
      try {
        const token = await messaging().getToken();
        setFcmToken(token);
      } catch (error) {
        console.log('Error fetching FCM token:', error);
      }
    };

    fetchFcmToken();
  }, []);

  const handleGetOtp = async () => {
    if (phoneDigits.length !== 10) {
      showToaster('Please enter a valid 10-digit phone number.');
      return;
    }
    const phoneNumber = `+91${phoneDigits}`;
    setIsLoading(true);
    try {
      auth()
        .verifyPhoneNumber(phoneNumber)
        .on('state_changed', async phoneAuthSnapshot => {
          console.log('phoneAuthSnapshot', phoneAuthSnapshot);
          switch (phoneAuthSnapshot.state) {
            case 'sent':
              console.log('Code sent!');
              showToaster('OTP sent successfully');
              setOtp('');
              setIsLoading(false);
              setPhoneAuthSnapshotState(phoneAuthSnapshot);
              break;
            case 'verified':
              console.log('User automatically authenticated!');
              const credential = auth.PhoneAuthProvider.credential(
                phoneAuthSnapshot.verificationId,
                phoneAuthSnapshot.code || '',
              );
              const logindata = await auth().signInWithCredential(credential);
              const idToken = await logindata.user.getIdToken();
              handleFirebaseLogin(idToken);
              break;
            case 'error':
              console.log('Verification error', phoneAuthSnapshot.error);
              if (
                phoneAuthSnapshot?.error?.code === 'auth/invalid-phone-number'
              ) {
                showToaster('Please enter a valid phone number.');
                return;
              }
              if (phoneAuthSnapshot?.error?.code === 'auth/too-many-requests') {
                showToaster('Too many requests. Please try again later.');
                return;
              }
              showToaster(
                phoneAuthSnapshot?.error?.message ||
                  'Failed to send OTP. Please try again.',
              );
              setIsLoading(false);
              break;
          }
        });
    } catch (error: any) {
      console.log('Error sending OTP:', error);
      setIsLoading(false);
      showToaster(error?.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerify = async () => {
    console.log('Handling OTP verification...', {
      otp,
      phoneAuthSnapshotState,
    });
    if (otp.length < OTP_LENGTH) {
      showToaster('Please enter the valid OTP.');
      return;
    }
    if (!phoneAuthSnapshotState) {
      showToaster('No OTP request found. Please request a new OTP.');
      return;
    }
    try {
      setIsLoading(true);
      const credential = auth.PhoneAuthProvider.credential(
        phoneAuthSnapshotState.verificationId,
        otp,
      );
      const logindata = await auth().signInWithCredential(credential);
      const idToken = await logindata.user.getIdToken();
      handleFirebaseLogin(idToken);
    } catch (error: any) {
      console.log('Error verifying OTP:', error);
      setIsLoading(false);
      showToaster(error?.message || 'Incorrect OTP. Please try again.');
    }
  };

  const handleFirebaseLogin = async (idToken: string) => {
    console.log('Handling Firebase login...', { idToken, fcmToken });
    if (!idToken) {
      showToaster('Failed to retrieve ID token. Please try again.');
      setIsLoading(false);
      return;
    }
    dispatch(
      firebaseLogin({
        id_token: idToken,
        device_token: fcmToken || '',
      }),
    )
      .unwrap()
      .then(async ({ data }) => {
        if (data) {
          setApiToken(data.token);
          await setAuthTokenToAsyncStore(data.token);
          await setUserDetailsToAsyncStore(data.user);
          if (
            userCurrentCoords &&
            userCurrentCoords?.latitude &&
            userCurrentCoords?.longitude
          ) {
            dispatch(updateLocation(userCurrentCoords))
              .unwrap()
              .finally(() => {
                reset('Tabs');
              });
          } else {
            reset('Tabs');
          }
        } else {
          setIsLoading(false);
          showToaster('VerifyOTP failed. Please try again.');
        }
        // setIsLoading(false);
      })
      .catch(error => {
        console.log('Error in verifyOTP dispatch:', error);
        setIsLoading(false);
        showToaster(error?.message || 'VerifyOTP error. Please try again.');
      });
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

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
                        source={require('../assets/logo_w.png')}
                        style={{ width: 75, height: 75 }}
                      />
                    </LinearGradient>
                    <Text style={styles.brandLuxe}>Ahaari</Text>
                    <Text style={styles.brandEats}>
                      Your Ahaar, Always Ready.
                    </Text>
                  </View>

                  <Text style={styles.heading}>Let's Get Started</Text>
                  <Text style={styles.subheading}>
                    Enter your mobile number to continue
                  </Text>
                </View>

                <View
                  style={[
                    styles.inputShell,
                    { opacity: phoneAuthSnapshotState ? 0.7 : 1 },
                  ]}
                >
                  <TouchableOpacity
                    activeOpacity={0.86}
                    style={styles.countryCodeButton}
                  >
                    <Text style={styles.countryCodeText}>IN +91</Text>
                    <MaterialIcons
                      name="expand-more"
                      color="#AAABB0"
                      size={20}
                    />
                  </TouchableOpacity>

                  <TextInput
                    keyboardType="phone-pad"
                    placeholder="91234 56789"
                    placeholderTextColor="rgba(170, 171, 176, 0.62)"
                    style={[styles.phoneInput]}
                    value={phone}
                    onChangeText={text => {
                      setPhone(text);
                      if (text.replace(/\D/g, '').length === 10) {
                        Keyboard.dismiss();
                      }
                    }}
                    editable={!(phoneAuthSnapshotState || isLoading)}
                    maxLength={10}
                  />
                </View>
                {phoneAuthSnapshotState ? (
                  <>
                    <View>
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
                        <View />
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            setPhoneAuthSnapshotState(null);
                            setOtp('');
                          }}
                        >
                          <Text style={[styles.resendText]}>
                            <Text
                              style={styles.metaText}
                              onPress={() => {
                                setPhoneAuthSnapshotState(null);
                              }}
                            >
                              Wrong number?
                            </Text>
                            {'  '}
                            Change
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <TouchableOpacity
                      activeOpacity={isLoading ? 1 : 0.85}
                      style={[
                        styles.otpButton,
                        isLoading && styles.otpButtonDisabled,
                      ]}
                      onPress={handleVerify}
                      disabled={isLoading}
                    >
                      <LinearGradient
                        colors={
                          isLoading
                            ? ['#C47D1C', '#A86200']
                            : ['#FFAD3A', '#E79400']
                        }
                        start={{ x: 0.1, y: 0 }}
                        end={{ x: 0.95, y: 1 }}
                        style={styles.otpGradient}
                      >
                        {isLoading ? (
                          <ActivityIndicator size="large" color="#000000" />
                        ) : (
                          <Text style={styles.otpText}>Verify & Continue</Text>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    activeOpacity={isLoading ? 1 : 0.85}
                    style={[
                      styles.otpButton,
                      isLoading && styles.otpButtonDisabled,
                      { marginTop: 24 },
                    ]}
                    onPress={handleGetOtp}
                    disabled={isLoading}
                  >
                    <LinearGradient
                      colors={
                        isLoading
                          ? ['#C47D1C', '#A86200']
                          : ['#FFAD3A', '#E79400']
                      }
                      start={{ x: 0.1, y: 0 }}
                      end={{ x: 0.95, y: 1 }}
                      style={styles.otpGradient}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="large" color="#000000" />
                      ) : (
                        <Text style={styles.otpText}>Get OTP</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                )}

                <Text style={styles.footerText}>
                  By continuing, you agree to our{'\n'}
                  <Text style={styles.footerLink}>Terms of Service</Text>
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
    lineHeight: 36,
  },
  brandEats: {
    marginTop: 2,
    color: colors.primary,
    fontSize: typography.sm,
    fontWeight: '800',
  },
  heading: {
    color: '#F3F3F9',
    fontSize: typography.display,
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
  otpButtonDisabled: {
    shadowOpacity: 0.15,
    elevation: 3,
    opacity: 0.85,
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
  footerText: {
    marginTop: 15,
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
  //------------------------------
  otpRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
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
    marginBottom: 12,
    marginTop: 16,
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
});

export default LoginScreen;
