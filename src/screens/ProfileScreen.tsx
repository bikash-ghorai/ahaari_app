import React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ChevronRight,
  ExternalLink,
  Gift,
  HelpCircle,
  MapPin,
  Star,
  User,
  UserPlus,
  Wallet,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, typography } from '../constants/theme';
import type { RootStackParamList } from '../types/navigation';
import { logout } from '../redux/user/userAction';
import { useDispatch } from '../redux/store';

const circleMembers = [
  'https://api.dicebear.com/9.x/adventurer/png?seed=ava',
  'https://api.dicebear.com/9.x/adventurer/png?seed=liam',
  'https://api.dicebear.com/9.x/adventurer/png?seed=nora',
  'https://api.dicebear.com/9.x/adventurer/png?seed=zoe',
];

const memberAvatarOffsetStyles = [
  { marginLeft: 0, zIndex: 4 },
  { marginLeft: -12, zIndex: 3 },
  { marginLeft: -12, zIndex: 2 },
  { marginLeft: -12, zIndex: 1 },
];

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const hasActivePlan = false;
  const memberBadgeText = hasActivePlan
    ? 'Premium\nMember'
    : 'Standard\nMember';
  const vipStatusText = hasActivePlan ? 'Active' : 'Inactive';
  const planButtonText = hasActivePlan ? 'Manage Plan' : 'Choose Plan';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <View style={styles.profileImageShell}>
            <View style={styles.profileImageGlow}>
              <View style={styles.profileImageBorder}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=512&q=80',
                  }}
                  style={styles.profileImage}
                />
              </View>
            </View>
            <View style={styles.memberBadge}>
              <LinearGradient
                pointerEvents="none"
                colors={['#FFB000', '#FFB000']}
                start={{ x: 0.1, y: 0.2 }}
                end={{ x: 0.9, y: 0.8 }}
                style={styles.memberBadgeGradient}
              />
              <View style={styles.memberBadgeInner}>
                <Star
                  size={13}
                  color={colors.onPrimaryDeep}
                  fill={colors.onPrimaryDeep}
                />
                <Text style={styles.memberBadgeText}>{memberBadgeText}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.profileName}>Sarah Jenkins</Text>
          <Text style={styles.profileEmail}>sarah.j@lifestyle.com</Text>
        </View>

        <View style={styles.walletVipSection}>
          <View style={styles.walletVipCard}>
            <View style={styles.walletVipRow}>
              <View style={styles.walletVipLeftBlock}>
                <View style={styles.walletVipIconWrap}>
                  <Wallet size={18} color={colors.primary} strokeWidth={2.2} />
                </View>

                <View>
                  <Text style={styles.walletVipLabel}>WALLET BALANCE</Text>
                  <Text style={styles.walletVipAmount}>$425.50</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.topUpButton}
                onPress={() => navigation.navigate('WalletHistory')}
              >
                <Text style={styles.topUpButtonText}>Top Up</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.walletVipDivider} />

            <View style={styles.walletVipRow}>
              <View style={styles.walletVipLeftBlock}>
                <View style={styles.walletVipIconWrap}>
                  <Star
                    size={16}
                    color={hasActivePlan ? colors.primary : colors.textMuted}
                    fill={hasActivePlan ? colors.primary : 'transparent'}
                  />
                </View>

                <View>
                  <Text style={styles.walletVipLabel}>LUMINA VIP STATUS</Text>

                  <View style={styles.vipStatusRow}>
                    <Text
                      style={[
                        styles.vipStatusText,
                        !hasActivePlan ? styles.vipStatusTextInactive : null,
                      ]}
                    >
                      {vipStatusText}
                    </Text>
                    <View
                      style={[
                        styles.vipDot,
                        !hasActivePlan ? styles.vipDotInactive : null,
                      ]}
                    />
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.managePlanButton}
                onPress={() => navigation.navigate('Plan')}
              >
                <Text
                  style={[
                    styles.managePlanText,
                    !hasActivePlan ? styles.managePlanTextInactive : null,
                  ]}
                >
                  {planButtonText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>My Circle</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MyCircle')}>
            <Text style={styles.sectionLinkText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.circleCard}>
          <View style={styles.memberStack}>
            {circleMembers.map((avatar, index) => (
              <View
                key={avatar}
                style={[
                  styles.memberAvatarWrap,
                  memberAvatarOffsetStyles[index],
                ]}
              >
                <Image source={{ uri: avatar }} style={styles.memberAvatar} />
              </View>
            ))}

            <View style={styles.memberCountBubble}>
              <Text style={styles.memberCountText}>+12</Text>
            </View>
          </View>

          <View style={styles.circleDivider} />

          <TouchableOpacity
            style={styles.inviteButton}
            onPress={() => navigation.navigate('MyCircle')}
          >
            <UserPlus size={17} color={colors.textMuted} />
            <Text style={styles.inviteButtonText}>Invite Friends</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionGroup}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <View style={styles.listCard}>
            <TouchableOpacity
              style={styles.listRow}
              onPress={() => navigation.navigate('PersonalInfo')}
            >
              <View style={styles.listRowLeft}>
                <User size={21} color={colors.textMuted} />
                <Text style={styles.listRowLabel}>Personal Info</Text>
              </View>
              <ChevronRight size={20} color="#6C7078" />
            </TouchableOpacity>

            <View style={styles.listDivider} />

            <TouchableOpacity
              style={styles.listRow}
              onPress={() => navigation.navigate('AddressList')}
            >
              <View style={styles.listRowLeft}>
                <MapPin size={21} color={colors.textMuted} />
                <Text style={styles.listRowLabel}>Addresses</Text>
              </View>
              <ChevronRight size={20} color="#6C7078" />
            </TouchableOpacity>

            <View style={styles.listDivider} />

            <TouchableOpacity
              style={styles.listRow}
              onPress={() => navigation.navigate('WalletHistory')}
            >
              <View style={styles.listRowLeft}>
                <Wallet size={21} color={colors.textMuted} />
                <Text style={styles.listRowLabel}>Wallet</Text>
              </View>
              <ChevronRight size={20} color="#6C7078" />
            </TouchableOpacity>

            <View style={styles.listDivider} />

            <TouchableOpacity
              style={styles.listRow}
              onPress={() => navigation.navigate('ReferEarn')}
            >
              <View style={styles.listRowLeft}>
                <Gift size={21} color={colors.textMuted} />
                <Text style={styles.listRowLabel}>Refer & Earn</Text>
              </View>

              <View style={styles.listRowRightInline}>
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>NEW</Text>
                </View>
                <ChevronRight size={20} color="#6C7078" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.listRow}
              onPress={() => navigation.navigate('HelpCenter')}
            >
              <View style={styles.listRowLeft}>
                <HelpCircle size={21} color={colors.textMuted} />
                <Text style={styles.listRowLabel}>Help & Support</Text>
              </View>
              <ChevronRight size={20} color="#6C7078" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionGroup}>
          <Text style={styles.sectionTitle}>Legal</Text>

          <View style={styles.listCard}>
            <TouchableOpacity style={styles.listRow}>
              <Text style={styles.listRowLabelMuted}>Terms & Condition</Text>
              <ExternalLink size={20} color="#6C7078" />
            </TouchableOpacity>

            <View style={styles.listDivider} />

            <TouchableOpacity style={styles.listRow}>
              <Text style={styles.listRowLabelMuted}>Privacy Policy</Text>
              <ExternalLink size={20} color="#6C7078" />
            </TouchableOpacity>

            <View style={styles.listDivider} />

            <TouchableOpacity
              style={styles.listRow}
              onPress={() => navigation.navigate('About')}
            >
              <Text style={styles.listRowLabelMuted}>About</Text>
              <ChevronRight size={20} color="#6C7078" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.signOutButton}
          onPress={() => dispatch(logout({ type: 'manual' }))}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 34,
    paddingBottom: 170,
  },
  headerSection: {
    marginTop: 8,
    alignItems: 'center',
  },
  profileImageShell: {
    width: 134,
    height: 162,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  profileImageGlow: {
    width: 112,
    height: 112,
    borderRadius: 66,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 0px 50px ${colors.primary}`,
  },
  profileImageBorder: {
    width: 100,
    height: 100,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  memberBadge: {
    position: 'absolute',
    bottom: 35,
    width: 128,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 176, 0, 0.4)',
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  memberBadgeGradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  memberBadgeInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  memberBadgeInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  memberBadgeText: {
    color: colors.onPrimaryDeep,
    fontSize: typography.smPlus,
    lineHeight: 15,
    fontWeight: '700',
    width: 74,
    textAlign: 'center',
  },
  memberBadgeTextInactive: {
    color: colors.textPrimary,
  },
  profileName: {
    color: colors.textPrimary,
    fontSize: typography.display4xl,
    lineHeight: 56,
    fontWeight: '700',
    marginTop: 13,
    letterSpacing: -0.9,
  },
  profileEmail: {
    color: colors.textMutedDim,
    fontSize: typography.md,
    lineHeight: 22,
    fontWeight: '500',
    marginTop: 2,
  },
  walletVipSection: {
    marginTop: 26,
  },
  walletVipCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  walletVipRow: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  walletVipLeftBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  walletVipIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 176, 0, 0.2)',
    backgroundColor: 'rgba(255, 176, 0, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletVipLabel: {
    color: colors.textMutedAlt,
    fontSize: typography.caption,
    lineHeight: 14,
    letterSpacing: 1,
    fontWeight: '700',
  },
  walletVipAmount: {
    color: colors.textPrimary,
    fontSize: typography.mdPlus,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginTop: 1,
  },
  topUpButton: {
    minWidth: 82,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: 'rgba(255, 176, 0, 0.24)',
    backgroundColor: 'rgba(255, 176, 0, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  topUpButtonText: {
    color: colors.primary,
    fontSize: typography.smPlus,
    lineHeight: 17,
    fontWeight: '700',
  },
  walletVipDivider: {
    marginVertical: 8,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  vipStatusRow: {
    marginTop: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  vipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.successGreen,
  },
  vipDotInactive: {
    backgroundColor: colors.textMutedDark,
  },
  vipStatusText: {
    color: colors.textPrimary,
    fontSize: typography.md,
    lineHeight: 21,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  vipStatusTextInactive: {
    color: colors.textMuted,
  },
  managePlanButton: {
    minWidth: 88,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  managePlanText: {
    color: colors.primary,
    fontSize: typography.smPlus,
    lineHeight: 17,
    fontWeight: '700',
  },
  managePlanTextInactive: {
    color: colors.primary,
  },
  sectionHeaderRow: {
    marginTop: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.titlePlus,
    lineHeight: 30,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  sectionLinkText: {
    color: colors.primary,
    fontSize: typography.bodyPlus,
    fontWeight: '700',
  },
  circleCard: {
    marginTop: 16,
    height: 82,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberStack: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 176,
  },
  memberAvatarWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: colors.borderDark,
    overflow: 'hidden',
    backgroundColor: colors.surfaceNeutral,
  },
  memberAvatar: {
    width: '100%',
    height: '100%',
  },
  memberCountBubble: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.surfaceCardDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -12,
    zIndex: 1,
  },
  memberCountText: {
    color: colors.primary,
    fontSize: typography.md,
    fontWeight: '700',
  },
  circleDivider: {
    width: 1,
    height: 34,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 10,
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inviteButtonText: {
    color: colors.textMutedPale,
    fontSize: typography.bodyPlus,
    fontWeight: '500',
  },
  sectionGroup: {
    marginTop: 38,
    gap: 16,
  },
  listCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    overflow: 'hidden',
  },
  listRow: {
    minHeight: 66,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  listRowRightInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  listRowLabel: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    lineHeight: 27,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  listRowLabelMuted: {
    color: colors.textMutedMid,
    fontSize: typography.lg,
    lineHeight: 27,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  listDivider: {
    marginHorizontal: 16,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  newBadge: {
    minWidth: 48,
    height: 24,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 173, 58, 0.18)',
  },
  newBadgeText: {
    color: colors.primary,
    fontSize: typography.sm,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  signOutButton: {
    marginTop: 36,
    height: 64,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutText: {
    color: colors.accentCoral,
    fontSize: typography.xl,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
});

export default ProfileScreen;
