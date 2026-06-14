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
import { updateLocation } from '../redux/user/userAction';

const SplashScreen = () => {
  const { getCart, emptyCart } = useCart();
  const dispatch = useDispatch();

  useEffect(() => {
    initiatApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('Initiating app...');
  const initiatApp = async () => {
    try {
      let coords: any = await fetchUserCurrentLocation();
      console.log('coords fetch success', coords);
      if (coords && coords?.latitude && coords?.longitude) {
        dispatch(setUserCurrentCoords(coords));
      }
      checkAuthStatus(coords);
    } catch (error) {
      console.log('Error fetching user location:', error);
      dispatch(setUserCurrentCoords(null));
      checkAuthStatus();
    }
  };

  const checkAuthStatus = async (coords?: any) => {
    try {
      const token = await getAuthTokenFromAsyncStore();
      const userDetails: any = await getUserDetailsFromAsyncStore();
      if (token && userDetails) {
        setApiToken(token);
        dispatch(setUserData(userDetails));
        if (coords && coords?.latitude && coords?.longitude) {
          dispatch(
            updateLocation({
              latitude: coords.latitude,
              longitude: coords.longitude,
            }),
          )
            .unwrap()
            .finally(() => {
              getCart();
              reset('Tabs');
            });
        } else {
          getCart();
          reset('Tabs');
        }
      } else {
        await deleteAuthTokenFromAsyncStore();
        emptyCart();
        reset('Login');
      }
      setTimeout(() => {
        BootSplash.hide({ fade: true });
      }, 100);
    } catch (error: any) {
      console.log('error', error);
      await deleteAuthTokenFromAsyncStore();
      emptyCart();
      reset('Login');
      setTimeout(() => {
        BootSplash.hide({ fade: true });
      }, 100);
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
