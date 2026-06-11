/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { Plus, Wallet } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, typography } from '../constants/theme';
import Header from '../components/Header';
import { useDispatch, useSelector } from '../redux/store';
import { getWalletHistory, topUpWallet } from '../redux/user/userAction';
import moment from 'moment';
import { currencyFormate } from '../utils/helper';
import { showToaster } from '../utils/toaster';
import RazorpayCheckout from 'react-native-razorpay';
import Loader from '../components/Loader';

type WalletHistoryItem = {
  id: number;
  txn_id: string;
  type: 'Credit' | 'Debit';
  amount: number;
  description: string;
  remarks: string;
  status: string;
  updated_at: string;
};

type WalletHistoryResponse = {
  balance: number;
  history: WalletHistoryItem[];
  pagination: {
    total_data: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
};

const GlassLayer = ({ radius }: { radius: number }) => (
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
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);

  const [isShowLoader, setIsShowLoader] = React.useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = React.useState(false);
  const [selectedAmount, setSelectedAmount] = React.useState(100);
  const [walletData, setWalletData] =
    React.useState<WalletHistoryResponse | null>(null);
  const [isInitialLoading, setIsInitialLoading] = React.useState(false);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const amountOptions = [25, 50, 100, 200];
  const isFetchingMoreRef = useRef(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    loadWalletHistory(1, true);
  };

  const openTopUpSheet = React.useCallback(() => {
    setIsTopUpOpen(true);
  }, []);

  const closeTopUpSheet = React.useCallback(() => {
    setIsTopUpOpen(false);
  }, []);

  const proceedTopup = () => {
    if (selectedAmount > 0) {
      setIsTopUpOpen(false);
      // proceed to payment
      console.log('selectedAmount', selectedAmount);
      setIsShowLoader(true);
      dispatch(topUpWallet({ amount: selectedAmount }))
        .unwrap()
        .then(({ data }) => {
          if (data?.key) {
            var options = {
              description: data?.receipt,
              currency: 'INR',
              key: data?.key,
              amount: data?.amount,
              name: 'Ahaari',
              order_id: data?.order_id,
              prefill: {
                email: userData?.first_name,
                contact: userData?.phone,
                name: userData?.first_name + ' ' + userData?.last_name,
              },
              theme: {
                color: colors.primary,
                hide_topbar: true,
                backdrop_color: '#000',
              },
              modal: {
                escape: false,
                confirm_close: true,
              },
              hidden: {
                email: true,
                contact: true,
              },
              readonly: {
                contact: true,
                email: true,
                name: true,
              },
            };
            paynow({ options, orderCreateData: null });
          } else {
            loadWalletHistory(1, true);
          }
        })
        .catch(error => {
          setIsShowLoader(false);
          console.log('error', error);
          loadWalletHistory(1, true);
        });
    } else {
      showToaster('Please select an amount');
    }
  };

  const paynow = ({ options, orderCreateData }: any) => {
    console.log('orderCreateData', orderCreateData);
    RazorpayCheckout.open(options)
      .then(data => {
        console.log('payment success', data);
      })
      .catch(error => {
        console.log('error', error);
        showToaster('Payment failed. Please try again.');
      })
      .finally(() => {
        setIsShowLoader(false);
        loadWalletHistory(1, true);
      });
  };

  const loadWalletHistory = React.useCallback(
    async (pageNo: number, replace = false) => {
      if (isFetchingMoreRef.current) {
        return;
      }

      if (replace) {
        setIsInitialLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      isFetchingMoreRef.current = true;

      try {
        const response = await dispatch(
          getWalletHistory({ page: pageNo }),
        ).unwrap();
        const payload: WalletHistoryResponse | undefined = response?.data;

        if (payload) {
          setWalletData(previous => {
            if (replace || !previous) {
              return payload;
            }

            return {
              ...payload,
              history: [...previous.history, ...payload.history],
            };
          });
        }
      } finally {
        isFetchingMoreRef.current = false;
        setIsInitialLoading(false);
        setIsLoadingMore(false);
        setRefreshing(false);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    loadWalletHistory(1, true);
  }, [loadWalletHistory]);

  const handleLoadMore = React.useCallback(() => {
    const currentPage = walletData?.pagination?.current_page || 1;
    const lastPage = walletData?.pagination?.last_page || 1;

    if (isFetchingMoreRef.current || isLoadingMore || currentPage >= lastPage) {
      return;
    }

    loadWalletHistory(currentPage + 1, false);
  }, [isLoadingMore, loadWalletHistory, walletData?.pagination]);

  const walletHistory = walletData?.history || [];
  const walletBalance = walletData?.balance ?? 0;
  const currentPage = walletData?.pagination?.current_page ?? 1;
  const lastPage = walletData?.pagination?.last_page ?? 1;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <Header
        title="Wallet History"
        showBackButton={true}
        containerStyle={{ paddingHorizontal: layout.screenPadding }}
      />
      {isShowLoader && <Loader />}
      <FlatList
        data={walletHistory}
        keyExtractor={(_i, index) => index.toString()}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={
          isInitialLoading ? null : (
            <View style={styles.emptyStateWrap}>
              <Text style={styles.emptyStateTitle}>No wallet history yet</Text>
              <Text style={styles.emptyStateText}>
                Your wallet transactions will appear here once you start using
                the wallet.
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          isLoadingMore && walletHistory.length > 0 ? (
            <View style={styles.footerLoaderWrap}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.footerLoaderText}>
                Loading more history...
              </Text>
            </View>
          ) : walletHistory.length > 0 && currentPage >= lastPage ? (
            <Text style={styles.footerEndText}>End of wallet history</Text>
          ) : null
        }
        renderItem={({ item }) => {
          const sign = item?.type === 'Credit' ? '+' : '-';
          const amountValue = Number(item.amount || 0).toFixed(2);

          const amountColor =
            item?.type === 'Credit' ? styles.amountCredit : styles.amountDebit;

          return (
            <View
              style={[
                styles.activityItem,
                { opacity: item.status === 'Failed' ? 0.5 : 1 },
              ]}
            >
              <GlassLayer radius={24} />
              <LinearGradient
                pointerEvents="none"
                colors={[
                  'rgba(255, 176, 0, 0.06)',
                  ' rgba(13, 18, 28, 0)',
                  'rgba(255, 124, 38, 0.06)',
                ]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.activityOverlay}
              />

              <View style={styles.activityRow}>
                <View
                  style={[
                    styles.activityIconWrap,
                    {
                      backgroundColor:
                        item?.type === 'Credit'
                          ? 'rgba(255, 176, 0, 0.45)'
                          : ' rgba(255, 255, 255, 0.2)',
                    },
                  ]}
                >
                  <View style={styles.topupIconWrap}>
                    <Wallet
                      size={24}
                      color={
                        item?.type === 'Credit'
                          ? colors.primary
                          : colors.textMutedAlt
                      }
                      strokeWidth={2.25}
                    />
                    <View style={styles.topupPlusChip}>
                      {item?.type === 'Credit' ? (
                        <Plus
                          size={11}
                          color={colors.primary}
                          strokeWidth={2.6}
                        />
                      ) : null}
                    </View>
                  </View>
                </View>

                <View style={styles.activityTextWrap}>
                  <Text style={[styles.activityTitle]} numberOfLines={2}>
                    {item?.description}
                  </Text>
                  <Text style={styles.activityTime} numberOfLines={1}>
                    {item?.updated_at
                      ? moment(item.updated_at).format('MMM D, h:mm A')
                      : null}
                  </Text>
                </View>

                <View style={styles.amountWrap}>
                  <Text
                    style={[styles.activityAmount, amountColor]}
                    numberOfLines={1}
                  >
                    {sign}
                    {currencyFormate(amountValue, 2)}
                  </Text>
                  <Text
                    style={[
                      styles.activityStatus,
                      {
                        color:
                          item?.status === 'Success'
                            ? colors.success
                            : item?.status === 'Failed'
                            ? colors.red
                            : colors.textMutedSoft2,
                      },
                    ]}
                  >
                    {item?.status}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
        ItemSeparatorComponent={<View style={{ height: 10 }} />}
        ListHeaderComponent={
          <>
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
              <Text style={styles.balanceAmount} numberOfLines={1}>
                {currencyFormate(walletBalance || 0, 2)}
              </Text>

              <TouchableOpacity
                style={styles.topUpButton}
                activeOpacity={0.92}
                onPress={openTopUpSheet}
              >
                <Text style={styles.topUpButtonText}>Top Up</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.activityHeaderRow}>
              <Text style={styles.activityHeading}>Recent Activity</Text>
            </View>

            {isInitialLoading ? (
              <View style={styles.initialLoaderWrap}>
                <ActivityIndicator color={colors.primary} />
                <Text style={styles.initialLoaderText}>
                  Loading wallet history...
                </Text>
              </View>
            ) : null}
          </>
        }
      />

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
              <Text style={styles.sheetSubtitle}>
                Choose an amount to add instantly.
              </Text>

              <View style={styles.customAmountWrap}>
                <GlassLayer radius={12} />
                <Text style={styles.customAmountLabel}>CUSTOM AMOUNT</Text>
                <View style={styles.customAmountInputRow}>
                  <Text style={styles.currencySymbol}>₹</Text>
                  <TextInput
                    style={styles.customAmountInput}
                    placeholder="Enter amount"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="numeric"
                    value={
                      selectedAmount === 0 ? '' : selectedAmount.toString()
                    }
                    onChangeText={text => {
                      const numericValue = text.replace(/[^0-9]/g, '');
                      setSelectedAmount(Number(numericValue));
                    }}
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
                      style={[
                        styles.amountChip,
                        isActive ? styles.amountChipActive : null,
                      ]}
                      onPress={() => {
                        setSelectedAmount(amount);
                      }}
                    >
                      <Text
                        style={[
                          styles.amountChipText,
                          isActive ? styles.amountChipTextActive : null,
                        ]}
                      >
                        ₹{amount}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.sheetButtonWrap}>
                <TouchableOpacity
                  style={styles.topUpButton}
                  activeOpacity={0.92}
                  onPress={proceedTopup}
                >
                  <Text style={styles.sheetButtonText}>
                    Continue to Payment
                  </Text>
                </TouchableOpacity>
                <Text style={styles.sheetHint}>
                  You will proceed to the payment page next.
                </Text>
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
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
    paddingTop: 28,
    paddingHorizontal: 20,
    paddingBottom: 30,
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
    alignItems: 'center',
    justifyContent: 'center',
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
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.textMutedSoft2,
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
  emptyStateWrap: {
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyStateText: {
    marginTop: 6,
    color: colors.textMuted,
    fontSize: typography.smPlus,
    lineHeight: 20,
    textAlign: 'center',
  },
  initialLoaderWrap: {
    paddingVertical: 18,
    alignItems: 'center',
    gap: 10,
  },
  initialLoaderText: {
    color: colors.textMuted,
    fontSize: typography.smPlus,
    fontWeight: '500',
  },
  footerLoaderWrap: {
    paddingTop: 14,
    alignItems: 'center',
    gap: 8,
  },
  footerLoaderText: {
    color: colors.textMuted,
    fontSize: typography.sm,
    fontWeight: '500',
  },
  footerEndText: {
    paddingTop: 14,
    textAlign: 'center',
    color: colors.textMutedDark,
    fontSize: typography.caption,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
});

export default WalletHistoryScreen;
