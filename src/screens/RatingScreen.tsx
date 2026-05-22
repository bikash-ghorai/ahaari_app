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
import { ArrowLeft, Home, ReceiptText, Search, ShoppingCart, Star, User } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, typography } from '../constants/theme';
import type { RootStackParamList } from '../types/navigation';

type RatingStarsProps = {
  value: number;
  onChange: (next: number) => void;
  label: string;
};

const GlassLayer = ({ radius, tint = 'rgba(18, 21, 28, 0.34)' }: { radius: number; tint?: string }) => (
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
        reducedTransparencyFallbackColor="rgba(18, 21, 28, 0.4)"
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

const RatingStars = ({ value, onChange, label }: RatingStarsProps) => {
  const stars = useMemo(() => [1, 2, 3, 4, 5], []);

  return (
    <View style={styles.starsRow} accessibilityRole="adjustable" accessibilityLabel={label}>
      {stars.map(star => {
        const active = value >= star;

        return (
          <TouchableOpacity
            key={`star-${label}-${star}`}
            activeOpacity={0.86}
            onPress={() => onChange(star)}
            style={styles.starTouch}
            accessibilityRole="button"
            accessibilityLabel={`${label} ${star} stars`}
          >
            <Star
              size={30}
              color={active ? colors.primary : 'rgba(255,255,255,0.28)'}
              fill={active ? colors.primary : 'transparent'}
              strokeWidth={2.1}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const RatingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'RateExperience'>>();

  const [foodRating, setFoodRating] = useState(5);
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [foodFeedback, setFoodFeedback] = useState('');
  const [deliveryFeedback, setDeliveryFeedback] = useState('');

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('Tabs', { screen: 'Orders' });
  };

  const navigateToTab = (tab: 'Home' | 'Restaurants' | 'Cart' | 'Orders' | 'Profile') => {
    navigation.navigate('Tabs', { screen: tab });
  };

  const handleSubmit = () => {
    navigation.navigate('Tabs', { screen: 'Orders' });
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View pointerEvents="none" style={styles.ambientLayer}>
        <View style={styles.glowTopLeft} />
        <View style={styles.glowBottomRight} />
      </View>

      <View style={styles.header}>
        <View style={styles.headerLeftGroup}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.86}
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <GlassLayer radius={12} tint="rgba(255,255,255,0.05)" />
            <ArrowLeft size={20} color={colors.textPrimary} strokeWidth={2.3} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Rate Your Experience</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Tell us{`\n`}how it was.</Text>
          <Text style={styles.heroBody}>
            Your feedback helps us bring the finest tastes to your doorstep with perfection.
          </Text>
        </View>

        <View style={styles.card}>
          <GlassLayer radius={20} />

          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.kicker}>Restaurant</Text>
              <Text style={styles.cardTitle}>The Golden Skillet</Text>
            </View>

            <View style={styles.brandImageWrap}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1498579809087-ef1e558fd1da?auto=format&fit=crop&w=120&q=80',
                }}
                style={styles.brandImage}
              />
            </View>
          </View>

          <RatingStars value={foodRating} onChange={setFoodRating} label="Restaurant rating" />

          <View style={styles.inputWrap}>
            <TextInput
              value={foodFeedback}
              onChangeText={setFoodFeedback}
              placeholder="What did you love about the food?"
              placeholderTextColor="rgba(158, 163, 173, 0.8)"
              multiline
              textAlignVertical="top"
              style={styles.textInput}
            />
          </View>
        </View>

        <View style={styles.card}>
          <GlassLayer radius={20} />

          <View style={styles.cardHeader}>
            <View style={styles.partnerInfoRow}>
              <View style={styles.avatarFrame}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=200&q=80',
                  }}
                  style={styles.partnerAvatar}
                />
              </View>

              <View>
                <Text style={styles.kicker}>Delivery Partner</Text>
                <Text style={styles.cardTitle}>Marco V.</Text>
              </View>
            </View>

            <View style={styles.onTimePill}>
              <Text style={styles.onTimeText}>ON TIME</Text>
            </View>
          </View>

          <RatingStars value={deliveryRating} onChange={setDeliveryRating} label="Delivery rating" />

          <View style={styles.inputWrap}>
            <TextInput
              value={deliveryFeedback}
              onChangeText={setDeliveryFeedback}
              placeholder="How was the delivery experience?"
              placeholderTextColor="rgba(158, 163, 173, 0.8)"
              multiline
              textAlignVertical="top"
              style={styles.textInput}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} activeOpacity={0.9} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit Review</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomNavWrap}>
        <View style={styles.bottomNavBar}>
          <GlassLayer radius={999} tint="rgba(21, 24, 32, 0.38)" />

          <TouchableOpacity style={styles.navItem} onPress={() => navigateToTab('Home')}>
            <Home size={21} color={colors.textMuted} strokeWidth={2.2} />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigateToTab('Restaurants')}>
            <Search size={21} color={colors.textMuted} strokeWidth={2.2} />
            <Text style={styles.navText}>Search</Text>
          </TouchableOpacity>

          <View style={styles.cartFabWrap}>
            <TouchableOpacity style={styles.cartFab} onPress={() => navigateToTab('Cart')} activeOpacity={0.9}>
              <ShoppingCart size={26} color={colors.black} strokeWidth={2.4} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.navItem} onPress={() => navigateToTab('Orders')}>
            <ReceiptText size={21} color={colors.primary} strokeWidth={2.4} />
            <Text style={styles.navTextActive}>Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigateToTab('Profile')}>
            <User size={21} color={colors.textMuted} strokeWidth={2.2} />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  ambientLayer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  glowTopLeft: {
    position: 'absolute',
    width: 280,
    height: 280,
    top: -60,
    left: -120,
    borderRadius: 280,
    backgroundColor: 'rgba(255, 176, 0, 0.14)',
  },
  glowBottomRight: {
    position: 'absolute',
    width: 280,
    height: 280,
    right: -120,
    bottom: 80,
    borderRadius: 280,
    backgroundColor: 'rgba(236, 91, 19, 0.1)',
  },
  header: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 12,
    paddingBottom: 10,
  },
  headerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 8,
    paddingBottom: 180,
    gap: 20,
  },
  heroSection: {
    gap: 10,
  },
  heroTitle: {
    color: colors.textPrimary,
    fontSize: 48,
    lineHeight: 48,
    fontWeight: '900',
    letterSpacing: -1.8,
  },
  heroBody: {
    width: 236,
    color: colors.textMuted,
    fontSize: typography.sm,
    lineHeight: 21,
    fontWeight: '400',
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    gap: 18,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.26,
    shadowRadius: 28,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kicker: {
    color: colors.primary,
    fontSize: typography.caption,
    lineHeight: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 4,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    lineHeight: 28,
    fontWeight: '700',
  },
  brandImageWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  brandImage: {
    width: '100%',
    height: '100%',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starTouch: {
    paddingVertical: 2,
  },
  inputWrap: {
    minHeight: 112,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  textInput: {
    minHeight: 86,
    color: colors.textPrimary,
    fontSize: typography.body,
    lineHeight: 21,
    fontWeight: '400',
    padding: 0,
  },
  partnerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarFrame: {
    width: 48,
    height: 48,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 176, 0, 0.3)',
    padding: 2,
  },
  partnerAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },
  onTimePill: {
    height: 26,
    borderRadius: 999,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 176, 0, 0.2)',
    backgroundColor: 'rgba(255, 176, 0, 0.1)',
    justifyContent: 'center',
  },
  onTimeText: {
    color: colors.primary,
    fontSize: typography.caption,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  submitButton: {
    marginTop: 2,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFB000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.38,
    shadowRadius: 18,
    elevation: 8,
  },
  submitText: {
    color: colors.black,
    fontSize: typography.lg,
    lineHeight: 24,
    fontWeight: '800',
  },
  bottomNavWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 24,
  },
  bottomNavBar: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'visible',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 52,
  },
  navText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 12,
    fontWeight: '500',
  },
  navTextActive: {
    color: colors.primary,
    fontSize: typography.caption,
    lineHeight: 12,
    fontWeight: '700',
  },
  cartFabWrap: {
    marginTop: -32,
  },
  cartFab: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.background,
    shadowColor: '#FFB000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
});

export default RatingScreen;