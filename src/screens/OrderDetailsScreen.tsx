/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import {
  CheckCircle2,
  CookingPot,
  Headset,
  Phone,
  Rocket,
  Star,
  UtensilsIcon,
  MapPin,
  AlertTriangle,
  InfoIcon,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

import { colors, layout, typography } from '../constants/theme';
import type { RootStackParamList } from '../types/navigation';
import Header from '../components/Header';
import { useDispatch } from '../redux/store';
import { cancelOrder, getOrderDetails } from '../redux/app/appAction';
import { IOrderDetails } from '../types';
import { ImagePath } from '../constants/ImagePath';
import { Constant } from '../constants/Constant';
import {
  currencyFormate,
  handleCall,
  handleWhatsapp,
  statusColors,
} from '../utils/helper';
import { showToaster } from '../utils/toaster';
import FastImage from 'react-native-fast-image';

const OrderDetailsScreen = () => {
  const dispatch = useDispatch();
  const route = useRoute<RouteProp<RootStackParamList, 'OrderDetails'>>();
  const orderId = route.params?.orderId ?? '';

  const [orderDetails, setOrderDetails] = useState<IOrderDetails | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mapRef = React.useRef<any>(null);

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderDetails(orderId))
        .unwrap()
        .then(res => {
          setOrderDetails(res.data);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const handleCancelOrder = () => {
    setShowCancelModal(true);
  };

  const handleSubmitCancellation = () => {
    if (!cancellationReason.trim()) {
      return;
    }
    setIsSubmitting(true);
    dispatch(cancelOrder({ order_id: orderId, reason: cancellationReason }))
      .unwrap()
      .then(({ message }) => {
        console.log('message', message);
        showToaster(message);
        dispatch(getOrderDetails(orderId))
          .unwrap()
          .then(res => {
            setOrderDetails(res.data);
          });
      })
      .catch(error => {
        console.log('error', error);
        showToaster(error);
      })
      .finally(() => {
        setShowCancelModal(false);
        setCancellationReason('');
        setIsSubmitting(false);
      });
  };

  const cancelBtnDisabled =
    !cancellationReason.trim() ||
    isSubmitting ||
    (orderDetails?.status !== 'Processing' &&
      orderDetails?.status !== 'Pending' &&
      orderDetails?.payment_type === 'COD');

  const isCancelOrderBtnShow =
    orderDetails?.status !== 'Cancelled' &&
    orderDetails?.status !== 'Delivered' &&
    orderDetails?.status !== 'Undelivered';

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <Header title="Order Details" showNotificationButton={true} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {orderDetails?.status === 'Preparing' ? (
          <View style={styles.preparingCard}>
            <View style={styles.preparingCircle}>
              <CookingPot size={36} color={colors.primary} strokeWidth={2} />
              {/* <FastImage
                source={ImagePath.preparing}
                style={{
                  width: 64,
                  height: 64,
                }}
              /> */}
              <Text style={styles.preparingLabel}>PREPARING</Text>
            </View>

            <Text style={styles.preparingTitle}>
              {orderDetails?.message?.title || 'Chef is cooking!'}
            </Text>
            <Text style={styles.preparingSubtitle}>
              {orderDetails?.message?.description ||
                'Hang tight! Your delicious meal is being prepared with love and care.'}
            </Text>
          </View>
        ) : orderDetails?.status === 'On The Way' ? (
          <View style={styles.onwayTopCard}>
            {orderDetails?.shop_coordinate &&
            orderDetails?.delivery_coordinate ? (
              <View style={styles.mapViewContainer}>
                <MapView
                  ref={mapRef}
                  provider={PROVIDER_GOOGLE}
                  style={styles.mapView}
                  initialRegion={{
                    latitude: parseFloat(
                      orderDetails.shop_coordinate.latitude as string,
                    ),
                    longitude: parseFloat(
                      orderDetails.shop_coordinate.longitude as string,
                    ),
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001,
                  }}
                >
                  {/* Shop/Origin Marker */}
                  <Marker
                    coordinate={{
                      latitude: parseFloat(
                        orderDetails.shop_coordinate.latitude as string,
                      ),
                      longitude: parseFloat(
                        orderDetails.shop_coordinate.longitude as string,
                      ),
                    }}
                    title="Restaurant"
                    description={orderDetails.shop_name}
                  >
                    <View style={styles.markerOrigin}>
                      <MapPin
                        size={40}
                        color={colors.primary}
                        fill={'rgba(255, 173, 58, 0.2)'}
                        strokeWidth={1.5}
                      />
                    </View>
                  </Marker>

                  {/* Delivery/Destination Marker */}
                  <Marker
                    coordinate={{
                      latitude: parseFloat(
                        orderDetails.delivery_coordinate.latitude as string,
                      ),
                      longitude: parseFloat(
                        orderDetails.delivery_coordinate.longitude as string,
                      ),
                    }}
                    title="Delivery Location"
                    description={orderDetails.delivery_address}
                  >
                    <View style={styles.markerOrigin}>
                      <MapPin
                        size={40}
                        color={colors.primary}
                        fill={'rgba(255, 173, 58, 0.2)'}
                        strokeWidth={1.5}
                      />
                    </View>
                  </Marker>

                  {/* Direction Route */}
                  <MapViewDirections
                    origin={{
                      latitude: parseFloat(
                        orderDetails.shop_coordinate.latitude as string,
                      ),
                      longitude: parseFloat(
                        orderDetails.shop_coordinate.longitude as string,
                      ),
                    }}
                    destination={{
                      latitude: parseFloat(
                        orderDetails.delivery_coordinate.latitude as string,
                      ),
                      longitude: parseFloat(
                        orderDetails.delivery_coordinate.longitude as string,
                      ),
                    }}
                    apikey={Constant.MapKey}
                    strokeWidth={4}
                    strokeColor={colors.primary}
                    optimizeWaypoints={true}
                    onStart={() => {
                      console.log('Route calculation started');
                    }}
                    onReady={result => {
                      if (mapRef.current) {
                        mapRef.current.fitToCoordinates(result.coordinates, {
                          edgePadding: {
                            right: 20,
                            bottom: 150,
                            left: 20,
                            top: 50,
                          },
                        });
                      }
                    }}
                    onError={errorMessage => {
                      console.log('Route error:', errorMessage);
                    }}
                  />
                </MapView>
                <View style={styles.onwayMapDim} />
              </View>
            ) : (
              <View style={styles.mapErrorContainer}>
                <Text style={styles.mapErrorText}>
                  Location data unavailable
                </Text>
              </View>
            )}

            <View style={styles.arrivalCard}>
              <View>
                <Text style={styles.arrivalLabel}>ESTIMATED ARRIVAL</Text>
                <Text style={styles.arrivalValue}>
                  Arriving in {orderDetails?.estimate_delivery_time} mins
                </Text>
              </View>

              {orderDetails?.is_vip && (
                <View style={styles.priorityPill}>
                  <Rocket size={12} color="#FFAD3A" strokeWidth={2.2} />
                  <Text style={styles.priorityText}>PRIORITY</Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.summaryCard}>
            <View style={styles.summaryTopBlock}>
              <Text style={styles.orderNumber}>
                ORDER #{orderDetails?.order_id_label}
              </Text>
              {orderDetails?.status ? (
                <View
                  style={[
                    styles.arrivedPill,
                    {
                      backgroundColor: statusColors[orderDetails.status] + '22',
                      borderColor: statusColors[orderDetails.status] + '35',
                    },
                  ]}
                >
                  <CheckCircle2
                    size={12}
                    color={statusColors[orderDetails.status]}
                    strokeWidth={2.6}
                  />
                  <Text
                    style={[
                      styles.arrivedText,
                      { color: statusColors[orderDetails.status] },
                    ]}
                  >
                    {orderDetails.status.toUpperCase()}
                  </Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.restaurantName}>{orderDetails?.shop_name}</Text>
            <Text style={styles.deliveryTime}>{orderDetails?.date}</Text>

            <View style={styles.summaryDivider} />

            <View style={styles.courierRow}>
              <View style={styles.courierIconWrap}>
                <UtensilsIcon
                  size={18}
                  color={colors.primary}
                  strokeWidth={2.2}
                />
              </View>
              <View style={{ width: '80%' }}>
                <Text style={styles.courierTitle}>
                  {orderDetails?.message?.title}
                </Text>
                <Text style={styles.courierSubtitle}>
                  {orderDetails?.message?.description}
                </Text>
              </View>
            </View>
          </View>
        )}

        {orderDetails?.partner_info ? (
          <View style={styles.courierCard}>
            <View style={styles.courierInfoRow}>
              <View style={styles.courierAvatarFrame}>
                <Image
                  source={
                    orderDetails?.partner_info?.picture
                      ? {
                          uri:
                            Constant.ImageURL +
                            orderDetails.partner_info.picture,
                        }
                      : ImagePath.noProfile
                  }
                  style={styles.courierAvatar}
                />
              </View>

              <View>
                <Text style={styles.courierCaption}>Your Delivery Partner</Text>
                <Text style={styles.courierName}>
                  {orderDetails?.partner_info?.name}
                </Text>
                <View style={styles.ratingRow}>
                  <Star
                    size={12}
                    color={colors.primary}
                    fill={colors.primary}
                    strokeWidth={1.8}
                  />
                  <Text style={styles.ratingText}>
                    {orderDetails?.partner_info?.rating || '0.0'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.courierActions}>
              <TouchableOpacity
                style={styles.courierIconButton}
                activeOpacity={0.88}
                onPress={() => {
                  handleCall(orderDetails?.partner_info?.contact || '');
                }}
              >
                <Phone size={16} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        <View style={styles.itemsSection}>
          <Text style={styles.sectionLabel}>ORDER ITEMS</Text>

          <View style={styles.itemsList}>
            {orderDetails?.items && orderDetails?.items.length > 0
              ? orderDetails.items.map((item, index) => (
                  <View key={index} style={styles.itemCard}>
                    <LinearGradient
                      pointerEvents="none"
                      colors={[
                        'rgba(255, 255, 255, 0.01)',
                        'rgba(255, 255, 255, 0)',
                      ]}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={styles.itemCardHighlight}
                    />

                    <View style={styles.itemRow}>
                      <View style={styles.itemImageWrap}>
                        <Image
                          source={
                            item?.image
                              ? { uri: Constant?.ImageURL + item.image }
                              : ImagePath.noProductPlaceholder
                          }
                          style={styles.itemImage}
                        />
                      </View>

                      <View style={styles.itemTextColumn}>
                        <Text style={styles.itemTitle}>{item?.name}</Text>
                        <Text style={styles.itemSubtitle} numberOfLines={1}>
                          {item?.description}
                        </Text>
                      </View>

                      <View style={styles.itemPriceColumn}>
                        <Text style={styles.itemPrice}>
                          {currencyFormate(item?.price, 0)}
                        </Text>
                        <Text style={styles.itemQty}>
                          Qty: {item?.quantity}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))
              : null}
          </View>
        </View>

        {orderDetails?.instruction ? (
          <View style={styles.estimateNoticeCard}>
            <View style={styles.estimateTextWrapper}>
              <Text style={styles.estimateLabel}>Order Instructions</Text>
              <Text style={styles.estimateValue}>
                {orderDetails?.instruction}
              </Text>
            </View>
          </View>
        ) : null}

        <View style={styles.breakdownCard}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Subtotal</Text>
            <Text style={styles.breakdownValue}>
              {currencyFormate(orderDetails?.sub_total || 0, 2)}
            </Text>
          </View>

          <View style={styles.breakdownRow}>
            <View style={styles.feeLabelGroup}>
              <Text style={styles.breakdownLabel}>Tax</Text>
            </View>
            <Text style={styles.breakdownValue}>
              {currencyFormate(orderDetails?.tax || 0, 2)}
            </Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Delivery Fee</Text>
            <Text style={styles.breakdownValue}>
              {currencyFormate(orderDetails?.delivery_charge || 0, 2)}
            </Text>
          </View>

          {orderDetails?.extra_charges && orderDetails?.extra_charges.length > 0
            ? orderDetails?.extra_charges.map((item, index) => {
                return (
                  <View style={styles.breakdownRow} key={index}>
                    <Text style={styles.breakdownLabel}>{item?.label}</Text>
                    <Text style={styles.breakdownValue}>
                      {currencyFormate(item?.amount || 0, 2)}
                    </Text>
                  </View>
                );
              })
            : null}

          {orderDetails?.discount ? (
            <View style={styles.breakdownRow}>
              <Text style={styles.discountLabel}>Discount</Text>
              <Text style={styles.discountValue}>
                -{currencyFormate(orderDetails?.discount || 0, 2)}
              </Text>
            </View>
          ) : null}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalCaption}>TOTAL AMOUNT</Text>
              <Text style={styles.totalValue}>
                {currencyFormate(orderDetails?.total || 0, 2)}
              </Text>
            </View>

            <View style={styles.paymentMethodWrapper}>
              <View
                style={[
                  styles.paymentBadge,
                  orderDetails?.payment_type === 'COD'
                    ? styles.paymentCOD
                    : styles.paymentOnline,
                ]}
              >
                <Text style={styles.paymentBadgeText}>
                  {orderDetails?.payment_type === 'COD' ? 'COD' : 'Online'}
                </Text>
              </View>
              <Text style={styles.paymentLabel}>Payment Method</Text>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          {isCancelOrderBtnShow && (
            <TouchableOpacity
              activeOpacity={0.92}
              style={styles.reorderButton}
              onPress={handleCancelOrder}
            >
              <LinearGradient
                colors={['#FFB53A', '#F59E0B']}
                start={{ x: 0, y: 0.4 }}
                end={{ x: 1, y: 0.6 }}
                style={styles.reorderGradient}
              >
                <InfoIcon size={20} color="#2A1700" strokeWidth={2.2} />
                <Text style={styles.reorderText}>Cancel Order</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.supportButton,
              { width: isCancelOrderBtnShow ? '48%' : '100%' },
            ]}
            onPress={() => {
              handleWhatsapp(
                'Hello, I need help with my order id: ' +
                  orderDetails?.order_id_label,
              );
            }}
          >
            <Headset size={18} color="#E5E7EB" strokeWidth={2.1} />
            <Text style={styles.supportButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Cancel Order Modal */}
      <Modal
        visible={showCancelModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cancel Order</Text>
              <Text style={styles.modalSubtitle}>
                Please tell us why you want to cancel this order
              </Text>
            </View>

            <View style={styles.modalContent}>
              <Text style={styles.reasonLabel}>Reason for Cancellation *</Text>
              <TextInput
                style={styles.reasonInput}
                placeholder="Tell us your reason..."
                placeholderTextColor={colors.textMuted}
                value={cancellationReason}
                onChangeText={setCancellationReason}
                multiline={true}
                numberOfLines={4}
                editable={!isSubmitting}
              />

              {orderDetails?.status === 'Processing' ||
              orderDetails?.status === 'Pending' ? null : (
                <View style={styles.weatherNotice}>
                  <View style={styles.weatherIconWrap}>
                    <AlertTriangle size={16} color={colors.accentCoral} />
                  </View>
                  <View style={styles.weatherTextGroup}>
                    <Text style={styles.weatherTitle}>Important</Text>
                    <Text style={styles.weatherSubtitle}>
                      {orderDetails?.payment_type === 'Online'
                        ? 'If you cancel now, you can not get any refund.'
                        : 'You can not cancel this order after it is accepted by the restaurant.'}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => {
                    setShowCancelModal(false);
                    setCancellationReason('');
                  }}
                  activeOpacity={0.85}
                  disabled={isSubmitting}
                >
                  <Text style={styles.modalCancelBtnText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalSubmitBtn,
                    cancelBtnDisabled && styles.modalSubmitBtnDisabled,
                  ]}
                  onPress={handleSubmitCancellation}
                  activeOpacity={0.85}
                  disabled={cancelBtnDisabled}
                >
                  <LinearGradient
                    colors={['#FF6B6B', '#FF5252']}
                    start={{ x: 0, y: 0.4 }}
                    end={{ x: 1, y: 0.6 }}
                    style={styles.modalSubmitBtnGradient}
                  >
                    <Text style={styles.modalSubmitBtnText}>
                      {isSubmitting ? 'Cancelling...' : 'Submit'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
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
  },
  topGlow: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 280,
    height: 380,
  },
  bottomGlow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -120,
    height: 340,
  },
  header: {
    height: 58,
    marginTop: 4,
    paddingHorizontal: layout.screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    lineHeight: 28,
    fontWeight: '800',
    letterSpacing: -1,
    marginLeft: -22,
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrap: {
    width: 30,
    height: 30,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    backgroundColor: colors.accentTan,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 18,
    paddingBottom: 48,
    gap: 32,
  },
  summaryCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 24,
    overflow: 'hidden',
  },
  summaryCardGlow: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 220,
    height: 220,
  },
  summaryTopBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderNumber: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  restaurantName: {
    marginTop: 4,
    color: colors.textPrimary,
    fontSize: typography.displayCard,
    lineHeight: 48,
    fontWeight: '700',
  },
  deliveryTime: {
    marginTop: 6,
    color: colors.textMuted,
    fontSize: typography.bodyPlus,
    lineHeight: 22,
    fontWeight: '400',
  },
  arrivedPill: {
    height: 32,
    borderRadius: 999,
    paddingHorizontal: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  arrivedText: {
    color: colors.successTeal,
    fontSize: typography.caption,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  summaryDivider: {
    marginTop: 20,
    marginBottom: 16,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  courierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  courierIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  courierTitle: {
    color: colors.textPrimary,
    fontSize: typography.bodyPlus,
    lineHeight: 22,
    fontWeight: '600',
  },
  courierSubtitle: {
    color: colors.textMuted,
    fontSize: typography.smPlus,
    lineHeight: 20,
    fontWeight: '400',
  },
  preparingCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 22,
    alignItems: 'center',
    overflow: 'hidden',
  },
  preparingCircle: {
    width: 160,
    height: 160,
    borderRadius: 999,
    borderWidth: 5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  preparingLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  preparingTitle: {
    marginTop: 18,
    color: colors.textPrimary,
    fontSize: typography.displayXl,
    lineHeight: 42,
    fontWeight: '700',
    letterSpacing: -1,
    textAlign: 'center',
  },
  preparingSubtitle: {
    marginTop: 8,
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: typography.bodyPlus,
    lineHeight: 22,
    fontWeight: '400',
    maxWidth: 334,
  },
  onwayTopCard: {
    marginHorizontal: -24,
    height: 380,
    position: 'relative',
    borderRadius: 16,
  },
  mapViewContainer: {
    height: 380,
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  mapErrorContainer: {
    height: 380,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(12, 14, 18, 0.8)',
  },
  mapErrorText: {
    color: colors.textMuted,
    fontSize: typography.body,
    fontWeight: '500',
  },
  markerOrigin: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerDestination: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  onwayMapImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  onwayMapDim: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(12, 14, 18, 0.52)',
  },
  routeLineA: {
    position: 'absolute',
    left: 122,
    top: 108,
    width: 194,
    height: 184,
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderColor: colors.primary,
    borderTopLeftRadius: 152,
  },
  routeLineB: {
    position: 'absolute',
    left: 116,
    top: 182,
    width: 12,
    height: 74,
    borderLeftWidth: 5,
    borderColor: colors.primary,
  },
  routeDotStart: {
    position: 'absolute',
    left: 108,
    top: 244,
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  routeDotEnd: {
    position: 'absolute',
    right: 48,
    top: 108,
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  arrivalCard: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 32,
    minHeight: 82,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.23)',
    backgroundColor: 'rgba(12, 14, 18, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  arrivalLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1,
  },
  arrivalValue: {
    marginTop: 2,
    color: colors.textPrimary,
    fontSize: typography.xl,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  priorityPill: {
    height: 34,
    borderRadius: 999,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 173, 58, 0.45)',
    backgroundColor: 'rgba(255, 173, 58, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priorityText: {
    color: colors.primary,
    fontSize: typography.caption,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 0.8,
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
  itemsSection: {
    gap: 16,
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: typography.sm,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 2.4,
  },
  itemsList: {
    gap: 12,
  },
  itemCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    overflow: 'hidden',
  },
  itemCardHighlight: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  itemRow: {
    minHeight: 98,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 18,
  },
  itemImageWrap: {
    width: 74,
    height: 74,
    borderRadius: 12,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemTextColumn: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    lineHeight: 28,
    fontWeight: '700',
  },
  itemSubtitle: {
    color: colors.textMuted,
    fontSize: typography.sm,
    lineHeight: 18,
    fontWeight: '400',
  },
  itemPriceColumn: {
    alignItems: 'flex-end',
    gap: 2,
  },
  itemPrice: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    lineHeight: 28,
    fontWeight: '700',
  },
  itemQty: {
    color: colors.textMuted,
    fontSize: typography.sm,
    lineHeight: 18,
    fontWeight: '400',
  },
  breakdownCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    overflow: 'hidden',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 22,
    gap: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  feeLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  breakdownLabel: {
    color: colors.textMuted,
    fontSize: typography.md,
    lineHeight: 24,
    fontWeight: '400',
  },
  breakdownValue: {
    color: colors.textPrimary,
    fontSize: typography.md,
    lineHeight: 24,
    fontWeight: '500',
  },
  discountLabel: {
    color: colors.primary,
    fontSize: typography.md,
    lineHeight: 24,
    fontWeight: '500',
  },
  discountValue: {
    color: colors.primary,
    fontSize: typography.md,
    lineHeight: 24,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginTop: 2,
    marginBottom: 4,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  totalCaption: {
    color: colors.textMuted,
    fontSize: typography.sm,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 2.4,
    marginBottom: 2,
  },
  totalValue: {
    color: colors.primary,
    fontSize: typography.displayXl,
    lineHeight: 50,
    fontWeight: '700',
    letterSpacing: -1,
  },
  paymentMethod: {
    color: colors.textMuted,
    fontSize: typography.sm,
    lineHeight: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  paymentMethodWrapper: {
    alignItems: 'flex-end',
    gap: 4,
  },
  paymentBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  paymentCOD: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  paymentOnline: {
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  paymentBadgeText: {
    fontSize: typography.md,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: colors.textPrimary,
  },
  paymentLabel: {
    color: colors.textMuted,
    fontSize: typography.captionPlus,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  reorderButton: {
    height: 60,
    borderRadius: 18,
    overflow: 'hidden',
    width: '48%',
  },
  reorderGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  reorderText: {
    color: colors.onPrimaryDark,
    fontSize: typography.bodyPlus,
    lineHeight: 28,
    fontWeight: '700',
  },
  supportButton: {
    width: '48%',
    height: 60,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
    overflow: 'hidden',
  },
  supportButtonText: {
    color: colors.textSecondary,
    fontSize: typography.bodyPlus,
    lineHeight: 28,
    fontWeight: '600',
  },

  /* -- Cancel Modal -- */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: layout.screenPadding,
    paddingTop: 28,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHeader: {
    marginBottom: 24,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: typography.xxl,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  modalSubtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    fontWeight: '400',
  },
  modalContent: {
    gap: 16,
  },
  reasonLabel: {
    color: colors.primary,
    fontSize: typography.caption,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  reasonInput: {
    minHeight: 100,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(12, 14, 18, 0.6)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
    fontWeight: '500',
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalCancelBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCancelBtnText: {
    color: colors.textSecondary,
    fontSize: typography.md,
    fontWeight: '700',
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  modalSubmitBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalSubmitBtnDisabled: {
    opacity: 0.5,
  },
  modalSubmitBtnGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: typography.md,
    fontWeight: '700',
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  weatherNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 122, 89, 0.35)',
    backgroundColor: 'rgba(255, 122, 89, 0.12)',
  },
  weatherIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 122, 89, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 122, 89, 0.4)',
  },
  weatherTextGroup: {
    flex: 1,
    gap: 2,
  },
  weatherTitle: {
    color: colors.accentCoral,
    fontSize: typography.smPlus,
    fontWeight: '700',
  },
  weatherSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.captionPlus,
    lineHeight: 16,
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
});

export default OrderDetailsScreen;
