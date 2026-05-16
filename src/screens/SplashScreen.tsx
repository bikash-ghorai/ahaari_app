/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StatusBar } from 'react-native';
import { ImagePath } from '../../constants/ImagePath';
import FastImage from 'react-native-fast-image';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = () => {
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#D73F0D',
        }}
      >
        <FastImage
          source={ImagePath.splash}
          style={{ height: '100%', width: '100%' }}
          resizeMode="cover"
        />
      </View>
    </>
  );
};

export default SplashScreen;
