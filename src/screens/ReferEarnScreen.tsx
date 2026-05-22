import React, { useMemo, useState } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Bell,
  Gift,
  Search,
  Send,
} from 'lucide-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, layout, typography } from '../constants/theme';
import type { RootStackParamList } from '../types/navigation';
import Header from '../components/Header';

type ContactStatus = 'not_invited' | 'invited_by_you' | 'already_on_app';

type Contact = {
  id: string;
  name: string;
  subtitle: string;
  status: ContactStatus;
  avatar?: string;
  initials?: string;
};

const totalContactCount = 128;

const initialContacts: Contact[] = [
  {
    id: 'alex-thompson',
    name: 'Alex Thompson',
    subtitle: '+1 (555) 012-3456',
    status: 'not_invited',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
  },
  {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins',
    subtitle: 'Invited 2 days ago',
    status: 'invited_by_you',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b332c1fc?auto=format&fit=crop&w=160&q=80',
  },
  {
    id: 'mike-rivera',
    name: 'Mike Rivera',
    subtitle: 'Already on Radiant Eats',
    status: 'already_on_app',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
  },
  {
    id: 'jordan-day',
    name: 'Jordan Day',
    subtitle: '+1 (555) 987-6543',
    status: 'not_invited',
    initials: 'JD',
  },
  {
    id: 'emma-wells',
    name: 'Emma Wells',
    subtitle: '+1 (555) 105-9041',
    status: 'not_invited',
    initials: 'EW',
  },
  {
    id: 'daniel-cole',
    name: 'Daniel Cole',
    subtitle: '+1 (555) 442-1985',
    status: 'invited_by_you',
    avatar:
      'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=160&q=80',
  },
];

const GlassLayer = ({ radius, tint = 'rgba(255, 255, 255, 0.03)' }: { radius: number; tint?: string }) => (
  <>
    {Platform.OS === 'ios' ? (
      <BlurView
        pointerEvents="none"
        style={[{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          borderRadius: radius
        }]}
        blurType="dark"
        blurAmount={28}
        reducedTransparencyFallbackColor="rgba(18, 20, 24, 0.28)"
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
          backgroundColor: tint,
        },
      ]}
    />
  </>
);

const ReferEarnScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'ReferEarn'>>();
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState('');
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return contacts;
    }

    return contacts.filter(contact => {
      return (
        contact.name.toLowerCase().includes(query)
        || contact.subtitle.toLowerCase().includes(query)
      );
    });
  }, [contacts, search]);

  const inviteCount = contacts.filter(contact => contact.status === 'invited_by_you').length;
  const earnedAmount = inviteCount * 10;

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('Tabs', { screen: 'Profile' });
  };

  const inviteContact = (contactId: string) => {
    setContacts(prevContacts => {
      return prevContacts.map(contact => {
        if (contact.id !== contactId) {
          return contact;
        }

        if (contact.status !== 'not_invited') {
          return contact;
        }

        return {
          ...contact,
          status: 'invited_by_you',
          subtitle: 'Invited just now',
        };
      });
    });
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>

      <Header title="Refer & Earn" showBackButton={true} containerStyle={{ paddingHorizontal: layout.screenPadding }} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 36 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.heroSection}>
          <View style={styles.heroIconShell}>
            <View style={styles.heroIconGlow} />
            <View style={styles.heroIconCard}>
              <GlassLayer radius={24} />
              <Gift size={50} color={colors.primary} strokeWidth={2.2} />
            </View>
          </View>

          <Text style={styles.heroTitle}>Share the Joy!</Text>
          <Text style={styles.heroSubtitle}>
            Invite friends and you both get <Text style={styles.heroHighlight}>$10</Text>.
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statsCard}>
            <GlassLayer radius={16} tint="rgba(255, 255, 255, 0.03)" />
            <Text style={styles.statsCaption}>Invited</Text>
            <Text style={styles.statsValue}>{inviteCount}</Text>
          </View>

          <View style={styles.statsCard}>
            <GlassLayer radius={16} tint="rgba(255, 255, 255, 0.03)" />
            <Text style={styles.statsCaption}>Earned</Text>
            <Text style={styles.statsValuePrimary}>${earnedAmount}</Text>
          </View>
        </View>

        <View style={styles.searchCard}>
          <GlassLayer radius={16} tint="rgba(35, 38, 44, 0.35)" />
          <Search size={18} color={colors.textMutedMid} strokeWidth={2.1} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search contacts to invite..."
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.contactsSection}>
          <View style={styles.contactsHeader}>
            <Text style={styles.contactsTitle}>Your Contacts</Text>
            <View style={styles.totalBadge}>
              <Text style={styles.totalBadgeText}>{totalContactCount} Total</Text>
            </View>
          </View>

          <View style={styles.contactList}>
            {filteredContacts.map(contact => {
              const muted = contact.status === 'already_on_app';

              return (
                <View
                  key={contact.id}
                  style={[
                    styles.contactCard,
                    muted ? styles.contactCardMuted : null,
                  ]}
                >
                  <GlassLayer radius={16} tint="rgba(255, 255, 255, 0.03)" />

                  <View style={styles.contactRow}>
                    <View style={styles.contactLeft}>
                      <View style={styles.avatarWrap}>
                        {contact.avatar ? (
                          <Image source={{ uri: contact.avatar }} style={styles.avatarImage} />
                        ) : (
                          <Text style={styles.avatarInitials}>{contact.initials ?? 'RE'}</Text>
                        )}
                      </View>

                      <View>
                        <Text style={styles.contactName}>{contact.name}</Text>
                        <Text style={styles.contactSubtitle}>{contact.subtitle}</Text>
                      </View>
                    </View>

                    {contact.status === 'not_invited' ? (
                      <TouchableOpacity
                        style={styles.inviteButton}
                        activeOpacity={0.9}
                        onPress={() => inviteContact(contact.id)}
                      >
                        <Send size={13} color={colors.onPrimaryDeepAlt} strokeWidth={2.2} />
                        <Text style={styles.inviteButtonText}>Invite</Text>
                      </TouchableOpacity>
                    ) : null}

                    {contact.status === 'invited_by_you' ? (
                      <View style={styles.invitedPill}>
                        <Text style={styles.invitedPillText}>Invited</Text>
                      </View>
                    ) : null}

                    {contact.status === 'already_on_app' ? (
                      <Text style={styles.alreadyText}>Already Invited</Text>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
        </View>


      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ambientLayer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  heroGlow: {
    position: 'absolute',
    width: 340,
    height: 340,
    top: 44,
    left: '50%',
    marginLeft: -170,
    borderRadius: 340,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  headerBar: {
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.07)',
  },
  headerContent: {
    height: 64,
    paddingHorizontal: layout.screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  headerIconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 22,
    paddingHorizontal: layout.screenPadding,
    gap: 16,
  },
  heroSection: {
    alignItems: 'center',
    gap: 9,
  },
  heroIconShell: {
    width: 130,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIconGlow: {
    position: 'absolute',
    width: 104,
    height: 104,
    borderRadius: 104,
    opacity: 0.5,
  },
  heroIconCard: {
    width: 96,
    height: 96,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroTitle: {
    color: colors.textPrimary,
    fontSize: typography.display,
    lineHeight: 34,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  heroSubtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  heroHighlight: {
    color: colors.primary,
    fontWeight: '800',
  },
  searchCard: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.body,
    lineHeight: 20,
    paddingVertical: 0,
  },
  contactsSection: {
    gap: 10,
  },
  contactsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  contactsTitle: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 14,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  totalBadge: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  totalBadgeText: {
    color: colors.primary,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
  },
  contactList: {
    gap: 8,
  },
  contactCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  contactCardMuted: {
    opacity: 0.56,
  },
  contactRow: {
    minHeight: 76,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    color: colors.primary,
    fontSize: typography.md,
    lineHeight: 22,
    fontWeight: '700',
  },
  contactName: {
    color: colors.textPrimary,
    fontSize: typography.body,
    lineHeight: 19,
    fontWeight: '700',
  },
  contactSubtitle: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 13,
    marginTop: 1,
  },
  inviteButton: {
    height: 36,
    borderRadius: 11,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: colors.primary,
    shadowOpacity: 0.24,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  inviteButtonText: {
    color: colors.onPrimaryDeepAlt,
    fontSize: typography.sm,
    lineHeight: 15,
    fontWeight: '700',
  },
  invitedPill: {
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  invitedPillText: {
    color: colors.primary,
    fontSize: typography.sm,
    lineHeight: 15,
    fontWeight: '700',
  },
  alreadyText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 13,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  statsGrid: {
    marginTop: 6,
    flexDirection: 'row',
    gap: 10,
  },
  statsCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(245, 158, 11, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    overflow: 'hidden',
  },
  statsCaption: {
    color: colors.textMuted,
    fontSize: 10,
    lineHeight: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
  },
  statsValue: {
    marginTop: 4,
    color: colors.textPrimary,
    fontSize: typography.display,
    lineHeight: 32,
    fontWeight: '800',
  },
  statsValuePrimary: {
    marginTop: 4,
    color: colors.primary,
    fontSize: typography.display,
    lineHeight: 32,
    fontWeight: '800',
  },
});

export default ReferEarnScreen;