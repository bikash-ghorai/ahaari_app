import React from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Clock3,
  CreditCard,
  Headset,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Truck,
} from 'lucide-react-native';

import { colors, layout, typography } from '../constants/theme';
import Header from '../components/Header';

const supportPhone = '+91 9134331144';
const supportPhoneDigits = supportPhone.replace(/\D/g, '');
const supportEmail = 'support@biteo.app';
const whatsappUrl = `https://wa.me/${supportPhoneDigits}`;

const selfServiceItems = [
  {
    id: 'track',
    title: 'Track an order',
    subtitle: 'Live status and driver ETA.',
    icon: Truck,
  },
  {
    id: 'refund',
    title: 'Refund status',
    subtitle: 'Check refunds in seconds.',
    icon: CreditCard,
  },
  {
    id: 'address',
    title: 'Update address',
    subtitle: 'Fix delivery details quickly.',
    icon: MapPin,
  },
  {
    id: 'security',
    title: 'Account security',
    subtitle: 'Review access and alerts.',
    icon: ShieldCheck,
  },
];

const serviceStandards = [
  {
    id: 'response',
    title: 'Average response time',
    subtitle: 'Under 10 minutes on chat.',
    icon: Clock3,
  },
  {
    id: 'refunds',
    title: 'Refund timeline',
    subtitle: '3-5 business days after approval.',
    icon: CreditCard,
  },
  {
    id: 'priority',
    title: 'Priority escalation',
    subtitle: 'Urgent issues reviewed within 2 hours.',
    icon: Headset,
  },
];

const faqItems = [
  {
    id: 'refunds',
    question: 'How do I request a refund?',
    answer: 'Open the order in your history and tap “Report a problem”.',
  },
  {
    id: 'tracking',
    question: 'Where can I track my order?',
    answer: 'Go to Orders and select the active delivery to see live status.',
  },
  {
    id: 'support',
    question: 'How fast does support respond?',
    answer: 'Live chat replies within minutes, and email within 24 hours.',
  },
  {
    id: 'payment',
    question: 'Can I change my payment method?',
    answer: 'You can switch payment methods at checkout before placing an order.',
  },
  {
    id: 'address',
    question: 'How do I update my delivery address?',
    answer: 'Go to Profile > Addresses and edit or add a new location.',
  },
];

const HelpCenterScreen = () => {
  const handleCall = () => {
    Linking.openURL(`tel:${supportPhoneDigits}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${supportEmail}`);
  };

  const handleWhatsApp = () => {
    Linking.openURL(whatsappUrl);
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <Header
        title="Help Center"
        showBackButton={true}
        containerStyle={{ paddingHorizontal: layout.screenPadding }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroIconWrap}>
            <Headset size={22} color={colors.primary} strokeWidth={2.4} />
          </View>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>We are here to help</Text>
            <Text style={styles.heroSubtitle}>
              Reach our support team for order issues, refunds, or account help.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact support</Text>
          <View style={styles.supportRow}>
            <View>
              <Text style={styles.supportLabel}>Hotline</Text>
              <Text style={styles.supportValue}>{supportPhone}</Text>
            </View>
            <View style={styles.supportStatus}>
              <Clock3 size={14} color={colors.textMuted} strokeWidth={2.2} />
              <Text style={styles.supportStatusText}>24/7 available</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.callButton} activeOpacity={0.9} onPress={handleCall}>
              <Phone size={16} color={colors.textPrimary} strokeWidth={2.2} />
              <Text style={styles.callButtonText}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.whatsappButton} activeOpacity={0.9} onPress={handleWhatsApp}>
              <LinearGradient
                colors={['#1EAD5A', '#2CD370']}
                start={{ x: 0.1, y: 0.2 }}
                end={{ x: 0.9, y: 0.8 }}
                style={styles.whatsappGradient}
              >
                <MessageCircle size={16} color="#0B1B12" strokeWidth={2.4} />
                <Text style={styles.whatsappText}>WhatsApp</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.emailButton} activeOpacity={0.9} onPress={handleEmail}>
            <Mail size={16} color={colors.textPrimary} strokeWidth={2.2} />
            <Text style={styles.emailButtonText}>Email support</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Self-service</Text>
          <View style={styles.selfServiceGrid}>
            {selfServiceItems.map(item => {
              const Icon = item.icon;

              return (
                <TouchableOpacity key={item.id} style={styles.selfServiceCard} activeOpacity={0.88}>
                  <View style={styles.selfServiceIconWrap}>
                    <Icon size={18} color={colors.primary} strokeWidth={2.2} />
                  </View>
                  <Text style={styles.selfServiceTitle}>{item.title}</Text>
                  <Text style={styles.selfServiceSubtitle}>{item.subtitle}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Service standards</Text>
          <View style={styles.standardsList}>
            {serviceStandards.map((item, index) => {
              const Icon = item.icon;

              return (
                <View key={item.id}>
                  <View style={styles.standardRow}>
                    <View style={styles.standardIconWrap}>
                      <Icon size={16} color={colors.primary} strokeWidth={2.2} />
                    </View>
                    <View style={styles.standardTextWrap}>
                      <Text style={styles.standardTitle}>{item.title}</Text>
                      <Text style={styles.standardSubtitle}>{item.subtitle}</Text>
                    </View>
                  </View>
                  {index < serviceStandards.length - 1 ? <View style={styles.quickDivider} /> : null}
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Help</Text>
          <View style={styles.quickList}>
            {faqItems.map((item, index) => (
              <View key={item.id}>
                <View style={styles.faqRow}>
                  <View style={styles.faqIconWrap}>
                    <ShieldCheck size={16} color={colors.primary} strokeWidth={2.2} />
                  </View>
                  <View style={styles.faqTextWrap}>
                    <Text style={styles.faqQuestion}>{item.question}</Text>
                    <Text style={styles.faqAnswer}>{item.answer}</Text>
                  </View>
                </View>
                {index < faqItems.length - 1 ? <View style={styles.quickDivider} /> : null}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
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
    padding: 18,
    flexDirection: 'row',
    gap: 14,
  },
  heroIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {
    flex: 1,
    gap: 4,
  },
  heroTitle: {
    color: colors.textPrimary,
    fontSize: typography.titlePlus,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    color: colors.textMuted,
    fontSize: typography.bodyPlus,
    lineHeight: 22,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 18,
    gap: 16,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: typography.titlePlus,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  supportRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  supportLabel: {
    color: colors.textMutedAlt,
    fontSize: typography.caption,
    letterSpacing: 1,
    fontWeight: '700',
  },
  supportValue: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    fontWeight: '700',
    marginTop: 6,
  },
  supportStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  supportStatusText: {
    color: colors.textMuted,
    fontSize: typography.captionPlus,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  callButton: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  callButtonText: {
    color: colors.textPrimary,
    fontSize: typography.bodyPlus,
    fontWeight: '700',
  },
  whatsappButton: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    overflow: 'hidden',
  },
  whatsappGradient: {
    flex: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  whatsappText: {
    color: '#0B1B12',
    fontSize: typography.bodyPlus,
    fontWeight: '700',
  },
  emailButton: {
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  emailButtonText: {
    color: colors.textPrimary,
    fontSize: typography.bodyPlus,
    fontWeight: '700',
  },
  selfServiceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  selfServiceCard: {
    width: '48%',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 12,
    gap: 6,
  },
  selfServiceIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selfServiceTitle: {
    color: colors.textPrimary,
    fontSize: typography.bodyPlus,
    fontWeight: '700',
  },
  selfServiceSubtitle: {
    color: colors.textMuted,
    fontSize: typography.captionPlus,
    lineHeight: 18,
  },
  standardsList: {
    gap: 12,
  },
  standardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  standardIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  standardTextWrap: {
    flex: 1,
    gap: 4,
  },
  standardTitle: {
    color: colors.textPrimary,
    fontSize: typography.bodyPlus,
    fontWeight: '600',
  },
  standardSubtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 20,
  },
  quickList: {
    gap: 12,
  },
  faqRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  faqIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqTextWrap: {
    flex: 1,
    gap: 4,
  },
  faqQuestion: {
    color: colors.textPrimary,
    fontSize: typography.bodyPlus,
    fontWeight: '600',
  },
  faqAnswer: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 20,
  },
  quickDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
});

export default HelpCenterScreen;
