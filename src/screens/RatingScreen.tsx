/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Check,
  Clock,
  Gift,
  HelpCircle,
  Phone,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Star,
  ThumbsDown,
  ThumbsUp
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, typography } from '../constants/theme';
import type { RootStackParamList } from '../types/navigation';
import { Constant } from '../constants/Constant';
import { ImagePath } from '../constants/ImagePath';
import { handleCall } from '../utils/helper';
import { showToaster } from '../utils/toaster';
import { useDispatch, useSelector } from '../redux/store';
import { getOrderReviews, getPendingRatings, submitOrderReview } from '../redux/app/appAction';
import { IOrderReviewData, ISubmitOrderReviewReq } from '../types';
import socketService from '../utils/socket-service';
import RazorpayCheckout from 'react-native-razorpay';

const GlassLayer = ({
  radius,
  tint = 'rgba(255, 255, 255, 0.03)',
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

interface OrderPreviewItem {
  id: string;
  variant_id?: string;
  name: string;
  qty: number | string;
  isVeg: boolean;
}

const VegNonVegBadge = ({ isVeg }: { isVeg: boolean }) => (
  <View
    style={[
      styles.vegBadgeOuter,
      { borderColor: isVeg ? '#22C55E' : '#EF4444' },
    ]}
  >
    <View
      style={[
        styles.vegBadgeInner,
        {
          backgroundColor: isVeg ? '#22C55E' : '#EF4444',
          borderRadius: isVeg ? 6 : 1,
        },
      ]}
    />
  </View>
);

type RatingStarsProps = {
  value: number;
  onChange: (next: number) => void;
  label: string;
  size?: number;
};

const RatingStars = ({
  value,
  onChange,
  label,
  size = 34,
}: RatingStarsProps) => {
  const stars = useMemo(() => [1, 2, 3, 4, 5], []);

  return (
    <View
      style={styles.starsRow}
      accessibilityRole="adjustable"
      accessibilityLabel={label}
    >
      {stars.map(star => {
        const active = value >= star;

        return (
          <TouchableOpacity
            key={`star-${label}-${star}`}
            activeOpacity={0.82}
            onPress={() => onChange(star)}
            style={styles.starTouch}
            accessibilityRole="button"
            accessibilityLabel={`${label} ${star} stars`}
          >
            <Star
              size={size}
              color={active ? colors.primary : 'rgba(255, 255, 255, 0.22)'}
              fill={active ? colors.primary : 'transparent'}
              strokeWidth={active ? 1.8 : 1.6}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const RESTAURANT_TAGS = [
  'Super Tasty 🍲',
  'Fresh & Hot 🔥',
  'Great Portion 🍱',
  'Value for Money 💰',
  'Authentic Flavors ✨',
];

const DELIVERY_TAGS = [
  'Super Fast ⚡',
  'Polite & Friendly 😊',
  'Followed Instructions 📍',
  'Careful Handling 📦',
  'Safe Driving 🛵',
];

const TIP_OPTIONS = [10, 20, 30];

const RatingScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'RateExperience'>>();
  const route = useRoute<RouteProp<RootStackParamList, 'RateExperience'>>();
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);

  const passedOrderId = route.params?.orderId;

  const [reviewData, setReviewData] = useState<IOrderReviewData | null>(null);

  // Ratings State
  const [foodRating, setFoodRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [packagingFeedback, setPackagingFeedback] = useState<'good' | 'bad' | null>('good');
  const [foodFeedback, setFoodFeedback] = useState('');
  const [deliveryFeedback, setDeliveryFeedback] = useState('');

  // Selected compliment chips
  const [selectedFoodTags, setSelectedFoodTags] = useState<string[]>([]);
  const [selectedDeliveryTags, setSelectedDeliveryTags] = useState<string[]>([]);

  // Product Likes/Dislikes State
  const [itemRatings, setItemRatings] = useState<Record<string, 'like' | 'dislike' | null>>({});

  const toggleItemRating = (itemKey: string, type: 'like' | 'dislike') => {
    setItemRatings(prev => ({
      ...prev,
      [itemKey]: prev[itemKey] === type ? null : type,
    }));
  };

  // Tip State
  const [selectedTip, setSelectedTip] = useState<number | 'other' | null>(null);
  const [customTip, setCustomTip] = useState('');

  const scrollViewRef = useRef<ScrollView>(null);
  const tipSectionY = useRef<number>(0);
  const isDeliveryInputFocused = useRef(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      e => {
        setKeyboardHeight(e.endCoordinates.height);
        if (isDeliveryInputFocused.current) {
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 100);
        }
      },
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      },
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Fetch order review details if orderId is available
  useEffect(() => {
    if (passedOrderId) {
      dispatch(getOrderReviews(passedOrderId))
        .unwrap()
        .then(({ data }) => {
          if (data) {
            setReviewData(data);
            if (data.shop_info?.rating && Number(data.shop_info.rating) > 0) {
              setFoodRating(Number(data.shop_info.rating));
            }
            if (data.shop_info?.feedback) {
              setFoodFeedback(data.shop_info.feedback);
            }
            if (
              data.delivery_partner_info?.rating &&
              Number(data.delivery_partner_info.rating) > 0
            ) {
              setDeliveryRating(Number(data.delivery_partner_info.rating));
            }
            if (data.delivery_partner_info?.feedback) {
              setDeliveryFeedback(data.delivery_partner_info.feedback);
            }
          }
        })
        .catch(() => {
          // Keep fallback
        });
    }
  }, [dispatch, passedOrderId]);

  // Derived display values
  const restaurantName = reviewData?.shop_info?.shop_name || '';
  const restaurantLocality = reviewData?.delivered_at ? `Delivered: ${reviewData.delivered_at}` : '';
  const restaurantImage = reviewData?.shop_info?.shop_image
    ? { uri: Constant.ImageURL + reviewData?.shop_info?.shop_image }
    : ImagePath.noShopPlaceholder;

  const orderNumber = reviewData?.order_id || passedOrderId || '';

  const orderItems: OrderPreviewItem[] = useMemo(() => {
    if (reviewData?.products && reviewData.products.length > 0) {
      return reviewData.products.map((item: any, idx: number) => ({
        id: String(item.variant_id || item.product_id || item.id || `${item.name || 'item'}-${idx}`),
        variant_id: String(item.variant_id || item.product_id || item.id || ''),
        name: item.name || item.product_name || 'Item',
        qty: item.quantity || item.qty || 1,
        isVeg:
          item.is_veg === 1 ||
          item.is_veg === true ||
          (item.name &&
            item.name.toLowerCase().includes('veg') &&
            !item.name.toLowerCase().includes('non')),
      }));
    }
    return [];
  }, [reviewData]);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('Tabs', { screen: 'Orders' });
  };

  // const toggleFoodTag = (tag: string) => {
  //   setSelectedFoodTags(prev =>
  //     prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
  //   );
  // };

  const toggleDeliveryTag = (tag: string) => {
    setSelectedDeliveryTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
    );
  };

  const scrollToTip = () => {
    if (tipSectionY.current > 0) {
      scrollViewRef.current?.scrollTo({
        y: tipSectionY.current - 40,
        animated: true,
      });
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const orderId = passedOrderId || reviewData?.order_id || orderNumber;

    if (!orderId) {
      showToaster('Order ID not found');
      return;
    }

    if (foodRating === 0) {
      showToaster('Please give a rating for the restaurant & food');
      return;
    }

    if (deliveryRating === 0) {
      showToaster('Please give a rating for the delivery partner');
      return;
    }

    // Concatenate tags with feedback
    const foodFeedbackParts = [
      selectedFoodTags.length > 0 ? selectedFoodTags.join(', ') : '',
      foodFeedback?.trim(),
      packagingFeedback ? `Packaging: ${packagingFeedback}` : '',
    ].filter(Boolean);
    const concattedFoodFeedback = foodFeedbackParts.join(' - ');

    const deliveryFeedbackParts = [
      selectedDeliveryTags.length > 0 ? selectedDeliveryTags.join(', ') : '',
      deliveryFeedback?.trim(),
    ].filter(Boolean);
    const concattedDeliveryFeedback = deliveryFeedbackParts.join(' - ');

    // Items rating list
    const itemsRatingPayload = orderItems
      .filter(item => itemRatings[item.id] !== undefined && itemRatings[item.id] !== null)
      .map(item => ({
        variant_id: item.variant_id || item.id,
        is_liked: itemRatings[item.id] === 'like',
      }));

    const tipAmount =
      selectedTip === 'other'
        ? Number(customTip) || 0
        : selectedTip || 0;

    const payload: ISubmitOrderReviewReq = {
      order_id: String(orderId),
      food_rating: foodRating,
      food_feedback: concattedFoodFeedback,
      delivery_rating: deliveryRating,
      delivery_feedback: concattedDeliveryFeedback,
      items_rating: itemsRatingPayload,
      tips: tipAmount,
    };

    try {
      setIsSubmitting(true);
      console.log('payload', payload);

      const res: any = await dispatch(submitOrderReview(payload)).unwrap();
      dispatch(getPendingRatings());

      socketService.logAnalytics({
        action: 'click',
        name: 'Order Rating Submitted',
        from: 'RateExperience Screen',
        params: orderId,
      });

      const gatewayData = res?.data;

      if (tipAmount > 0 && gatewayData?.pg_key) {
        const options = {
          description: `Tip for Order #${orderId}`,
          currency: gatewayData?.currency || 'INR',
          key: gatewayData.pg_key,
          amount: gatewayData?.amount || tipAmount * 100,
          name: 'Ahaari',
          order_id: gatewayData?.pg_order_id,
          prefill: {
            email: userData?.first_name || '',
            contact: userData?.phone || '',
            name: `${userData?.first_name || ''} ${userData?.last_name || ''}`.trim(),
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

        try {
          await RazorpayCheckout.open(options);
          showToaster('Thank you! Your review and tip have been submitted.');
        } catch (payError) {
          console.log('Tip payment error or cancelled:', payError);
          showToaster('Review submitted. Tip payment was not completed.');
        }
      } else {
        showToaster('Thank you! Your review has been submitted.');
      }

      navigation.navigate('Tabs', { screen: 'Orders' });
    } catch (error: any) {
      const errorMsg =
        typeof error === 'string'
          ? error
          : error?.message || 'Failed to submit review. Please try again.';
      showToaster(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFoodRatingFeedback = (rating: number) => {
    switch (rating) {
      case 1:
        return 'Disappointing 😞';
      case 2:
        return 'Could be better 😐';
      case 3:
        return 'Good 🙂';
      case 4:
        return 'Very Tasty! 😋';
      case 5:
        return 'Loved it! Pure perfection 🌟';
      default:
        return '';
    }
  };

  const getDeliveryRatingFeedback = (rating: number) => {
    switch (rating) {
      case 1:
        return 'Poor delivery experience';
      case 2:
        return 'Needs improvement';
      case 3:
        return 'Decent & timely';
      case 4:
        return 'Fast & friendly';
      case 5:
        return 'Super fast & professional! ⚡';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.86}
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <GlassLayer radius={14} tint="rgba(255, 255, 255, 0.06)" />
            <ArrowLeft size={20} color={colors.textPrimary} strokeWidth={2.3} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {restaurantName}
            </Text>
            <Text style={styles.headerSubtitle}>Rate your experience</Text>
          </View>

          <TouchableOpacity
            style={styles.helpButton}
            activeOpacity={0.86}
            onPress={() => navigation.navigate('HelpCenter')}
            accessibilityRole="button"
            accessibilityLabel="Help Center"
          >
            <GlassLayer radius={14} tint="rgba(255, 255, 255, 0.06)" />
            <HelpCircle size={19} color={colors.textSecondary} strokeWidth={2.2} />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            keyboardHeight > 0 && styles.scrollContentKeyboard,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ============================================================ */}
          {/* SECTION 1: Ahaari Delivered Ticket / Receipt Banner         */}
          {/* ============================================================ */}
          <View style={styles.ticketWrapper}>
            {/* Top dispenser slit line */}
            <View style={styles.ticketSlotBar}>
              <LinearGradient
                colors={['rgba(255,176,0,0.4)', 'rgba(255,176,0,0.8)', 'rgba(255,176,0,0.4)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ticketSlotGlow}
              />
            </View>

            {/* Ticket Body */}
            <View style={styles.ticketCard}>
              <GlassLayer radius={18} tint="rgba(255, 255, 255, 0.03)" />

              <View style={styles.ticketBadgeRow}>
                <View style={styles.earlyBadge}>
                  <Clock size={13} color={colors.successBright} strokeWidth={2.4} />
                  <Text style={styles.earlyBadgeText}>
                    {reviewData?.early_delivered && reviewData.early_delivered > 0 ? (
                      <>
                        Order arrived{' '}
                        <Text style={styles.earlyHighlight}>
                          {reviewData.early_delivered} mins early
                        </Text>
                      </>
                    ) : (
                      <>
                        Delivered on{' '}
                        <Text style={styles.earlyHighlight}>
                          {reviewData?.delivered_at || 'time'}
                        </Text>
                      </>
                    )}
                  </Text>
                </View>
              </View>

              <View style={styles.orderSnippetHeader}>
                <View style={styles.orderSnippetTitleRow}>
                  <ReceiptText size={15} color={colors.primary} strokeWidth={2.2} />
                  <Text style={styles.orderIdLabel}>Order #{orderNumber}</Text>
                </View>
              </View>

              {/* Delivery Partner Avatar Illustration */}
              <View style={styles.riderAvatarCenterWrap}>
                <View style={styles.riderAvatarRing}>
                  <Image
                    source={
                      reviewData?.delivery_partner_info?.picture
                        ? {
                          uri: `${Constant.ImageURL}${reviewData.delivery_partner_info.picture}`,
                        }
                        : ImagePath.noProfile
                    }
                    style={styles.riderAvatarImg}
                  />
                  <View style={styles.riderBadgeIcon}>
                    <Sparkles size={11} color={colors.black} strokeWidth={2.8} />
                  </View>
                </View>
              </View>

              <Text style={styles.ticketThankTitle}>Thank your delivery partner</Text>
              <Text style={styles.ticketThankSubtitle}>
                They ensured your meal arrived hot and safe
              </Text>

              <TouchableOpacity
                activeOpacity={0.88}
                style={styles.tipShortcutBtn}
                onPress={scrollToTip}
              >
                <LinearGradient
                  colors={['#FFAD3A', '#F59E0A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.tipShortcutGradient}
                >
                  <Gift size={14} color={colors.onPrimaryDark} strokeWidth={2.2} />
                  <Text style={styles.tipShortcutText}>Leave them a tip</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Ticket Perforation Tear-Line */}
              <View style={styles.ticketTearLine}>
                <View style={styles.dashedDivider} />
              </View>
            </View>
          </View>

          {/* ============================================================ */}
          {/* SECTION 2: Restaurant & Food Review Card                     */}
          {/* ============================================================ */}
          <View style={styles.sectionCard}>
            <GlassLayer radius={18} tint="rgba(255, 255, 255, 0.03)" />

            {/* Restaurant Header */}
            <View style={styles.restaurantRow}>
              <View style={styles.restaurantAvatarWrap}>
                <Image source={restaurantImage} style={styles.restaurantAvatar} />
              </View>
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantNameText} numberOfLines={1}>
                  {restaurantName}
                </Text>
                <Text style={styles.restaurantLocalityText} numberOfLines={1}>
                  {restaurantLocality}
                </Text>
              </View>
            </View>

            <View style={styles.orderSnippetBox}>
              {/* Items preview list */}
              <View style={styles.orderItemsList}>
                {orderItems.map((item: OrderPreviewItem, idx: number) => {
                  const itemKey = item.id || `${item.name}-${idx}`;
                  const currentRating = itemRatings[itemKey];

                  return (
                    <View key={`item-${itemKey}`} style={styles.orderItemRow}>
                      <VegNonVegBadge isVeg={item.isVeg} />
                      <Text style={styles.orderItemName} numberOfLines={1}>
                        {item.qty} × {item.name}
                      </Text>

                      <View style={styles.itemActionRow}>
                        <TouchableOpacity
                          activeOpacity={0.75}
                          onPress={() => toggleItemRating(itemKey, 'like')}
                          style={[
                            styles.rateItemBtn,
                            currentRating === 'like' && styles.rateItemBtnActiveLike,
                          ]}
                          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                        >
                          <ThumbsUp
                            size={13}
                            color={
                              currentRating === 'like'
                                ? colors.successBright
                                : colors.textMuted
                            }
                            fill={
                              currentRating === 'like'
                                ? colors.successBright
                                : 'transparent'
                            }
                            strokeWidth={currentRating === 'like' ? 2.4 : 1.8}
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          activeOpacity={0.75}
                          onPress={() => toggleItemRating(itemKey, 'dislike')}
                          style={[
                            styles.rateItemBtn,
                            currentRating === 'dislike' && styles.rateItemBtnActiveDislike,
                          ]}
                          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                        >
                          <ThumbsDown
                            size={13}
                            color={
                              currentRating === 'dislike'
                                ? colors.accentCoral
                                : colors.textMuted
                            }
                            fill={
                              currentRating === 'dislike'
                                ? colors.accentCoral
                                : 'transparent'
                            }
                            strokeWidth={currentRating === 'dislike' ? 2.4 : 1.8}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.cardDivider} />

            {/* Rate Restaurant Stars */}
            <View style={styles.ratingBlock}>
              <View style={styles.ratingTitleRow}>
                <Text style={styles.ratingBlockTitle}>Rate Restaurant & Food</Text>
              </View>

              <RatingStars
                value={foodRating}
                onChange={setFoodRating}
                label="Restaurant rating"
              />
              <Text style={styles.ratingFeedbackBadge}>
                {getFoodRatingFeedback(foodRating)}
              </Text>
            </View>

            {/* Compliment / Tag Chips */}
            {/* <View style={styles.tagSection}>
            <Text style={styles.tagSectionTitle}>What did you enjoy most?</Text>
            <View style={styles.tagsFlexWrap}>
              {RESTAURANT_TAGS.map(tag => {
                const isSelected = selectedFoodTags.includes(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    activeOpacity={0.8}
                    onPress={() => toggleFoodTag(tag)}
                    style={[
                      styles.tagChip,
                      isSelected && styles.tagChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.tagChipText,
                        isSelected && styles.tagChipTextSelected,
                      ]}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View> */}

            {/* Quick Question: Packaging */}
            {/* <View style={styles.quickQuestionBlock}>
            <Text style={styles.quickQuestionLabel}>
              How was the restaurant's packaging?
            </Text>
            <View style={styles.packagingChoiceRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.packagingBtn,
                  packagingFeedback === 'good' && styles.packagingBtnSelectedGood,
                ]}
                onPress={() => setPackagingFeedback('good')}
              >
                <ThumbsUp
                  size={15}
                  color={
                    packagingFeedback === 'good'
                      ? colors.successBright
                      : colors.textMuted
                  }
                  strokeWidth={2.2}
                />
                <Text
                  style={[
                    styles.packagingBtnText,
                    packagingFeedback === 'good' && styles.packagingBtnTextGood,
                  ]}
                >
                  Good & Spill-proof
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.packagingBtn,
                  packagingFeedback === 'bad' && styles.packagingBtnSelectedBad,
                ]}
                onPress={() => setPackagingFeedback('bad')}
              >
                <ThumbsDown
                  size={15}
                  color={
                    packagingFeedback === 'bad'
                      ? colors.accentCoral
                      : colors.textMuted
                  }
                  strokeWidth={2.2}
                />
                <Text
                  style={[
                    styles.packagingBtnText,
                    packagingFeedback === 'bad' && styles.packagingBtnTextBad,
                  ]}
                >
                  Not good
                </Text>
              </TouchableOpacity>
            </View>
          </View> */}

            {/* Written Feedback Input */}
            <View style={styles.inputWrap}>
              <TextInput
                value={foodFeedback}
                onChangeText={setFoodFeedback}
                placeholder="Tell the restaurant what you loved or how to improve..."
                placeholderTextColor="rgba(158, 163, 173, 0.65)"
                multiline
                textAlignVertical="top"
                style={styles.textInput}
              />
            </View>
          </View>

          {/* ============================================================ */}
          {/* SECTION 3: Delivery Partner Review & Tip Card                */}
          {/* ============================================================ */}
          <View
            style={styles.sectionCard}
            onLayout={e => {
              tipSectionY.current = e.nativeEvent.layout.y;
            }}
          >
            <GlassLayer radius={18} tint="rgba(255, 255, 255, 0.03)" />

            {/* Delivery Partner Profile Row */}
            <View style={styles.partnerRow}>
              <View style={styles.partnerAvatarFrame}>
                <Image
                  source={
                    reviewData?.delivery_partner_info?.picture
                      ? {
                        uri: `${Constant.ImageURL}${reviewData.delivery_partner_info.picture}`,
                      }
                      : ImagePath.noProfile
                  }
                  style={styles.partnerAvatar}
                />
              </View>

              <View style={styles.partnerInfo}>
                <View style={styles.partnerNameRatingRow}>
                  <Text style={styles.partnerNameText} numberOfLines={1}>
                    {reviewData?.delivery_partner_info?.name}
                  </Text>
                </View>
                <Text style={styles.partnerDeliveriesText}>
                  {(reviewData?.delivery_partner_info?.total_orders ?? 0) > 0
                    ? `${reviewData?.delivery_partner_info?.total_orders} orders delivered with high ratings`
                    : 'Delivered with high ratings'}
                </Text>
              </View>
            </View>

            {/* Tip Section */}
            <View style={styles.tipBox}>
              <View style={styles.tipTextRow}>
                <Gift size={15} color={colors.primary} strokeWidth={2.2} />
                <Text style={styles.tipBoxTitle}>
                  Thank {reviewData?.delivery_partner_info?.name} with a tip
                </Text>
              </View>
              <Text style={styles.tipSubText}>
                100% of the tip amount goes directly to your delivery partner.
              </Text>

              {/* Tip Option Pills */}
              <View style={styles.tipChipsRow}>
                {TIP_OPTIONS.map(amt => {
                  const isSelected = selectedTip === amt;
                  return (
                    <TouchableOpacity
                      key={`tip-${amt}`}
                      activeOpacity={0.85}
                      style={[
                        styles.tipChip,
                        isSelected && styles.tipChipSelected,
                      ]}
                      onPress={() => setSelectedTip(isSelected ? null : amt)}
                    >
                      {isSelected && (
                        <Check
                          size={12}
                          color={colors.black}
                          strokeWidth={3}
                          style={{ marginRight: 2 }}
                        />
                      )}
                      <Text
                        style={[
                          styles.tipChipText,
                          isSelected && styles.tipChipTextSelected,
                        ]}
                      >
                        ₹{amt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                {/* Other/Custom Tip */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[
                    styles.tipChip,
                    selectedTip === 'other' && styles.tipChipSelected,
                  ]}
                  onPress={() =>
                    setSelectedTip(selectedTip === 'other' ? null : 'other')
                  }
                >
                  <Text
                    style={[
                      styles.tipChipText,
                      selectedTip === 'other' && styles.tipChipTextSelected,
                    ]}
                  >
                    Other
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Inline Custom Tip Input if selected */}
              {selectedTip === 'other' && (
                <View style={styles.customTipInputRow}>
                  <Text style={styles.customTipCurrency}>₹</Text>
                  <TextInput
                    value={customTip}
                    onChangeText={setCustomTip}
                    placeholder="Enter tip amount"
                    placeholderTextColor="rgba(158, 163, 173, 0.7)"
                    keyboardType="number-pad"
                    style={styles.customTipInput}
                  />
                </View>
              )}
            </View>

            <View style={styles.cardDivider} />

            {/* Rate Delivery Stars */}
            <View style={styles.ratingBlock}>
              <View style={styles.ratingTitleRow}>
                <Text style={styles.ratingBlockTitle}>
                  Rate {reviewData?.delivery_partner_info?.name}
                </Text>

              </View>

              <RatingStars
                value={deliveryRating}
                onChange={setDeliveryRating}
                label="Delivery rating"
              />
              <Text style={styles.ratingFeedbackBadge}>
                {getDeliveryRatingFeedback(deliveryRating)}
              </Text>
            </View>

            {/* Delivery Compliment Chips */}
            <View style={styles.tagSection}>
              <Text style={styles.tagSectionTitle}>What made delivery great?</Text>
              <View style={styles.tagsFlexWrap}>
                {DELIVERY_TAGS.map(tag => {
                  const isSelected = selectedDeliveryTags.includes(tag);
                  return (
                    <TouchableOpacity
                      key={tag}
                      activeOpacity={0.8}
                      onPress={() => toggleDeliveryTag(tag)}
                      style={[
                        styles.tagChip,
                        isSelected && styles.tagChipSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.tagChipText,
                          isSelected && styles.tagChipTextSelected,
                        ]}
                      >
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Delivery Written Feedback */}
            <View style={styles.inputWrap}>
              <TextInput
                value={deliveryFeedback}
                onChangeText={setDeliveryFeedback}
                onFocus={() => {
                  isDeliveryInputFocused.current = true;
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                  }, 150);
                }}
                onBlur={() => {
                  isDeliveryInputFocused.current = false;
                }}
                placeholder="Add a compliment or delivery feedback..."
                placeholderTextColor="rgba(158, 163, 173, 0.65)"
                multiline
                textAlignVertical="top"
                style={styles.textInput}
              />
            </View>

            {/* Safety note */}
            <View style={styles.safetyRow}>
              <ShieldCheck size={16} color={colors.primary} strokeWidth={2.2} />
              <Text style={styles.safetyText}>
                Ahaari Partner Safety & Fair Compensation Guarantee
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* ============================================================ */}
        {/* SECTION 6: Sticky Bottom Submit Action                       */}
        {/* ============================================================ */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]}
            activeOpacity={0.9}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <LinearGradient
              colors={['#FFAD3A', '#F59E0A']}
              start={{ x: 0.16, y: -0.4 }}
              end={{ x: 0.84, y: 1.42 }}
              style={styles.submitGradient}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#2A1700" size="small" />
              ) : (
                <Text style={styles.submitBtnText}>SUBMIT REVIEW</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  /* -- Header -- */
  header: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 10,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    lineHeight: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 14,
    fontWeight: '500',
    marginTop: 1,
  },
  helpButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  /* -- Scroll Area -- */
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 6,
    paddingBottom: 110,
    gap: 16,
  },
  scrollContentKeyboard: {
    paddingBottom: 220,
  },

  /* -- SECTION 1: Ticket Wrapper & Card -- */
  ticketWrapper: {
    alignItems: 'center',
  },
  ticketSlotBar: {
    width: 140,
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
    marginBottom: -2,
    zIndex: 2,
  },
  ticketSlotGlow: {
    flex: 1,
  },
  ticketCard: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingTop: 18,
    paddingBottom: 22,
    paddingHorizontal: 18,
    alignItems: 'center',
    overflow: 'hidden',
  },
  ticketBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  earlyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.28)',
  },
  earlyBadgeText: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    lineHeight: 16,
    fontWeight: '600',
  },
  earlyHighlight: {
    color: colors.successBright,
    fontWeight: '800',
  },
  deliveredAtText: {
    color: colors.textMuted,
    fontSize: typography.captionPlus,
    lineHeight: 15,
    fontWeight: '500',
    marginTop: 6,
  },
  riderAvatarCenterWrap: {
    marginVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  riderAvatarRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: colors.primary,
    padding: 3,
    backgroundColor: 'rgba(255, 176, 0, 0.1)',
    position: 'relative',
  },
  riderAvatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
  },
  riderBadgeIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#121418',
  },
  ticketThankTitle: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  ticketThankSubtitle: {
    color: colors.textMuted,
    fontSize: typography.sm,
    lineHeight: 18,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 2,
    maxWidth: 240,
  },
  tipShortcutBtn: {
    marginTop: 14,
    height: 40,
    borderRadius: 999,
    overflow: 'hidden'
  },
  tipShortcutGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 7,
  },
  tipShortcutText: {
    color: colors.onPrimaryDark,
    fontSize: typography.smPlus,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  /* Ticket perforation */
  ticketTearLine: {
    width: '100%',
    paddingTop: 16,
  },
  dashedDivider: {
    width: '100%',
    height: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderStyle: 'dashed',
  },

  /* -- Shared Card Styles -- */
  sectionCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 16,
    gap: 14,
    overflow: 'hidden',
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    marginHorizontal: -2,
  },

  /* Restaurant Row */
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  restaurantAvatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  restaurantAvatar: {
    width: '100%',
    height: '100%',
  },
  restaurantInfo: {
    flex: 1,
    gap: 2,
  },
  restaurantNameText: {
    color: colors.textPrimary,
    fontSize: typography.mdPlus,
    lineHeight: 22,
    fontWeight: '800',
  },
  restaurantLocalityText: {
    color: colors.textMuted,
    fontSize: typography.captionPlus,
    lineHeight: 15,
    fontWeight: '500',
  },

  /* Order Snippet Box */
  orderSnippetBox: {
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    padding: 12,
    gap: 8,
  },
  orderSnippetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  orderSnippetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  orderIdLabel: {
    color: colors.textPrimary,
    fontSize: typography.sm,
    lineHeight: 17,
    fontWeight: '700',
  },
  orderItemsList: {
    gap: 6,
    paddingTop: 2,
  },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vegBadgeOuter: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vegBadgeInner: {
    width: 6,
    height: 6,
  },
  orderItemName: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    lineHeight: 17,
    fontWeight: '500',
    flex: 1,
  },
  itemActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 8,
  },
  rateItemBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateItemBtnActiveLike: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: 'rgba(34, 197, 94, 0.4)',
  },
  rateItemBtnActiveDislike: {
    backgroundColor: 'rgba(255, 115, 81, 0.15)',
    borderColor: 'rgba(255, 115, 81, 0.4)',
  },
  expandItemsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingVertical: 2,
  },
  moreItemsText: {
    color: colors.primary,
    fontSize: typography.caption,
    lineHeight: 14,
    fontWeight: '700',
  },

  /* Rating Block */
  ratingBlock: {
    gap: 8,
  },
  ratingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingBlockTitle: {
    color: colors.textPrimary,
    fontSize: typography.md,
    lineHeight: 20,
    fontWeight: '700',
  },
  ratingFeedbackBadge: {
    color: colors.primary,
    fontSize: typography.captionPlus,
    lineHeight: 15,
    fontWeight: '700',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,
    paddingVertical: 4,
  },
  starTouch: {
    paddingVertical: 2,
  },

  /* Tags & Compliments */
  tagSection: {
    gap: 8,
  },
  tagSectionTitle: {
    color: colors.textMuted,
    fontSize: typography.captionPlus,
    lineHeight: 15,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tagsFlexWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tagChipSelected: {
    backgroundColor: 'rgba(255, 176, 0, 0.12)',
    borderColor: colors.primary,
  },
  tagChipText: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    lineHeight: 16,
    fontWeight: '600',
  },
  tagChipTextSelected: {
    color: colors.primary,
    fontWeight: '700',
  },

  /* Quick Question Packaging */
  quickQuestionBlock: {
    gap: 8,
  },
  quickQuestionLabel: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    lineHeight: 18,
    fontWeight: '600',
  },
  packagingChoiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  packagingBtn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  packagingBtnSelectedGood: {
    borderColor: 'rgba(34, 197, 94, 0.45)',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  packagingBtnSelectedBad: {
    borderColor: 'rgba(255, 115, 81, 0.45)',
    backgroundColor: 'rgba(255, 115, 81, 0.1)',
  },
  packagingBtnText: {
    color: colors.textMuted,
    fontSize: typography.sm,
    lineHeight: 16,
    fontWeight: '600',
  },
  packagingBtnTextGood: {
    color: colors.successBright,
    fontWeight: '700',
  },
  packagingBtnTextBad: {
    color: colors.accentCoral,
    fontWeight: '700',
  },

  /* Text input for review */
  inputWrap: {
    minHeight: 76,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.09)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textInput: {
    minHeight: 56,
    color: colors.textPrimary,
    fontSize: typography.smPlus,
    lineHeight: 20,
    fontWeight: '400',
    padding: 0,
  },

  /* -- Delivery Partner Row & Details -- */
  partnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  partnerAvatarFrame: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 176, 0, 0.35)',
    padding: 2,
    backgroundColor: 'rgba(255, 176, 0, 0.08)',
  },
  partnerAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  partnerInfo: {
    flex: 1,
    gap: 3,
  },
  partnerNameRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  partnerNameText: {
    color: colors.textPrimary,
    fontSize: typography.mdPlus,
    lineHeight: 22,
    fontWeight: '800',
  },
  partnerRatingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  partnerRatingVal: {
    color: '#22C55E',
    fontSize: typography.captionPlus,
    lineHeight: 13,
    fontWeight: '800',
  },
  partnerDeliveriesText: {
    color: colors.textMuted,
    fontSize: typography.captionPlus,
    lineHeight: 15,
    fontWeight: '500',
  },

  /* Tip Box */
  tipBox: {
    borderRadius: 16,
    backgroundColor: 'rgba(255, 176, 0, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 176, 0, 0.16)',
    padding: 14,
    gap: 10,
  },
  tipTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  tipBoxTitle: {
    color: colors.primary,
    fontSize: typography.smPlus,
    lineHeight: 18,
    fontWeight: '700',
  },
  tipSubText: {
    color: colors.textMuted,
    fontSize: typography.captionPlus,
    lineHeight: 16,
    fontWeight: '500',
  },
  tipChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipChip: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  tipChipText: {
    color: colors.textPrimary,
    fontSize: typography.smPlus,
    lineHeight: 16,
    fontWeight: '700',
  },
  tipChipTextSelected: {
    color: colors.black,
    fontWeight: '800',
  },
  customTipInputRow: {
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: 'rgba(255, 176, 0, 0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 6,
  },
  customTipCurrency: {
    color: colors.primary,
    fontSize: typography.md,
    lineHeight: 18,
    fontWeight: '800',
  },
  customTipInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.smPlus,
    lineHeight: 18,
    fontWeight: '700',
    padding: 0,
  },

  /* Safety guarantee */
  safetyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingTop: 2,
  },
  safetyText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 14,
    fontWeight: '500',
    flex: 1,
  },

  /* Customer Info Card */
  infoLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextGroup: {
    flex: 1,
    gap: 2,
  },
  infoMainText: {
    color: colors.textPrimary,
    fontSize: typography.sm,
    lineHeight: 18,
    fontWeight: '600',
  },
  infoLabelText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoSubText: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    lineHeight: 18,
    fontWeight: '500',
  },
  infoDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginHorizontal: -2,
  },

  /* Help & Support Card */
  helpLinkCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    overflow: 'hidden',
  },
  helpIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 176, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 176, 0, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpTextGroup: {
    flex: 1,
    gap: 2,
  },
  helpTitle: {
    color: colors.textPrimary,
    fontSize: typography.smPlus,
    lineHeight: 18,
    fontWeight: '700',
  },
  helpSubtitle: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 14,
    fontWeight: '500',
  },

  /* Sticky Bottom Action Bar */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: layout.screenPadding,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 26 : 16,
    overflow: 'hidden',
  },
  submitBtn: {
    height: 52,
    borderRadius: 999,
    overflow: 'hidden'
  },
  submitGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: colors.onPrimaryDark,
    fontSize: typography.md,
    lineHeight: 20,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
});

export default RatingScreen;