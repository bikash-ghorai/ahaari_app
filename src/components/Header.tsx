import { AlertTriangle, Bell, ChevronLeft, ShoppingBag } from 'lucide-react-native';
import React from 'react';
import { Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, layout, typography } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { useWeatherAlert } from '../contexts/WeatherAlertContext';
import WeatherAlertTooltip from './WeatherAlertTooltip';

const Header = ({ title, showBackButton = true, showCartButton = false, showNotificationButton = false, containerStyle }: { title: string; showBackButton?: boolean; showCartButton?: boolean; showNotificationButton?: boolean; containerStyle?: any }) => {
  const navigation = useNavigation<any>();
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 44; // Approximate for iOS
  const { isBadWeather, show } = useWeatherAlert();

  return (
    <>
      <View style={[styles.topBar, containerStyle, { paddingTop: statusBarHeight, height: 64 + statusBarHeight }]}>
        {showBackButton && (
          <TouchableOpacity style={styles.topIconButton} onPress={() => navigation.goBack()}>
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        <Text style={styles.topBarTitle}>{title}</Text>
        {showCartButton && (
          <TouchableOpacity style={styles.topIconButton}>
            <ShoppingBag size={20} color="#FFFFFF" />
            <View style={styles.badgeDot}>
              <Text style={styles.badgeDotText}>2</Text>
            </View>
          </TouchableOpacity>
        )}
        {showNotificationButton && (
          <TouchableOpacity style={styles.topIconButton}>
            {isBadWeather ? (
              <AlertTriangle size={20} color={colors.accentCoral} />
            ) : (
              <>
                <Bell size={20} color="#FFFFFF" />
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
        )}

        {!showCartButton && !showNotificationButton ? (
            <View style={{ height: 40, width: 40 }} />
        ) : null}
      </View>
      <View style={{ height: 64 }} />
      {showNotificationButton && (
        <WeatherAlertTooltip />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: 64,
    paddingHorizontal: layout.screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  topBarBlur: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  topIconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  topBarTitle: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    fontWeight: '700',
    letterSpacing: -0.45,
  },
  badgeDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  badgeDotText: {
    color: colors.black,
    fontSize: typography.caption,
    fontWeight: '700',
  },
});

export default Header;
