/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ImagePath } from '../constants/ImagePath';
import { setApiToken } from '../utils/axios';
import { reset } from '../utils/navigationRef';
import {
  deleteAuthTokenFromAsyncStore,
  getAuthTokenFromAsyncStore,
  getUserDetailsFromAsyncStore,
} from '../utils/storage';
import { useDispatch } from '../redux/store';
import { setUserData } from '../redux/user/userSlice';

const SplashScreen = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const timer = setTimeout(() => {
      checkAuthStatus();
    }, 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await getAuthTokenFromAsyncStore();
      const userDetails = await getUserDetailsFromAsyncStore();
      if (token && userDetails) {
        setApiToken(token);
        dispatch(setUserData(userDetails));
        reset('Tabs');
      } else {
        await deleteAuthTokenFromAsyncStore();
        reset('Login');
      }
    } catch (error: any) {
      console.log('error', error);
      await deleteAuthTokenFromAsyncStore();
      reset('Login');
    }
  };

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
