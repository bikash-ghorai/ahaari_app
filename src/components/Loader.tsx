import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { colors } from '../constants/theme';

type LoaderProps = {
  message?: string;
  fullScreen?: boolean;
  containerStyle?: ViewStyle;
};

const Loader: React.FC<LoaderProps> = ({
  message = 'Please wait ...',
  fullScreen = true,
  containerStyle,
}) => {
  return (
    <View
      style={[
        fullScreen ? styles.fullScreen : styles.inlineWrapper,
        containerStyle,
      ]}
    >
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    position: 'absolute',
    height: '110%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 9999999999,
  },
  inlineWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    width: 200,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: colors.glass,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Loader;
