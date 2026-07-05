/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  CompositeNavigationProp,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  AlertTriangle,
  Bell,
  CircleCheck,
  Phone,
  Search,
  ShoppingBag,
  Star,
  XCircle,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, typography } from '../constants/theme';
import type { RootStackParamList, RootTabParamList } from '../types/navigation';
import { useWeatherAlert } from '../contexts/WeatherAlertContext';
import WeatherAlertTooltip from '../components/WeatherAlertTooltip';
import { useDispatch } from '../redux/store';
import { getOrders } from '../redux/app/appAction';
import { IActiveOrder, IOrderListRes, IPastOrder } from '../types';
import { ImagePath } from '../constants/ImagePath';
import { Constant } from '../constants/Constant';
import { handleCall, statusColors } from '../utils/helper';
import { useCart } from '../hooks';
import Loader from '../components/Loader';
import socketService from '../utils/socket-service';

const GlassLayer = ({
  radius,
  tint = 'rgba(12, 14, 18, 0.35)',
}: {
  radius: number;
  tint?: string;
}) => (
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
        blurAmount={30}
        reducedTransparencyFallbackColor="rgba(12, 14, 18, 0.45)"
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

type OrdersScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, 'Orders'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const OrdersScreen = () => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const navigation = useNavigation<OrdersScreenNavigationProp>();
  const shimmerValue = useRef(new Animated.Value(0)).current;
  const { addMultipleProducts } = useCart();

  const [orderListData, setOrderListData] = useState<IOrderListRes | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  useEffect(() => {
    const shimmerLoop = Animated.loop(
      Animated.timing(shimmerValue, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      }),
    );

    shimmerLoop.start();
    return () => {
      shimmerLoop.stop();
    };
  }, [shimmerValue]);

  useEffect(() => {
    if (isFocused) {
      fetchOrders();
      // DeviceEventEmitter.addListener('admin_web_login', fetchOrders);
    } else {
      // DeviceEventEmitter.removeAllListeners('admin_web_login')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const fetchOrders = () => {
    setIsLoading(true);
    dispatch(getOrders())
      .unwrap()
      .then(({ data }) => {
        setOrderListData(data);
      })
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  const openOrderDetails = (order: IActiveOrder | IPastOrder) => {
    socketService.logAnalytics({
      action: 'page_view',
      name: 'OrderDetails Screen',
      from: 'Orders Screen',
      params: order?.shop_name,
    });
    navigation.navigate('OrderDetails', { orderId: order.order_id || '' });
  };

  // const openRateExperience = () => {
  //   navigation.navigate('RateExperience');
  // };

  const { isBadWeather, show } = useWeatherAlert();

  const currentProgressWidthNumber = (order: IActiveOrder) => {
    if (!order?.timeline) return 0;

    // pending, in_progress, completed;
    const line_25 = order.timeline?.step_1?.status === 'in_progress';
    const line_50 = order.timeline?.step_1?.status === 'completed';
    const line_75 = order.timeline?.step_2?.status === 'in_progress';
    const line_100 = order.timeline?.step_3?.status === 'completed';

    if (line_100) return 100;
    if (line_75) return 75;
    if (line_25) return 25;
    if (line_50) return 50;
    return 0;
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <WeatherAlertTooltip />
      <View
        style={{
          paddingHorizontal: layout.screenPadding,
          paddingTop: 8,
          paddingBottom: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ gap: 4 }}>
          <Text
            style={{
              color: colors.textMuted,
              fontSize: typography.caption,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            Your Food Journey
          </Text>
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: typography.xl,
              fontWeight: '700',
              letterSpacing: -0.3,
            }}
          >
            My Orders
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: 12,
          }}
        >
          <TouchableOpacity
            style={{
              width: 44,
              height: 44,
              backgroundColor: colors.glass,
              borderRadius: 24,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.glassBorder,
              overflow: 'hidden',
            }}
            onPress={() => {
              socketService.logAnalytics({
                action: 'page_view',
                name: 'Search Screen',
                from: 'Orders Screen',
              });
              navigation.navigate('Search');
            }}
          >
            <Search size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 44,
              height: 44,
              backgroundColor: colors.glass,
              borderRadius: 24,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.glassBorder,
              overflow: 'hidden',
            }}
            onPress={() => {
              if (isBadWeather) {
                show();
              }
            }}
            accessibilityLabel="Weather warning"
          >
            {isBadWeather ? (
              <AlertTriangle size={20} color={colors.accentCoral} />
            ) : (
              <>
                <Bell size={20} color="#FFF" />
                <View
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    width: 8,
                    height: 8,
                    backgroundColor: colors.primary,
                    borderRadius: 4,
                  }}
                />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {isLoading && <Loader />}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
            progressBackgroundColor="#1A1A1A"
          />
        }
      >
        <View style={styles.mainStack}>
          {orderListData &&
          orderListData?.active_orders &&
          orderListData.active_orders.length > 0 ? (
            <View style={styles.activeSection}>
              <View style={styles.activeHeaderRow}>
                <Text style={styles.sectionTitle}>Active Order</Text>
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>In Progress</Text>
                </View>
              </View>
              {orderListData.active_orders.map((order, ind) => {
                return (
                  <View style={styles.activeCard} key={ind}>
                    <GlassLayer radius={16} tint="rgba(255, 255, 255, 0.03)" />

                    <TouchableOpacity
                      activeOpacity={0.88}
                      onPress={() => openOrderDetails(order)}
                    >
                      <View style={styles.activeTopRow}>
                        <View style={styles.activeLeftBlock}>
                          <View style={styles.activeImageFrame}>
                            <Image
                              source={
                                order?.shop_image
                                  ? {
                                      uri: Constant.ImageURL + order.shop_image,
                                    }
                                  : ImagePath.noShopPlaceholder
                              }
                              style={styles.activeFoodImage}
                            />
                          </View>

                          <View style={styles.activeTitleGroup}>
                            <Text style={styles.activeRestaurant}>
                              {order?.shop_name || ''}
                            </Text>
                            <Text style={styles.activeMeta}>
                              ID #{order?.order_id_label || ''}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.progressSection}>
                        <View style={styles.progressLabelsRow}>
                          <Text
                            style={[
                              currentProgressWidthNumber(order) >= 25
                                ? styles.progressLabelActive
                                : styles.progressLabelInactive,
                            ]}
                          >
                            {order?.timeline?.step_1?.title || 'Preparing'}
                          </Text>
                          <Text
                            style={[
                              currentProgressWidthNumber(order) >= 75
                                ? styles.progressLabelActive
                                : styles.progressLabelInactive,
                            ]}
                          >
                            {order?.timeline?.step_2?.title || 'On The Way'}
                          </Text>
                          <Text style={[styles.progressLabelInactive]}>
                            {order?.timeline?.step_3?.title || 'Delivered'}
                          </Text>
                        </View>

                        <View style={styles.progressTrackWrap}>
                          <View style={styles.progressLineBase} />
                          <LinearGradient
                            colors={['#FFAD3A', '#F59E0A']}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={[
                              styles.progressLineActive,
                              {
                                width: `${currentProgressWidthNumber(order)}%`,
                              },
                            ]}
                          />

                          <View
                            style={[
                              styles.progressDot,
                              styles.progressDotOne,
                              currentProgressWidthNumber(order) >= 25
                                ? styles.progressDotDone
                                : null,
                            ]}
                          />
                          <View
                            style={[
                              styles.progressDot,
                              styles.progressDotTwo,
                              currentProgressWidthNumber(order) >= 75
                                ? styles.progressDotDone
                                : null,
                            ]}
                          />
                          <View
                            style={[
                              styles.progressDot,
                              styles.progressDotThree,
                            ]}
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                    {order?.status === 'On The Way' && order?.partner_info ? (
                      <View style={styles.courierCard}>
                        <View style={styles.courierInfoRow}>
                          <View style={styles.courierAvatarFrame}>
                            <Image
                              source={
                                order?.partner_info?.picture
                                  ? {
                                      uri:
                                        Constant.ImageURL +
                                        order.partner_info.picture,
                                    }
                                  : ImagePath.noProfile
                              }
                              style={styles.courierAvatar}
                            />
                          </View>

                          <View>
                            <Text style={styles.courierCaption}>
                              Your Delivery Partner
                            </Text>
                            <Text style={styles.courierName}>
                              {order?.partner_info?.name}
                            </Text>
                            <View style={styles.ratingRow}>
                              <Star
                                size={12}
                                color={colors.primary}
                                fill={colors.primary}
                                strokeWidth={1.8}
                              />
                              <Text style={styles.ratingText}>
                                {order?.partner_info?.rating || '0.0'}
                              </Text>
                            </View>
                          </View>
                        </View>

                        <View style={styles.courierActions}>
                          <TouchableOpacity
                            style={styles.courierIconButton}
                            activeOpacity={0.88}
                            onPress={() =>
                              handleCall(order?.partner_info?.contact || '')
                            }
                          >
                            <Phone size={16} color="#FFFFFF" strokeWidth={2} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.estimateNoticeCard}>
                        <View style={styles.estimateTextWrapper}>
                          <Text style={styles.estimateLabel}>
                            {order?.status}
                          </Text>
                          <Text style={styles.estimateValue}>
                            {order?.message}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          ) : null}

          {orderListData &&
          !(
            orderListData?.active_orders &&
            orderListData.active_orders.length > 0
          ) &&
          !(
            orderListData?.past_orders && orderListData.past_orders.length > 0
          ) ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyContent}>
                <View style={styles.emptyIconWrapper}>
                  <ShoppingBag
                    size={64}
                    color={colors.primary}
                    strokeWidth={1.5}
                  />
                </View>

                <Text style={styles.emptyTitle}>No Orders Yet</Text>
                <Text style={styles.emptySubtitle}>
                  You don't have any active or past orders right now.
                </Text>
              </View>
            </View>
          ) : null}

          {orderListData?.past_orders &&
          orderListData?.past_orders.length > 0 ? (
            <View style={styles.historySection}>
              <Text style={styles.sectionTitle}>Order History</Text>

              <View style={styles.historyList}>
                {orderListData?.past_orders.map((order, index) => (
                  <View key={index} style={styles.historyCard}>
                    <GlassLayer radius={16} tint="rgba(255, 255, 255, 0.03)" />

                    <TouchableOpacity
                      activeOpacity={0.88}
                      style={styles.historyTopRow}
                      onPress={() => openOrderDetails(order)}
                    >
                      <View style={styles.historyImageFrame}>
                        <Image
                          source={
                            order?.shop_image
                              ? { uri: Constant.ImageURL + order.shop_image }
                              : ImagePath.noShopPlaceholder
                          }
                          style={styles.historyImage}
                        />
                      </View>

                      <View style={styles.historyTextGroup}>
                        <Text style={styles.historyTitle} numberOfLines={1}>
                          {order?.shop_name}
                        </Text>

                        <View style={styles.deliveredRow}>
                          {order?.status === 'Delivered' ? (
                            <CircleCheck
                              size={14}
                              color={statusColors[order?.status || 'Delivered']}
                              strokeWidth={2.1}
                            />
                          ) : (
                            <XCircle
                              size={14}
                              color={statusColors[order?.status || 'Cancelled']}
                              strokeWidth={2.1}
                            />
                          )}
                          <Text
                            style={[
                              styles.deliveredText,
                              {
                                color:
                                  statusColors[order?.status || 'Delivered'],
                              },
                            ]}
                            numberOfLines={1}
                          >
                            {order?.status}
                          </Text>
                        </View>

                        <View style={styles.metaRow}>
                          <Text style={styles.metaDateText}>{order?.date}</Text>
                          <View style={styles.metaDot} />
                          <Text style={styles.metaAmountText}>
                            ₹{order?.total}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                    {/* {order.quote ? (
                      <View style={styles.reviewCard}>
                        <View style={styles.reviewStarsRow}>
                          <Star
                            size={14}
                            color={colors.primary}
                            fill={colors.primary}
                            strokeWidth={2.2}
                          />
                          <Star
                            size={14}
                            color={colors.primary}
                            fill={colors.primary}
                            strokeWidth={2.2}
                          />
                          <Star
                            size={14}
                            color={colors.primary}
                            fill={colors.primary}
                            strokeWidth={2.2}
                          />
                          <Star
                            size={14}
                            color={colors.primary}
                            fill={colors.primary}
                            strokeWidth={2.2}
                          />
                          <Star
                            size={14}
                            color={colors.primary}
                            fill={colors.primary}
                            strokeWidth={2.2}
                          />
                        </View>
                        <Text style={styles.reviewText}>{order.quote}</Text>
                      </View>
                    ) : null} */}

                    <View style={styles.historyActionsRow}>
                      <TouchableOpacity
                        activeOpacity={0.88}
                        style={[
                          styles.primaryActionButton,
                          order?.rating
                            ? styles.primaryActionHalf
                            : styles.primaryActionFull,
                        ]}
                        onPress={() =>
                          addMultipleProducts({
                            shop_id: order?.shop_id,
                            products: order?.items,
                          }).then(() => {
                            socketService.logAnalytics({
                              action: 'click',
                              name: 'Reorder',
                              from: 'Orders Screen',
                              params: order?.shop_name || '',
                            });
                            navigation.navigate('Cart');
                          })
                        }
                      >
                        <LinearGradient
                          colors={['#FFAD3A', '#F59E0A']}
                          start={{ x: 0.16, y: -0.4 }}
                          end={{ x: 0.84, y: 1.42 }}
                          style={styles.primaryActionGradient}
                        >
                          <Text style={styles.primaryActionText}>REORDER</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      {/* {order.showRateButton ? (
                        <TouchableOpacity
                          activeOpacity={0.88}
                          style={styles.secondaryActionButton}
                          onPress={openRateExperience}
                        >
                          <Star
                            size={15}
                            color={colors.primary}
                            strokeWidth={2.2}
                          />
                          <Text style={styles.secondaryActionText}>
                            RATE ORDER
                          </Text>
                        </TouchableOpacity>
                      ) : null} */}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#0C0E12',
  },
  headerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 88,
    zIndex: 20,
    overflow: 'hidden',
  },
  headerInner: {
    flex: 1,
    paddingHorizontal: layout.screenPadding,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTitle: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    fontWeight: '800',
    fontStyle: 'italic',
    letterSpacing: -0.35,
  },
  brandTitleAccent: {
    color: colors.primary,
  },
  profileOuter: {
    width: 40,
    height: 40,
    borderRadius: 999,
    padding: 2,
    borderWidth: 2,
    borderColor: 'rgba(255, 173, 58, 0.25)',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 170,
  },
  mainStack: {
    paddingTop: 12,
    paddingHorizontal: layout.screenPadding,
    gap: 34,
  },
  activeSection: {
    gap: 24,
  },
  activeHeaderRow: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.xxl,
    lineHeight: 32,
    fontWeight: '700',
  },
  statusPill: {
    height: 25,
    borderRadius: 999,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 173, 58, 0.2)',
    backgroundColor: 'rgba(255, 173, 58, 0.1)',
    justifyContent: 'center',
  },
  statusPillText: {
    color: colors.primary,
    fontSize: typography.caption,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1,
  },
  activeCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 24,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOpacity: 0.28,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 0 },
  },
  activeTopRow: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeLeftBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  activeImageFrame: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  activeFoodImage: {
    width: '100%',
    height: '100%',
  },
  activeTitleGroup: {
    gap: 0,
  },
  activeRestaurant: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    lineHeight: 28,
    fontWeight: '700',
  },
  activeMeta: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 20,
    fontWeight: '400',
  },
  progressSection: {
    gap: 12,
    marginTop: 30,
  },
  progressLabelsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressLabelActive: {
    color: colors.primary,
    fontSize: typography.captionPlus,
    lineHeight: 16.5,
    fontWeight: '700',
    letterSpacing: 0.55,
  },
  progressLabelInactive: {
    color: colors.textMuted,
    fontSize: typography.captionPlus,
    lineHeight: 16.5,
    fontWeight: '700',
    letterSpacing: 0.55,
  },
  progressTrackWrap: {
    position: 'relative',
    height: 8,
    justifyContent: 'center',
  },
  progressLineBase: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  progressLineActive: {
    position: 'absolute',
    left: 0,
    height: 4,
    borderRadius: 999,
  },
  progressDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  progressDotOne: {
    left: 0,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: colors.background,
  },
  progressDotTwo: {
    left: '50%',
    marginLeft: -4,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: colors.background,
  },
  progressDotThree: {
    right: 0,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: colors.background,
  },
  progressDotDone: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  courierCard: {
    minHeight: 83,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 17,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  courierInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  courierAvatarFrame: {
    width: 50,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  courierAvatar: {
    width: '100%',
    height: '100%',
  },
  courierCaption: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  courierName: {
    color: colors.textPrimary,
    fontSize: typography.md,
    lineHeight: 24,
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: colors.textMuted,
    fontSize: typography.captionPlus,
    lineHeight: 15,
    fontWeight: '700',
  },
  courierActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  courierIconButton: {
    width: 36,
    height: 36,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historySection: {
    gap: 18,
  },
  historyList: {
    gap: 14,
  },
  historyCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    padding: 16,
    overflow: 'hidden',
    gap: 14,
  },
  historyTopRow: {
    flexDirection: 'row',
    gap: 12,
  },
  historyImageFrame: {
    width: 96,
    height: 96,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    overflow: 'hidden',
  },
  historyImage: {
    width: '100%',
    height: '100%',
  },
  historyTextGroup: {
    flex: 1,
    minHeight: 96,
    justifyContent: 'center',
  },
  historyTitle: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    lineHeight: 26,
    fontWeight: '800',
  },
  deliveredRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  deliveredText: {
    color: colors.successBright,
    fontSize: typography.caption,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  metaRow: {
    marginTop: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaDateText: {
    color: colors.textPrimary,
    fontSize: typography.sm,
    lineHeight: 16,
    fontWeight: '700',
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.24)',
  },
  metaAmountText: {
    color: colors.primary,
    fontSize: typography.sm,
    lineHeight: 16,
    fontWeight: '800',
  },
  reviewCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 6,
  },
  reviewStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  reviewText: {
    color: colors.textMuted,
    fontSize: typography.sm,
    lineHeight: 18,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  historyActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  primaryActionButton: {
    height: 46,
    borderRadius: 999,
    overflow: 'hidden',
    shadowColor: '#F59E0B',
    shadowOpacity: Platform.OS === 'ios' ? 0.25 : 0,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  primaryActionHalf: {
    flex: 1,
  },
  primaryActionFull: {
    width: '100%',
  },
  primaryActionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryActionText: {
    color: colors.onPrimaryDark,
    fontSize: typography.smPlus,
    lineHeight: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  secondaryActionButton: {
    flex: 1,
    height: 46,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 173, 58, 0.45)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryActionText: {
    color: colors.primary,
    fontSize: typography.smPlus,
    lineHeight: 18,
    fontWeight: '700',
  },

  /* -- Estimate Notice -- */
  estimateNoticeCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 173, 58, 0.25)',
    backgroundColor: 'rgba(255, 173, 58, 0.08)',
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 30,
  },
  estimateIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  estimateIcon: {
    fontSize: 24,
  },
  estimateTextWrapper: {
    flex: 1,
    gap: 2,
  },
  estimateLabel: {
    color: colors.primary,
    fontSize: typography.caption,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  estimateValue: {
    color: colors.textPrimary,
    fontSize: typography.body,
    lineHeight: 20,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: layout.screenPadding,
  },
  emptyContent: {
    alignItems: 'center',
    gap: 20,
  },
  emptyIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    marginBottom: 12,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: typography.title,
    fontWeight: '700',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 280,
  },
  emptyActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  emptyButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyButtonText: {
    color: colors.black,
    fontSize: typography.md,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  emptySecondaryButtonNew: {
    height: 52,
    borderRadius: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  emptySecondaryButtonTextNew: {
    color: colors.textPrimary,
    fontSize: typography.md,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default OrdersScreen;
