import React, { useEffect } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star } from 'lucide-react-native';

import { colors, layout, typography } from '../constants/theme';
import Header from '../components/Header';
import { getUserDetailsFromAsyncStore } from '../utils/storage';
const PersonalInfoScreen = () => {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [birthday, setBirthday] = React.useState('');

  const loadUserDetails = async () => {
    const userDetails: any = await getUserDetailsFromAsyncStore();
    setFirstName(userDetails?.first_name || '');
    setLastName(userDetails?.last_name || '');
    setPhone(userDetails?.phone || '');
    setBirthday(userDetails?.dob || '');
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
                source={{
                  uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=512&q=80',
                }}
                style={styles.avatar}
              />
            </View>

            <View style={styles.heroText}>
              <Text style={styles.heroName}>{firstName} {lastName}</Text>
              <Text style={styles.heroMeta}>Member since 2022</Text>

              <View style={styles.heroActions}>
                <View style={styles.heroChip}>
                  <Star
                    size={12}
                    color={colors.primary}
                    fill={colors.primary}
                  />
                  <Text style={styles.heroChipText}>Standard Member</Text>
                </View>

                <TouchableOpacity
                  style={styles.editButton}
                  activeOpacity={0.85}
                >
                  <Text style={styles.editButtonText}>Edit photo</Text>
                </TouchableOpacity>
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
                />
              </View>
            </View>
            <View style={styles.rowFields}>
              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>BIRTHDAY</Text>
                <View style={styles.inputShell}>
                  <TextInput
                    value={birthday}
                    onChangeText={setBirthday}
                    placeholder="DD MMM YYYY"
                    placeholderTextColor={colors.textMuted}
                    style={styles.inputText}
                  />
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
          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.95}>
            <LinearGradient
              colors={[colors.primary, '#FFC94D']}
              start={{ x: 0.45, y: 1 }}
              end={{ x: 0.55, y: 0 }}
              style={styles.primaryButtonGradient}
            >
              <Text style={styles.primaryButtonText}>Save Changes</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.9}>
            <Text style={styles.secondaryButtonText}>Discard Updates</Text>
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
