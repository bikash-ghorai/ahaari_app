import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient as SvgRadialGradient, Rect, Stop } from 'react-native-svg';

const AppBackground = () => {
  return (
    <View pointerEvents="none" style={styles.backgroundLayer}>
      <Svg width="100%" height="100%" style={styles.backgroundSvg}>
        <Defs>
          <SvgRadialGradient id="loginGlowTopLeft" cx="0%" cy="0%" r="78%">
            <Stop offset="0%" stopColor="#F59E0B" stopOpacity={0.28} />
            <Stop offset="42%" stopColor="#F59E0B" stopOpacity={0.12} />
            <Stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
          </SvgRadialGradient>

          <SvgRadialGradient id="loginGlowBottomRight" cx="100%" cy="100%" r="78%">
            <Stop offset="0%" stopColor="#EA580C" stopOpacity={0.2} />
            <Stop offset="44%" stopColor="#EA580C" stopOpacity={0.08} />
            <Stop offset="100%" stopColor="#EA580C" stopOpacity={0} />
          </SvgRadialGradient>
        </Defs>

        <Rect x="0" y="0" width="100%" height="100%" fill="url(#loginGlowTopLeft)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#loginGlowBottomRight)" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundLayer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
  },
  backgroundSvg: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});

export default AppBackground;
