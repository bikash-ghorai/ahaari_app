import React from 'react';
import { Platform, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';

const GlassLayer = ({ radius, tint = 'rgba(9, 12, 18, 0.22)' }: { radius: number; tint?: string }) => (
  <>
    {Platform.OS === 'ios' ? (
      <BlurView
        pointerEvents="none"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: radius }}
        blurType="dark"
        blurAmount={24}
        reducedTransparencyFallbackColor="rgba(18, 20, 24, 0.22)"
      />
    ) : null}
    <View
      pointerEvents="none"
      style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: radius,
          backgroundColor: tint,
        }}
    />
  </>
);

export default GlassLayer;
