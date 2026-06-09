import React, { useEffect, useState } from 'react';
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CalendarDays, Star } from 'lucide-react-native';
import moment from 'moment';
import { useDispatch } from 'react-redux';

import { colors, layout, typography } from '../constants/theme';
import Header from '../components/Header';
import { getUserDetailsFromAsyncStore } from '../utils/storage';
import { Constant } from '../constants/Constant';
import { ImagePath } from '../constants/ImagePath';
import { updateProfile } from '../redux/user/userAction';
const PersonalInfoScreen = () => {
  const dispatch = useDispatch<any>();
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [birthday, setBirthday] = React.useState('');
  const [birthdayDate, setBirthdayDate] = React.useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const loadUserDetails = async () => {
    const userDetails: any = await getUserDetailsFromAsyncStore();
    setFirstName(userDetails?.first_name || '');
    setLastName(userDetails?.last_name || '');
    setPhone(userDetails?.phone || '');
    const dob = userDetails?.dob || '';
    setBirthday(dob);
    if (dob) {
      const parsed = moment(dob, ['DD MMM YYYY', 'YYYY-MM-DD', moment.ISO_8601], true);
      if (parsed.isValid()) {
        setBirthdayDate(parsed.toDate());
      }
    }
  };

  const openDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: birthdayDate ?? new Date(2000, 0, 1),
        mode: 'date',
        maximumDate: new Date(),
        onChange: (_event: DateTimePickerEvent, selectedDate?: Date) => {
          if (selectedDate) {
            setBirthdayDate(selectedDate);
            setBirthday(moment(selectedDate).format('DD MMM YYYY'));
          }
        },
      });
    }
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      await dispatch(
        updateProfile({
          first_name: firstName,
          last_name: lastName,
          dob: birthday,
        }),
      ).unwrap();
    } catch (_error) {
      // error toast is shown inside the thunk
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserDetails();
  }, []);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <Header
        title="Personal Info"
        showBackButton={true}
        containerStyle={{ paddingHorizontal: layout.screenPadding }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View style={styles.avatarWrap}>
              <Image
                source={require('../assets/profile.png')}
                style={styles.avatar}
              />
            </View>

            <View style={styles.heroText}>
              <Text style={styles.heroName}>{firstName || 'No'} {lastName || 'Name'}</Text>
              <Text style={styles.heroMeta}>Member since 2026</Text>

              <View style={styles.heroActions}>
                <View style={styles.heroChip}>
                  <Star
                    size={12}
                    color={colors.primary}
                    fill={colors.primary}
                  />
                  <Text style={styles.heroChipText}>Standard Member</Text>
                </View>

                {/* <TouchableOpacity
                  style={styles.editButton}
                  activeOpacity={0.85}
                >
                  <Text style={styles.editButtonText}>Edit photo</Text>
                </TouchableOpacity> */}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Details</Text>
          <View style={styles.formCard}>
            <View style={styles.rowFields}>
              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>FIRST NAME</Text>
                <View style={styles.inputShell}>
                  <TextInput
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="Your first name"
                    placeholderTextColor={colors.textMuted}
                    style={styles.inputText}
                  />
                </View>
              </View>

              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>LAST NAME</Text>
                <View style={styles.inputShell}>
                  <TextInput
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Your last name"
                    placeholderTextColor={colors.textMuted}
                    style={styles.inputText}
                  />
                </View>
              </View>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>PHONE NUMBER</Text>
              <View style={styles.inputShell}>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Phone"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="phone-pad"
                  style={styles.inputText}
                  editable={false}
                />
              </View>
            </View>
            <View style={styles.rowFields}>
              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>BIRTHDAY</Text>
                <View style={styles.inputShell}>
                  <TouchableOpacity
                    style={styles.datePickerRow}
                    onPress={openDatePicker}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.inputText,
                        !birthday && styles.inputPlaceholder,
                      ]}
                    >
                      {birthday || 'DD MM YY'}
                    </Text>
                    <CalendarDays
                      size={16}
                      color={colors.textMuted}
                      strokeWidth={2}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>MEMBER STATUS</Text>
                <View style={[styles.inputShell, styles.inputMuted]}>
                  <Text style={styles.inputStaticText}>Standard</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionArea}>
          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.95} onPress={handleUpdateProfile}>
            <LinearGradient
              colors={[colors.primary, colors.primary]}
              start={{ x: 0.45, y: 1 }}
              end={{ x: 0.55, y: 0 }}
              style={styles.primaryButtonGradient}
            >
              {isLoading ? (
                <ActivityIndicator size="large" color="#000000" />
              ) : (
                <Text style={styles.primaryButtonText}>Save Changes</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.9}>
            <Text style={styles.secondaryButtonText}>Discard Updates</Text>
          </TouchableOpacity> */}
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
    paddingTop: 12,
    paddingBottom: 160,
    gap: 24,
  },
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 16,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    top: -30,
    left: -20,
    right: -20,
    height: 120,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarWrap: {
    width: 86,
    height: 86,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  heroText: {
    flex: 1,
    gap: 4,
  },
  heroName: {
    color: colors.textPrimary,
    fontSize: typography.xxl,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  heroMeta: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 20,
    fontWeight: '500',
  },
  heroActions: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  heroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  heroChipText: {
    color: colors.primary,
    fontSize: typography.captionPlus,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  editButton: {
    height: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  editButtonText: {
    color: colors.textPrimary,
    fontSize: typography.captionPlus,
    fontWeight: '600',
  },
  section: {
    gap: 12,
  },
  hiddenSection: {
    display: 'none',
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.titlePlus,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  formCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 16,
    gap: 14,
    overflow: 'hidden',
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
    flex: 1,
  },
  inputPlaceholder: {
    color: colors.textMuted,
    fontWeight: '400',
  },
  datePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputMultiline: {
    minHeight: 48,
    textAlignVertical: 'top',
  },
  inputMuted: {
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  inputStaticText: {
    color: colors.textMutedLight,
    fontSize: typography.bodyPlus,
    fontWeight: '600',
  },
  rowFields: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
    gap: 8,
  },
  actionArea: {
    marginTop: 10,
    gap: 12,
  },
  primaryButton: {
    height: 54,
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
    letterSpacing: -0.2,
  },
  secondaryButton: {
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: colors.textMutedPale,
    fontSize: typography.bodyPlus,
    fontWeight: '600',
  },
});

export default PersonalInfoScreen;
