import React from 'react';
import {
  Modal,
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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Undo2,
  Plus,
  Tag,
  UtensilsCrossed,
  Wallet,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, typography } from '../constants/theme';
import type { RootStackParamList } from '../types/navigation';
import Header from '../components/Header';

type WalletEntryTone = 'credit' | 'debit' | 'muted';
type WalletEntryIcon = 'order' | 'topup' | 'discount' | 'refund';

type WalletEntry = {
  id: string;
  title: string;
  time: string;
  amount: string;
  status: string;
  tone: WalletEntryTone;
  icon: WalletEntryIcon;
  highlight?: boolean;
};

const entries: WalletEntry[] = [
  {
    id: 'order-4291',
    title: 'Order #4291',
    time: 'Today, 2:45 PM',
    amount: '-$32.40',
    status: 'COMPLETED',
    tone: 'debit',
    icon: 'order',
  },
  {
    id: 'wallet-topup-200',
    title: 'Wallet Top Up',
    time: 'Yesterday, 10:20 AM',
    amount: '+$200.00',
    status: 'BANK TRANSFER',
    tone: 'credit',
    icon: 'topup',
  },
  {
    id: 'family-discount',
    title: 'Family Discount Applied',
    time: 'Mar 12, 8:15 PM',
    amount: '+$15.00',
    status: 'PROMO CREDIT',
    tone: 'credit',
    icon: 'discount',
    highlight: true,
  },
  {
    id: 'refund-order-4288',
    title: 'Refund for Order #4288',
    time: 'Mar 10, 11:30 AM',
    amount: '+$45.20',
    status: 'MERCHANT REFUND',
    tone: 'credit',
    icon: 'refund',
  },
  {
    id: 'order-4288-cancelled',
    title: 'Order #4288',
    time: 'Mar 10, 9:00 AM',
    amount: '-$45.20',
    status: 'CANCELLED',
    tone: 'muted',
    icon: 'order',
  },
];

const GlassLayer = ({ radius }: { radius: number }) => (
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
        blurAmount={26}
        reducedTransparencyFallbackColor="rgba(10, 12, 18, 0.5)"
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
          backgroundColor: 'rgba(12, 15, 22, 0.34)',
        },
      ]}
    />
  </>
);

const WalletHistoryScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isTopUpOpen, setIsTopUpOpen] = React.useState(false);
  const [selectedAmount, setSelectedAmount] = React.useState(100);
  const amountOptions = [25, 50, 100, 200];

  const openTopUpSheet = React.useCallback(() => {
    setIsTopUpOpen(true);
  }, []);

  const closeTopUpSheet = React.useCallback(() => {
    setIsTopUpOpen(false);
  }, []);

  const renderEntryIcon = (icon: WalletEntryIcon, muted: boolean) => {
    if (icon === 'topup') {
      return (
        <View style={styles.topupIconWrap}>
          <Wallet size={24} color={colors.primary} strokeWidth={2.25} />
          <View style={styles.topupPlusChip}>
            <Plus size={11} color={colors.primary} strokeWidth={2.6} />
          </View>
        </View>
      );
    }

    if (icon === 'discount') {
      return <Tag size={25} color={colors.primary} strokeWidth={2.25} />;
    }

    if (icon === 'refund') {
      return <Undo2 size={23} color="#A9AFBA" strokeWidth={2.3} />;
    }

    return (
      <UtensilsCrossed size={24} color={muted ? '#737A88' : '#99A0AF'} strokeWidth={2.1} />
    );
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <Header title="Restaurant Details" showBackButton={true} containerStyle={{ paddingHorizontal: layout.screenPadding }} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.balanceCard}>
          <GlassLayer radius={24} />
          <LinearGradient
            pointerEvents="none"
            colors={['rgba(255, 176, 0, 0.12)', 'rgba(255, 176, 0, 0)']}
            start={{ x: 0, y: 0.3 }}
            end={{ x: 0.9, y: 0.7 }}
            style={styles.balanceWarmOverlay}
          />
          <LinearGradient
            pointerEvents="none"
            colors={['rgba(20, 30, 56, 0)', 'rgba(20, 30, 56, 0.2)']}
            start={{ x: 0.45, y: 0.1 }}
            end={{ x: 1, y: 0.8 }}
            style={styles.balanceCoolOverlay}
          />

          <Text style={styles.balanceCaption}>CURRENT BALANCE</Text>
          <Text style={styles.balanceAmount} numberOfLines={1}>$425.50</Text>

          <TouchableOpacity style={styles.topUpButton} activeOpacity={0.92} onPress={openTopUpSheet}>
            <Text style={styles.topUpButtonText}>Top Up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityHeaderRow}>
          <Text style={styles.activityHeading}>Recent Activity</Text>
          <Text style={styles.activityMonth}>March 2024</Text>
        </View>

        <View style={styles.activityList}>
          {entries.map(item => {
            const muted = item.tone === 'muted';

            const amountColor =
              item.tone === 'credit'
                ? styles.amountCredit
                : item.tone === 'debit'
                  ? styles.amountDebit
                  : styles.amountMuted;

            const statusColor =
              item.tone === 'credit'
                ? styles.statusCredit
                : item.tone === 'debit'
                  ? styles.statusDebit
                  : styles.statusMuted;

            return (
              <View
                key={item.id}
                style={[
                  styles.activityItem,
                  item.highlight ? styles.activityItemHighlighted : null,
                  muted ? styles.activityItemMuted : null,
                ]}
              >
                <GlassLayer radius={24} />
                <LinearGradient
                  pointerEvents="none"
                  colors={['rgba(255, 176, 0, 0.06)', 'rgba(13, 18, 28, 0)', 'rgba(255, 124, 38, 0.06)']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.activityOverlay}
                />

                {item.highlight ? <View style={styles.activeIndicator} /> : null}

                <View style={styles.activityRow}>
                  <View
                    style={[
                      styles.activityIconWrap,
                      item.icon === 'topup' ? styles.activityIconWrapTopup : null,
                    ]}
                  >
                    {renderEntryIcon(item.icon, muted)}
                  </View>

                  <View style={styles.activityTextWrap}>
                    <Text
                      style={[styles.activityTitle, muted ? styles.activityTitleMuted : null]}
                      numberOfLines={2}
                    >
                      {item.title}
                    </Text>
                    <Text style={styles.activityTime} numberOfLines={1}>{item.time}</Text>
                  </View>

                  <View style={styles.amountWrap}>
                    <Text style={[styles.activityAmount, amountColor]} numberOfLines={1}>{item.amount}</Text>
                    <Text
                      style={[
                        styles.activityStatus,
                        statusColor,
                        muted ? styles.activityStatusStriked : null,
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <Modal
        transparent
        visible={isTopUpOpen}
        animationType="slide"
        onRequestClose={closeTopUpSheet}
      >
        <View style={styles.sheetOverlay}>
          <Pressable style={styles.sheetBackdrop} onPress={closeTopUpSheet} />
          <View style={styles.sheetBackground}>
            <View style={styles.sheetHandleWrap}>
              <View style={styles.sheetHandle} />
            </View>
            <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Top Up Wallet</Text>
          <Text style={styles.sheetSubtitle}>Choose an amount to add instantly.</Text>

          <View style={styles.customAmountWrap}>
            <GlassLayer radius={12} />
            <Text style={styles.customAmountLabel}>CUSTOM AMOUNT</Text>
            <View style={styles.customAmountInputRow}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.customAmountInput}
                placeholder="Enter amount"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.amountGrid}>
            {amountOptions.map(amount => {
              const isActive = amount === selectedAmount;
              return (
                <TouchableOpacity
                  key={amount}
                  activeOpacity={0.9}
                  style={[styles.amountChip, isActive ? styles.amountChipActive : null]}
                  onPress={() => setSelectedAmount(amount)}
                >
                  <Text style={[styles.amountChipText, isActive ? styles.amountChipTextActive : null]}>
                    ${amount}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.sheetButtonWrap}>
            <TouchableOpacity style={styles.topUpButton} activeOpacity={0.92} onPress={closeTopUpSheet}>
              
                <Text style={styles.sheetButtonText}>Continue to Payment</Text>
            </TouchableOpacity>
            <Text style={styles.sheetHint}>You will confirm the payment method next.</Text>
          </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  headerBlur: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(12, 14, 18, 0.38)',
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: layout.screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerRoundButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    lineHeight: 26,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 150,
  },
  balanceCard: {
    minHeight: 238,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
    paddingTop: 28,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  balanceWarmOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 24,
  },
  balanceCoolOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 24,
  },
  balanceCaption: {
    textAlign: 'center',
    color: colors.textSoft,
    fontSize: typography.caption,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.8,
  },
  balanceAmount: {
    marginTop: 6,
    textAlign: 'center',
    color: colors.primary,
    fontSize: typography.display5xl,
    lineHeight: 60,
    fontWeight: '800',
    letterSpacing: -0.8,
    textShadowColor: 'rgba(255, 176, 0, 0.3)',
    textShadowOffset: { width: 0, height: 6 },
    textShadowRadius: 14,
  },
  topUpButton: {
    marginTop: 16,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  topUpButtonText: {
    color: colors.onPrimaryBrown,
    fontSize: typography.lg,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  sheetBackground: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetBackdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  sheetHandleWrap: {
    paddingTop: 12,
    paddingBottom: 6,
    alignItems: 'center',
  },
  sheetHandle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  sheetContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 6,
    paddingBottom: 24,
  },
  sheetTitle: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  sheetSubtitle: {
    marginTop: 6,
    color: colors.textMuted,
    fontSize: typography.smPlus,
    lineHeight: 18,
    fontWeight: '500',
  },
  customAmountWrap: {
    marginTop: 14,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    backgroundColor: 'rgba(19, 22, 28, 0.65)',
  },
  customAmountLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  customAmountInputRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  currencySymbol: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    lineHeight: 28,
    fontWeight: '700',
  },
  customAmountInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.xl,
    lineHeight: 28,
    fontWeight: '700',
    paddingVertical: 0,
  },
  amountGrid: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amountChip: {
    width: '47%',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(19, 22, 28, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountChipActive: {
    borderColor: 'rgba(255, 176, 0, 0.6)',
    backgroundColor: 'rgba(255, 176, 0, 0.14)',
  },
  amountChipText: {
    color: colors.textMuted,
    fontSize: typography.lg,
    lineHeight: 22,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  amountChipTextActive: {
    color: colors.primary,
  },
  sheetButtonWrap: {
    marginTop: 20,
    gap: 10,
  },
  sheetButton: {
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetButtonText: {
    color: '#000000',
    fontSize: typography.lg,
    lineHeight: 22,
    fontWeight: '700',
  },
  sheetHint: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 16,
    fontWeight: '500',
  },
  activityHeaderRow: {
    marginTop: 30,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activityHeading: {
    color: colors.textPrimarySoft,
    fontSize: typography.xl,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  activityMonth: {
    color: colors.textMutedSoft,
    fontSize: typography.body,
    lineHeight: 20,
    fontWeight: '500',
  },
  activityList: {
    gap: 10,
  },
  activityItem: {
    minHeight: 84,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  activityItemHighlighted: {
    borderColor: 'rgba(255, 176, 0, 0.45)',
  },
  activityItemMuted: {
    opacity: 0.5,
  },
  activityOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 24,
  },
  activeIndicator: {
    position: 'absolute',
    left: -1,
    top: 12,
    bottom: 12,
    width: 4,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    backgroundColor: colors.primary,
  },
  activityRow: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  activityIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.surfaceBlueMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIconWrapTopup: {
    backgroundColor: 'rgba(255, 176, 0, 0.2)',
  },
  topupIconWrap: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topupPlusChip: {
    position: 'absolute',
    right: -6,
    bottom: -5,
  },
  activityTextWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  activityTitle: {
    color: colors.textPrimaryAlt,
    fontSize: typography.md,
    lineHeight: 21,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  activityTitleMuted: {
    color: colors.textMutedAlt,
  },
  activityTime: {
    marginTop: 2,
    color: colors.textMutedSoft2,
    fontSize: typography.sm,
    lineHeight: 16,
    fontWeight: '500',
  },
  amountWrap: {
    minWidth: 106,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  activityAmount: {
    fontSize: typography.lg,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  activityStatus: {
    marginTop: 2,
    textAlign: 'right',
    fontSize: typography.caption,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  activityStatusStriked: {
    textDecorationLine: 'line-through',
  },
  amountCredit: {
    color: colors.primary,
  },
  amountDebit: {
    color: colors.textSecondaryAlt,
  },
  amountMuted: {
    color: colors.textMutedAlt2,
  },
  statusCredit: {
    color: colors.textMutedCool2,
  },
  statusDebit: {
    color: colors.textMutedCool,
  },
  statusMuted: {
    color: colors.textMutedDark,
  },
});

export default WalletHistoryScreen;
