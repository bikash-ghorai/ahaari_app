import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { AlertTriangle, X } from 'lucide-react-native';

import { colors, layout, typography } from '../constants/theme';
import { useWeatherAlert } from '../contexts/WeatherAlertContext';

const WeatherAlertTooltip = () => {
  const { isBadWeather, isVisible, hide } = useWeatherAlert();

  if (!isBadWeather || !isVisible) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={styles.wrapper}>
      <View pointerEvents="none" style={styles.pointer} />
      <View style={styles.card}>
        <BlurView
          pointerEvents="none"
          style={styles.blur}
          blurType="dark"
          blurAmount={22}
          reducedTransparencyFallbackColor="rgba(24, 18, 16, 0.9)"
        />
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(255, 115, 81, 0.16)', 'rgba(255, 115, 81, 0)']}
          start={{ x: 0.1, y: 0.1 }}
          end={{ x: 0.9, y: 1 }}
          style={styles.glow}
        />

        <View style={styles.header}>
          <View style={styles.badge}>
            <AlertTriangle size={13} color={colors.accentCoral} />
          </View>
          <Text style={styles.title}>Weather delay</Text>
          <TouchableOpacity
            onPress={hide}
            style={styles.dismiss}
            accessibilityLabel="Dismiss weather alert"
          >
            <X size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
        <Text style={styles.text}>Due to bad weather, your order might be delayed.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: layout.screenPadding,
    right: layout.screenPadding,
    top: 95,
    alignItems: 'flex-end',
    zIndex: 30,
    elevation: 30,
  },
  card: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(32, 22, 20, 0.92)',
    gap: 6,
    maxWidth: 280,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 10,
    overflow: 'hidden',
  },
  blur: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 14,
  },
  glow: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  badge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 115, 81, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 115, 81, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    color: colors.accentCoral,
    fontSize: typography.sm,
    fontWeight: '700',
  },
  text: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    opacity: 0.95,
    lineHeight: 18,
  },
  dismiss: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(32, 22, 20, 0.92)',
    alignSelf: 'flex-end',
    marginBottom: -1,
    marginRight: 15,
  },
});

export default WeatherAlertTooltip;
