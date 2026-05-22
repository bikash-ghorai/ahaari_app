import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, ReceiptText, Search, ShoppingCart, User, UtensilsCrossed } from 'lucide-react-native';

import { colors, layout, typography } from '../constants/theme';

const BottomNav = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const activeRouteName = state.routes[state.index]?.name;
  const ordersTabActive = activeRouteName === 'Orders';

  const navigateToTab = (index: number) => {
    const route = state.routes[index];
    navigation.navigate(route.name);
  };

  return (
    <View style={styles.bottomNavContainer}>
      <View style={styles.bottomNav}>
        <View pointerEvents="none" style={styles.bottomNavGlassLayer}>
          <BlurView
            style={styles.bottomNavBlur}
            blurType="dark"
            blurAmount={32}
            blurRadius={25}
            downsampleFactor={1}
            overlayColor="transparent"
            reducedTransparencyFallbackColor="rgba(18, 21, 28, 0.32)"
          />
          <View style={styles.bottomNavTintOverlay} />
        </View>


        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigateToTab(0)}
          accessibilityRole="button"
        >
          <Home size={24} color={activeRouteName === 'Home' ? colors.primary : colors.textMuted} />
          <Text style={activeRouteName === 'Home' ? styles.navTextActive : styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigateToTab(1)}
          accessibilityRole="button"
        >
          <UtensilsCrossed size={24} color={activeRouteName === 'Restaurants' ? colors.primary : colors.textMuted} />
          <Text style={activeRouteName === 'Restaurants' ? styles.navTextActive : styles.navText}>Near Me</Text>
        </TouchableOpacity>

        <View style={styles.cartButtonContainer}>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigateToTab(2)}
            accessibilityRole="button"
          >
            <ShoppingCart size={28} color="#000" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigateToTab(3)}
          accessibilityRole="button"
        >
          <ReceiptText size={24} color={ordersTabActive ? colors.primary : colors.textMuted} />
          <Text style={ordersTabActive ? styles.navTextActive : styles.navText}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigateToTab(4)}
          accessibilityRole="button"
        >
          <User size={24} color={activeRouteName === 'Profile' ? colors.primary : colors.textMuted} />
          <Text style={activeRouteName === 'Profile' ? styles.navTextActive : styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 24,
  },
  bottomNav: {
    borderRadius: 99,
    overflow: 'visible',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.24,
    shadowRadius: 18,
    elevation: 14,
  },
  bottomNavGlassLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 99,
    overflow: 'hidden',
  },
  bottomNavBlur: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.overlayDarkStrong,
  },
  androidGlassOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(8, 11, 16, 0.1)',
  },
  bottomNavTintOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontSize: typography.caption,
    fontWeight: '500',
    color: colors.textMuted,
  },
  navTextActive: {
    fontSize: typography.caption,
    fontWeight: '500',
    color: colors.primary,
  },
  cartButtonContainer: {
    marginTop: -44,
  },
  cartButton: {
    width: 60,
    height: 60,
    backgroundColor: colors.primary,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.background,
    boxShadow: `0px 0px 25px ${colors.primary}80`,
  },
});

export default BottomNav;
