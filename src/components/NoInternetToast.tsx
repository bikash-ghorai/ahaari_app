import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { layout, typography } from '../constants/theme';
import { BlurView } from '@react-native-community/blur';

interface NoInternetToastProps {
  isConnected: boolean;
}

const NoInternetToast: React.FC<NoInternetToastProps> = ({ isConnected }) => {
  const [slideAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (!isConnected) {
      // Slide up when disconnected
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();
    } else {
      // Slide down when connected
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isConnected, slideAnim]);

  const slideTransform = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Dimensions.get('window').height, 0],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideTransform }],
        },
      ]}
      pointerEvents={isConnected ? 'none' : 'auto'}
    >
      {Platform.OS === 'ios' && (
        <BlurView
          style={styles.blur}
          blurType="dark"
          blurAmount={20}
          reducedTransparencyFallbackColor="rgba(22, 26, 30, 0.95)"
        />
      )}

      <View
        style={[
          styles.content,
          Platform.OS === 'android' && {
            backgroundColor: 'rgba(23, 26, 30, 0.95)',
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <MaterialIcons name="wifi-off" size={20} color="#FF6B6B" />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>No Internet Connection</Text>
          <Text style={styles.subtitle}>
            Please check your network and try again
          </Text>
        </View>
      </View>

      <View style={styles.bottomBorder} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 14,
    gap: 12,
    marginHorizontal: layout.screenPadding,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
    backgroundColor: 'rgba(23, 26, 30, 0.95)',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#FF6B6B',
    fontSize: typography.md,
    fontWeight: '700',
    letterSpacing: 0.2,
    marginBottom: 2,
  },
  subtitle: {
    color: '#AAABB0',
    fontSize: typography.sm,
    fontWeight: '400',
    letterSpacing: 0.1,
  },
  bottomBorder: {
    height: 2,
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    marginHorizontal: layout.screenPadding,
    borderRadius: 1,
  },
});

export default NoInternetToast;
