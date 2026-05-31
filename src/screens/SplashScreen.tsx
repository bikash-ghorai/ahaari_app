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
import { setUserCurrentCoords, setUserData } from '../redux/user/userSlice';
import { useCart } from '../hooks';
import BootSplash from 'react-native-bootsplash';
import { fetchUserCurrentLocation } from '../utils/helper';

const SplashScreen = () => {
  const { getCart, emptyCart } = useCart();
  const dispatch = useDispatch();

  useEffect(() => {
    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuthStatus = async () => {
    try {
      let coords = await fetchUserCurrentLocation();
      dispatch(setUserCurrentCoords(coords));
      console.log('coords fetch success', coords);
    } catch (error) {
      console.error('Error fetching user location:', error);
      dispatch(setUserCurrentCoords(null));
    }
    try {
      const token = await getAuthTokenFromAsyncStore();
      const userDetails: any = await getUserDetailsFromAsyncStore();
      if (token && userDetails) {
        setApiToken(token);
        dispatch(setUserData(userDetails));
        getCart();
        reset('Tabs');
      } else {
        await deleteAuthTokenFromAsyncStore();
        emptyCart();
        reset('Login');
      }
      BootSplash.hide({ fade: true });
    } catch (error: any) {
      console.log('error', error);
      await deleteAuthTokenFromAsyncStore();
      emptyCart();
      reset('Login');
      BootSplash.hide({ fade: true });
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
