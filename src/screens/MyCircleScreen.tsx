import React, { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {
  CalendarDays,
  Menu,
  Plus,
  Trash2,
  UserRound,
} from 'lucide-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, layout, typography } from '../constants/theme';
import type { RootStackParamList } from '../types/navigation';

type PreferenceTone = 'primary' | 'error' | 'neutral';

type PreferenceTag = {
  label: string;
  tone: PreferenceTone;
};

type CircleMember = {
  id: string;
  name: string;
  birthday: string;
  image?: string;
  tags: PreferenceTag[];
};

const initialMembers: CircleMember[] = [
  {
    id: 'chloe',
    name: 'Chloe Jenkins',
    birthday: 'Birthday: May 20th',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAtsuitoRRvFrpSBz-FZVJkKgv25SUssM4Z7cjo-l1lr2YmJUMo9PuJMM17t-PajcHyghEO_lUbtKvAedgQG-2Sej1U4zfkqw-xwkvm2Lyg9WN2bZZ3wyzeaKvv4WkGXt1PbPp8itBwynddF-pbwaHpYhbdQMm3pWTykwu9RkX8j-FvaItP5Aln1Lvf9P_j4Wj_Ac7u9d7sg4EXjoaKy_PHNbFuqxjnvm4SRm1oVQ5_kmQPSIesFeEpQmtcc9exdnXcy76h9INKFN0',
    tags: [
      { label: 'Vegan', tone: 'primary' },
      { label: 'No Peanuts', tone: 'error' },
    ],
  },
  {
    id: 'marcus',
    name: 'Marcus Jenkins',
    birthday: 'Birthday: October 12th',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDxXF03W8uRyWG7PCwFJvac9zRx_UHwHaQfaq9YR3xrBZ87wGq-PXcEBe6JMHldI6CGEeunSMNFkUVoILFR08ikLkDMnhhDouHyFdHHBmgIULw8mQ7SJlfhqCyvoZvSiAQuJH5-xwCcOMjoENhNVS1SSNNC1tSBi3mYRqc5EoMK4-lHOL9cVMiGN1wvNvKCD4LTS9AsRieNdD8HpauwhYCibuEk0lcpIbH-VUmmAi8yIPpZvkpVubDlXPl1gh-sxjQQrjo84CiPnx0',
    tags: [{ label: 'Lactose Intolerant', tone: 'neutral' }],
  },
  {
    id: 'leo',
    name: 'Leo Jenkins',
    birthday: 'Birthday: Jan 5th',
    tags: [{ label: 'No Preferences', tone: 'neutral' }],
  },
];

const FrostedLayer = ({ radius, tint = 'rgba(23, 26, 30, 0.9)' }: { radius: number; tint?: string }) => (
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
        backgroundColor: tint,
        borderWidth: 1,
        borderColor: 'rgba(70, 72, 76, 0.34)',
      },
    ]}
  />
);

const MyCircleScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [circleMembers, setCircleMembers] = useState<CircleMember[]>(initialMembers);
  const [fullName, setFullName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(['Vegan']);
  const [showCustomPrefInput, setShowCustomPrefInput] = useState(false);
  const [customPreference, setCustomPreference] = useState('');

  const preferenceOptions = useMemo(
    () => ['Vegan', 'Gluten-Free', 'Nut Allergy', 'Lactose Intolerant', 'Halal'],
    [],
  );

  const resetAddForm = () => {
    setFullName('');
    setBirthday('');
    setSelectedPreferences(['Vegan']);
    setCustomPreference('');
    setShowCustomPrefInput(false);
  };

  const closeAddModal = () => {
    setAddModalVisible(false);
    resetAddForm();
  };

  const togglePreference = (option: string) => {
    setSelectedPreferences(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option],
    );
  };

  const addCustomPreference = () => {
    const normalized = customPreference.trim();
    if (!normalized) {
      return;
    }

    if (!selectedPreferences.includes(normalized)) {
      setSelectedPreferences(prev => [...prev, normalized]);
    }
    setCustomPreference('');
    setShowCustomPrefInput(false);
  };

  const mapPreferenceTone = (label: string): PreferenceTone => {
    if (label.toLowerCase() === 'vegan') {
      return 'primary';
    }

    if (label.toLowerCase().includes('allergy') || label.toLowerCase().includes('nut')) {
      return 'error';
    }

    return 'neutral';
  };

  const handleAddMember = () => {
    const name = fullName.trim();
    if (!name) {
      return;
    }

    const tags = selectedPreferences.length
      ? selectedPreferences.map(pref => ({
        label: pref,
        tone: mapPreferenceTone(pref),
      }))
      : [{ label: 'No Preferences', tone: 'neutral' as const }];

    const newMember: CircleMember = {
      id: `member-${Date.now()}`,
      name,
      birthday: birthday.trim() ? `Birthday: ${birthday.trim()}` : 'Birthday: Not Set',
      tags,
    };

    setCircleMembers(prev => [newMember, ...prev]);
    setAddModalVisible(false);
    resetAddForm();
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar barStyle="light-content" />

      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.86}
          style={styles.menuButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Menu size={22} color={colors.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Circle</Text>

        <TouchableOpacity activeOpacity={0.9} style={styles.headerAvatar} accessibilityRole="button">
          <UserRound size={16} color="#AAABB0" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>Family & Friends</Text>
          <Text style={styles.introSubtitle}>
            Manage the dietary preferences and restrictions of your circle to ensure everyone enjoys
            safe and delicious meals together.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.addMemberButton}
          accessibilityRole="button"
          onPress={() => setAddModalVisible(true)}
        >
          <FrostedLayer radius={14} tint="rgba(24, 27, 33, 0.88)" />

          <LinearGradient
            colors={['#FFAD3A', '#F59E0A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.addMemberIconWrap}
          >
            <Plus size={20} color="#2A1700" strokeWidth={2.6} />
          </LinearGradient>

          <Text style={styles.addMemberText}>Add New Member</Text>
        </TouchableOpacity>

        <View style={styles.listSection}>
          {circleMembers.map(member => (
            <TouchableOpacity key={member.id} style={styles.memberCard} activeOpacity={0.92}>
              <FrostedLayer radius={18} tint="rgba(24, 27, 33, 0.9)" />

              <View style={styles.avatarWrap}>
                {member.image ? (
                  <Image source={{ uri: member.image }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarFallback}>
                    <UserRound size={24} color="#AAABB0" />
                  </View>
                )}
              </View>

              <View style={styles.memberBody}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberBirthday}>{member.birthday}</Text>

                <View style={styles.tagRow}>
                  {member.tags.map(tag => {
                    const toneStyle =
                      tag.tone === 'primary'
                        ? styles.tagPrimary
                        : tag.tone === 'error'
                          ? styles.tagError
                          : styles.tagNeutral;

                    const textToneStyle =
                      tag.tone === 'primary'
                        ? styles.tagPrimaryText
                        : tag.tone === 'error'
                          ? styles.tagErrorText
                          : styles.tagNeutralText;

                    return (
                      <View key={tag.label} style={[styles.tagBadge, toneStyle]}>
                        <Text style={[styles.tagText, textToneStyle]}>{tag.label}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              <TouchableOpacity activeOpacity={0.85} style={styles.deleteButton} accessibilityRole="button">
                <Trash2 size={18} color="#AAABB0" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {isAddModalVisible ? (
        <View style={styles.modalRoot} pointerEvents="box-none">
          <Pressable style={styles.modalBackdrop} onPress={closeAddModal} />

          <View style={[styles.modalWrap, { paddingBottom: 24 + insets.bottom }]}>
            <View style={styles.modalCard}>
              <View pointerEvents="none" style={styles.modalGlow} />

              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Add New Member</Text>
                  <Text style={styles.modalSubtitle}>Expand your inner circle.</Text>
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.fieldLabel}>Full Name</Text>
                  <View style={styles.inputWrap}>
                    <UserRound size={18} color="#8E9299" />
                    <TextInput
                      value={fullName}
                      onChangeText={setFullName}
                      placeholder="e.g., Jane Doe"
                      placeholderTextColor="rgba(170,171,176,0.5)"
                      style={styles.textInput}
                    />
                  </View>
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.fieldLabel}>Birthday</Text>
                  <View style={styles.inputWrap}>
                    <CalendarDays size={18} color="#8E9299" />
                    <TextInput
                      value={birthday}
                      onChangeText={setBirthday}
                      placeholder="MM/DD/YYYY"
                      placeholderTextColor="rgba(170,171,176,0.5)"
                      style={styles.textInput}
                    />
                  </View>
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.fieldLabel}>Dietary Preferences</Text>
                  <View style={styles.chipRow}>
                    {preferenceOptions.map(option => {
                      const isSelected = selectedPreferences.includes(option);
                      return (
                        <TouchableOpacity
                          key={option}
                          activeOpacity={0.88}
                          onPress={() => togglePreference(option)}
                          style={[styles.prefChip, isSelected ? styles.prefChipActive : styles.prefChipInactive]}
                        >
                          <Text style={isSelected ? styles.prefChipTextActive : styles.prefChipTextInactive}>
                            {option}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}

                    <TouchableOpacity
                      activeOpacity={0.88}
                      onPress={() => setShowCustomPrefInput(true)}
                      style={styles.prefChipInactive}
                    >
                      <Text style={styles.prefChipTextInactive}>+ Add Custom</Text>
                    </TouchableOpacity>
                  </View>

                  {showCustomPrefInput ? (
                    <View style={styles.customPrefRow}>
                      <TextInput
                        value={customPreference}
                        onChangeText={setCustomPreference}
                        placeholder="Custom preference"
                        placeholderTextColor="rgba(170,171,176,0.5)"
                        style={styles.customPrefInput}
                      />
                      <TouchableOpacity activeOpacity={0.88} onPress={addCustomPreference} style={styles.customAddBtn}>
                        <Text style={styles.customAddBtnText}>Add</Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity activeOpacity={0.88} onPress={closeAddModal} style={styles.cancelBtn}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={0.9} onPress={handleAddMember} style={styles.addBtn}>
                    <LinearGradient
                      colors={['#FFAD3A', '#F59E0A']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.addBtnGradient}
                    >
                      <Text style={styles.addBtnText}>Add Member</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  headerBar: {
    minHeight: 58,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: layout.screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: typography.title,
    lineHeight: 26,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: 'rgba(70, 72, 76, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 28,
    gap: 24,
  },
  introSection: {
    gap: 8,
  },
  introTitle: {
    color: colors.textPrimary,
    fontSize: typography.displayXl,
    lineHeight: 38,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  introSubtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21,
    fontWeight: '500',
  },
  addMemberButton: {
    height: 64,
    borderRadius: 14,
    overflow: 'hidden',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  addMemberIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
  },
  addMemberText: {
    color: colors.textPrimary,
    fontSize: typography.mdPlus,
    lineHeight: 22,
    fontWeight: '700',
  },
  listSection: {
    gap: 16,
  },
  memberCard: {
    minHeight: 126,
    borderRadius: 18,
    overflow: 'hidden',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(70, 72, 76, 0.5)',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  memberBody: {
    flex: 1,
  },
  memberName: {
    color: colors.textPrimary,
    fontSize: typography.title,
    lineHeight: 26,
    fontWeight: '700',
  },
  memberBirthday: {
    marginTop: 2,
    color: colors.textMuted,
    fontSize: typography.sm,
    lineHeight: 16,
    fontWeight: '500',
  },
  tagRow: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 7,
    borderWidth: 1,
  },
  tagPrimary: {
    backgroundColor: 'rgba(245, 158, 10, 0.1)',
    borderColor: 'rgba(245, 158, 10, 0.22)',
  },
  tagError: {
    backgroundColor: 'rgba(255, 115, 81, 0.1)',
    borderColor: 'rgba(255, 115, 81, 0.24)',
  },
  tagNeutral: {
    backgroundColor: 'rgba(35, 38, 44, 0.72)',
    borderColor: 'rgba(70, 72, 76, 0.38)',
  },
  tagText: {
    fontSize: typography.caption,
    lineHeight: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  tagPrimaryText: {
    color: colors.primary,
  },
  tagErrorText: {
    color: colors.accentCoral,
  },
  tagNeutralText: {
    color: colors.textMuted,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalRoot: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(12, 14, 18, 0.74)',
  },
  modalWrap: {
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  modalCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(70, 72, 76, 0.26)',
    backgroundColor: 'rgba(23, 26, 30, 0.97)',
  },
  modalGlow: {
    position: 'absolute',
    top: -96,
    right: -72,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(245, 158, 10, 0.12)',
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 18,
  },
  modalHeader: {
    marginBottom: 18,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: typography.display,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  modalSubtitle: {
    marginTop: 6,
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 20,
    fontWeight: '500',
  },
  formSection: {
    marginBottom: 16,
    gap: 8,
  },
  fieldLabel: {
    color: colors.textPrimary,
    fontSize: typography.body,
    lineHeight: 18,
    fontWeight: '600',
  },
  inputWrap: {
    minHeight: 50,
    borderRadius: 10,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: 'rgba(70,72,76,0.22)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
  },
  textInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.body,
    lineHeight: 19,
    fontWeight: '500',
    paddingVertical: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  prefChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  prefChipActive: {
    backgroundColor: 'rgba(245, 158, 10, 0.18)',
    borderColor: 'rgba(245, 158, 10, 0.34)',
  },
  prefChipInactive: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.surfaceMuted,
    borderColor: 'rgba(70,72,76,0.3)',
  },
  prefChipTextActive: {
    color: colors.primary,
    fontSize: typography.sm,
    lineHeight: 14,
    fontWeight: '600',
  },
  prefChipTextInactive: {
    color: colors.textMuted,
    fontSize: typography.sm,
    lineHeight: 14,
    fontWeight: '600',
  },
  customPrefRow: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  customPrefInput: {
    flex: 1,
    minHeight: 42,
    borderRadius: 10,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: 'rgba(70,72,76,0.22)',
    color: colors.textPrimary,
    fontSize: typography.smPlus,
    lineHeight: 17,
    paddingHorizontal: 12,
  },
  customAddBtn: {
    minHeight: 42,
    borderRadius: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 10, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 10, 0.34)',
  },
  customAddBtnText: {
    color: colors.primary,
    fontSize: typography.sm,
    lineHeight: 14,
    fontWeight: '700',
  },
  modalActions: {
    marginTop: 4,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(70,72,76,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    minHeight: 42,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 18,
    fontWeight: '600',
  },
  addBtn: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  addBtnGradient: {
    minHeight: 44,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: colors.onPrimaryDark,
    fontSize: typography.body,
    lineHeight: 18,
    fontWeight: '700',
  },
});

export default MyCircleScreen;
