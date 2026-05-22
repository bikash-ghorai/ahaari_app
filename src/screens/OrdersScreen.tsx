import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AlertTriangle, Bell, CircleCheck, Menu, MessageCircle, Phone, Search, Star } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, typography } from '../constants/theme';
import type { RootStackParamList, RootTabParamList } from '../types/navigation';
import { useWeatherAlert } from '../contexts/WeatherAlertContext';
import WeatherAlertTooltip from '../components/WeatherAlertTooltip';

type HistoryOrder = {
  id: string;
  restaurant: string;
  date: string;
  total: string;
  image: string;
  quote?: string;
  showRateButton?: boolean;
};

const historyOrders: HistoryOrder[] = [
  {
    id: 'burger-loft',
    restaurant: 'The Burger Loft',
    date: 'Oct 24',
    total: '$42.50',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80',
    quote: '"Amazing truffle fries as always!"',
  },
  {
    id: 'napoli-pizzeria',
    restaurant: 'Napoli Pizzeria',
    date: 'Oct 21',
    total: '$18.90',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80',
    showRateButton: true,
  },
  {
    id: 'green-garden',
    restaurant: 'Green Garden',
    date: 'Oct 15',
    total: '$31.20',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80',
    showRateButton: true,
  },
];

const GlassLayer = ({ radius, tint = 'rgba(12, 14, 18, 0.35)' }: { radius: number; tint?: string }) => (
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
  const navigation = useNavigation<OrdersScreenNavigationProp>();
  const shimmerValue = useRef(new Animated.Value(0)).current;

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

  const openOrderDetails = (orderId?: string) => {
    navigation.navigate('OrderDetails', orderId ? { orderId } : undefined);
  };

  const openRateExperience = () => {
    navigation.navigate('RateExperience');
  };

  const shimmerTranslate = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, 260],
  });

  const { isBadWeather, show } = useWeatherAlert();

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <WeatherAlertTooltip />
      <View style={{
        paddingHorizontal: layout.screenPadding,
        paddingTop: 8,
        paddingBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <View style={{ gap: 4 }}>
          <Text style={{
            color: colors.textMuted,
            fontSize: typography.caption,
            letterSpacing: 1,
            textTransform: 'uppercase'
          }}>Today's picks</Text>
          <Text style={{
            color: colors.textPrimary,
            fontSize: typography.xl,
            fontWeight: '700',
            letterSpacing: -0.3
          }}>Curated Cart</Text>
        </View>

        <View style={{
          flexDirection: 'row',
          gap: 12
        }}>
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
              overflow: 'hidden'
            }}
            onPress={() => navigation.navigate('Search')}
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
              overflow: 'hidden'
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
                <View style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  width: 8,
                  height: 8,
                  backgroundColor: colors.primary,
                  borderRadius: 4
                }} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainStack}>
          <View style={styles.activeSection}>
            <View style={styles.activeHeaderRow}>
              <Text style={styles.sectionTitle}>Active Order</Text>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>In Progress</Text>
              </View>
            </View>

            <View style={styles.activeCard}>
              <GlassLayer radius={16} tint="rgba(255, 255, 255, 0.03)" />

              <View style={styles.activeTopRow}>
                <View style={styles.activeLeftBlock}>
                  <View style={styles.activeImageFrame}>
                    <Image
                      source={{
                        uri: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=300&q=80',
                      }}
                      style={styles.activeFoodImage}
                    />
                  </View>

                  <View style={styles.activeTitleGroup}>
                    <Text style={styles.activeRestaurant}>Umami Sushi Garden</Text>
                    <Text style={styles.activeMeta}>Order #9921  -  12 mins away</Text>
                  </View>
                </View>
              </View>

              <View style={styles.progressSection}>
                <View style={styles.progressLabelsRow}>
                  <Text style={styles.progressLabelActive}>Preparing</Text>
                  <Text style={styles.progressLabelActive}>On the Way</Text>
                  <Text style={styles.progressLabelInactive}>Arrived</Text>
                </View>

                <View style={styles.progressTrackWrap}>
                  <View style={styles.progressLineBase} />
                  <LinearGradient
                    colors={['#FFAD3A', '#F59E0A']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.progressLineActive}
                  />

                  <View style={[styles.progressDot, styles.progressDotOne, styles.progressDotDone]} />
                  <View style={[styles.progressDot, styles.progressDotTwo, styles.progressDotDone]} />
                  <View style={[styles.progressDot, styles.progressDotThree]} />
                </View>
              </View>

              <View style={styles.courierCard}>
                <View style={styles.courierInfoRow}>
                  <View style={styles.courierAvatarFrame}>
                    <Image
                      source={{
                        uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
                      }}
                      style={styles.courierAvatar}
                    />
                  </View>

                  <View>
                    <Text style={styles.courierCaption}>Your Courier</Text>
                    <Text style={styles.courierName}>Marco V.</Text>
                    <View style={styles.ratingRow}>
                      <Star size={12} color={colors.primary} fill={colors.primary} strokeWidth={1.8} />
                      <Text style={styles.ratingText}>4.9</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.courierActions}>
                  <TouchableOpacity style={styles.courierIconButton} activeOpacity={0.88}>
                    <MessageCircle size={16} color="#FFFFFF" strokeWidth={2} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.courierIconButton} activeOpacity={0.88}>
                    <Phone size={16} color="#FFFFFF" strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>Order History</Text>

            <View style={styles.historyList}>
              {historyOrders.map(order => (
                <View key={order.id} style={styles.historyCard}>
                  <GlassLayer radius={16} tint="rgba(255, 255, 255, 0.03)" />

                  <TouchableOpacity
                    activeOpacity={0.88}
                    style={styles.historyTopRow}
                    onPress={() => openOrderDetails(order.id)}
                  >
                    <View style={styles.historyImageFrame}>
                      <Image source={{ uri: order.image }} style={styles.historyImage} />
                    </View>

                    <View style={styles.historyTextGroup}>
                      <Text style={styles.historyTitle} numberOfLines={1}>
                        {order.restaurant}
                      </Text>

                      <View style={styles.deliveredRow}>
                        <CircleCheck size={14} color={colors.successBright} strokeWidth={2.1} />
                        <Text style={styles.deliveredText}>DELIVERED</Text>
                      </View>

                      <View style={styles.metaRow}>
                        <Text style={styles.metaDateText}>{order.date}</Text>
                        <View style={styles.metaDot} />
                        <Text style={styles.metaAmountText}>{order.total}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {order.quote ? (
                    <View style={styles.reviewCard}>
                      <View style={styles.reviewStarsRow}>
                        <Star size={14} color={colors.primary} fill={colors.primary} strokeWidth={2.2} />
                        <Star size={14} color={colors.primary} fill={colors.primary} strokeWidth={2.2} />
                        <Star size={14} color={colors.primary} fill={colors.primary} strokeWidth={2.2} />
                        <Star size={14} color={colors.primary} fill={colors.primary} strokeWidth={2.2} />
                        <Star size={14} color={colors.primary} fill={colors.primary} strokeWidth={2.2} />
                      </View>
                      <Text style={styles.reviewText}>{order.quote}</Text>
                    </View>
                  ) : null}

                  <View style={styles.historyActionsRow}>
                    <TouchableOpacity
                      activeOpacity={0.88}
                      style={[
                        styles.primaryActionButton,
                        order.showRateButton ? styles.primaryActionHalf : styles.primaryActionFull,
                      ]}
                      onPress={() => openOrderDetails(order.id)}
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

                    {order.showRateButton ? (
                      <TouchableOpacity
                        activeOpacity={0.88}
                        style={styles.secondaryActionButton}
                        onPress={openRateExperience}
                      >
                        <Star size={15} color={colors.primary} strokeWidth={2.2} />
                        <Text style={styles.secondaryActionText}>RATE ORDER</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              ))}
            </View>
          </View>
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
    height: 288,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 24,
    gap: 31,
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
    width: '69%',
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
  },
  progressDotTwo: {
    left: '47%',
    marginLeft: -4,
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
    fontWeight: '900',
    letterSpacing: 1,
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
});

export default OrdersScreen;
