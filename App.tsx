import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View, BackHandler, NativeModules, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useInAppUpdate } from './src/hooks/useInAppUpdate';

import AppBackground from './src/components/AppBackground';
import BottomNav from './src/components/BottomNav';
import NoInternetToast from './src/components/NoInternetToast';
import UpdatePopup from './src/components/UpdatePopup';
import { colors } from './src/constants/theme';
import { WeatherAlertProvider } from './src/contexts/WeatherAlertContext';
import CartScreen from './src/screens/CartScreen';
import HomeScreen from './src/screens/HomeScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SearchScreen from './src/screens/SearchScreen';
import type {
  RootStackParamList,
  RootTabParamList,
} from './src/types/navigation';
import RestaurantList from './src/screens/RestaurantList';
import RestaurantDetails from './src/screens/RestaurantDetails';
import OrderDetailsScreen from './src/screens/OrderDetailsScreen';
import OrderConfirmedScreen from './src/screens/OrderConfirmedScreen';
import OrderFailedScreen from './src/screens/OrderFailedScreen';
import WalletHistoryScreen from './src/screens/WalletHistoryScreen';
import CouponListScreen from './src/screens/CouponListScreen';
import AddressesScreen from './src/screens/AddressesScreen';
import AddAddressScreen from './src/screens/AddAddressScreen';
import MyCircleScreen from './src/screens/MyCircleScreen';
import LoginScreen from './src/screens/LoginScreen';
import OtpAuthScreen from './src/screens/OtpAuthScreen';
import RatingScreen from './src/screens/RatingScreen';
import ReferEarnScreen from './src/screens/ReferEarnScreen';
import PlanScreen from './src/screens/PlanScreen';
import PersonalInfoScreen from './src/screens/PersonalInfoScreen';
import AboutScreen from './src/screens/AboutScreen';
import HelpCenterScreen from './src/screens/HelpCenterScreen';
import AdminWebLoginPopup from './src/components/AdminWebLoginPopup';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/screens/SplashScreen';
import { navigationRef } from './src/utils/navigationRef';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import NetInfo from '@react-native-community/netinfo';
import { getMessaging } from '@react-native-firebase/messaging';
import socketService from './src/utils/socket-service';
import { setReferrer } from './src/utils/storage';
import { Settings } from 'react-native-fbsdk-next';

const { InstallReferrerModule } = NativeModules;
const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

const linking = {
  prefixes: [
    'ahaari://',
    'https://ahri.my',
  ],

  config: {
    screens: {
      Tabs: {
        screens: {
          Home: 'home',
        },
      },

      RestaurantDetails: {
        path: 'shop/:shopId',
        parse: {
          shopId: String,
        },
      },
    },
  },
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: 'transparent' },
      }}
      tabBar={props => <BottomNav {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Restaurants" component={RestaurantList} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
function App() {
  const [currentRouteName, setCurrentRouteName] = React.useState('Splash');
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [adminLoginCode, setAdminLoginCode] = useState<string>('');
  const [isAdminPopupVisible, setIsAdminPopupVisible] =
    useState<boolean>(false);

  // Check for in-app updates
  const { isUpdateAvailable, triggerUpdate } = useInAppUpdate();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected);
      console.log('state', state);
    });
    checkDeferredDeepLink();
    return () => unsubscribe();
  }, []);

  // 2. Insert this useEffect hook inside your function App() block:
  useEffect(() => {
    const handleBackPress = () => {
      socketService.logAnalytics({
        action: 'click',
        name: 'Back Button Pressed',
        from: currentRouteName + ' Screen',
      } as any);
      return false; // Blocks the app from closing instantly
    };

    // Add the hardware listener
    const backHandlerSubscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );

    // Clean up listener when app context shifts
    return () => backHandlerSubscription.remove();
  }, [currentRouteName]);

  const updateCurrentRoute = async () => {
    const routeName = navigationRef.getCurrentRoute()?.name;
    if (routeName && routeName !== currentRouteName) {
      setCurrentRouteName(routeName);
    }
  };

  const checkDeferredDeepLink = async () => {
    const referrer = await InstallReferrerModule.getReferrerString();
    if (Platform.OS === 'android') {
      if (referrer && referrer !== '') {
        // console.log('Android App Installed from matching server link. Destination:', referrer);
        // store in local storage or state management for later use
        await setReferrer(referrer);
      }
    }
  };

  useEffect(() => {
    getMessaging()
      .registerDeviceForRemoteMessages()
      .then(r => { });
    getMessaging()
      .getToken()
      .then(token => {
        console.log('Token', token);
        // store.dispatch(setFCMToken(token));
      })
      .catch(err => {
        console.error(err);
      });

    // Listen for FCM messages while the app is in the foreground
    const unsubscribeForeground = getMessaging().onMessage(remoteMessage => {
      // Check if this is the silent admin web login data message
      if (
        remoteMessage?.data?.type === 'admin_web_login' &&
        remoteMessage?.data?.code
      ) {
        setAdminLoginCode(remoteMessage.data.code as string);
        setIsAdminPopupVisible(true);
        // DeviceEventEmitter.emit('admin_web_login', remoteMessage.data.code as string);
      }
    });

    // Handle tapped notifications that were received in the background
    const unsubscribeBackground = getMessaging().onNotificationOpenedApp(
      remoteMessage => {
        if (
          remoteMessage?.data?.type === 'admin_web_login' &&
          remoteMessage?.data?.code
        ) {
          setAdminLoginCode(remoteMessage.data.code as string);
          setIsAdminPopupVisible(true);
          // DeviceEventEmitter.emit('admin_web_login', remoteMessage.data.code as string);
        }
      },
    );

    // Handle the case where the app was opened from a QUIT state by an FCM notification
    getMessaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.log('getInitialNotification', remoteMessage);
        if (
          remoteMessage?.data?.type === 'admin_web_login' &&
          remoteMessage?.data?.code
        ) {
          setAdminLoginCode(remoteMessage.data.code as string);
          setIsAdminPopupVisible(true);
          // DeviceEventEmitter.emit('admin_web_login', remoteMessage.data.code as string);
        }
      });

    getMessaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('setBackgroundMessageHandler message', remoteMessage);
      if (
        remoteMessage?.data?.type === 'admin_web_login' &&
        remoteMessage?.data?.code
      ) {
        setAdminLoginCode(remoteMessage.data.code as string);
        setIsAdminPopupVisible(true);
      }
    });

    return () => {
      unsubscribeForeground();
      unsubscribeBackground();
    };
  }, []);

  useEffect(() => {
    // Required for iOS (Android auto-initializes based on the AndroidManifest)
    Settings.initializeSDK();

    // Optional: Enable automatic app event logging
    Settings.setAutoLogAppEventsEnabled(true);
    Settings.setAdvertiserTrackingEnabled(true);
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <Provider store={store}>
          <WeatherAlertProvider>
            <StatusBar
              barStyle="light-content"
              backgroundColor={colors.background}
            />
            <View style={styles.container}>
              {currentRouteName !== 'Login' &&
                currentRouteName !== 'OtpAuth' ? (
                <AppBackground />
              ) : null}

              <View style={styles.mobileCanvas}>
                <NavigationContainer
                  ref={navigationRef}
                  theme={navigationTheme}
                  onReady={updateCurrentRoute}
                  onStateChange={updateCurrentRoute}
                  // linking={linking}
                >
                  <Stack.Navigator
                    screenOptions={{
                      headerShown: false,
                      contentStyle: { backgroundColor: 'transparent' },
                    }}
                  >
                    <Stack.Screen
                      options={{ freezeOnBlur: true, animation: 'none' }}
                      name="Splash"
                      component={SplashScreen}
                    />
                    <Stack.Screen
                      options={{ freezeOnBlur: true, animation: 'none' }}
                      name="Tabs"
                      component={MainTabs}
                    />
                    <Stack.Screen
                      options={{ freezeOnBlur: true, animation: 'none' }}
                      name="Login"
                      component={LoginScreen}
                    />
                    <Stack.Screen
                      options={{ freezeOnBlur: true, animation: 'none' }}
                      name="OtpAuth"
                      component={OtpAuthScreen}
                    />
                    <Stack.Screen
                      options={{ freezeOnBlur: true, animation: 'none' }}
                      name="Search"
                      component={SearchScreen}
                    />
                    <Stack.Screen
                      options={{ freezeOnBlur: true, animation: 'none' }}
                      name="MyCircle"
                      component={MyCircleScreen}
                    />
                    <Stack.Screen
                      options={{ freezeOnBlur: true, animation: 'none' }}
                      name="RateExperience"
                      component={RatingScreen}
                    />
                    <Stack.Screen
                      options={{ freezeOnBlur: true, animation: 'none' }}
                      name="ReferEarn"
                      component={ReferEarnScreen}
                    />
                    <Stack.Screen
                      options={{
                        freezeOnBlur: true,
                        animation: 'none',
                      }}
                      name="RestaurantDetails"
                      component={RestaurantDetails}
                    />
                    <Stack.Screen
                      options={{ freezeOnBlur: true, animation: 'none' }}
                      name="OrderConfirmed"
                      component={OrderConfirmedScreen}
                    />
                    <Stack.Screen
                      options={{ freezeOnBlur: true, animation: 'none' }}
                      name="OrderFailed"
                      component={OrderFailedScreen}
                    />
                    <Stack.Screen
                      options={{ freezeOnBlur: true, animation: 'none' }}
                      name="OrderDetails"
                      component={OrderDetailsScreen}
                    />
                    <Stack.Screen
                      options={{ freezeOnBlur: true, animation: 'none' }}
                      name="WalletHistory"
                      component={WalletHistoryScreen}
                    />
                    <Stack.Screen
                      options={{ freezeOnBlur: true, animation: 'none' }}
                      name="Plan"
                      component={PlanScreen}
                    />
                    <Stack.Screen
                      options={{ freezeOnBlur: true, animation: 'none' }}
                      name="PersonalInfo"
                      component={PersonalInfoScreen}
                    />
                    <Stack.Screen
                      options={{ freezeOnBlur: true, animation: 'none' }}
                      name="About"
                      component={AboutScreen}
                    />
                    <Stack.Screen
                      options={{ freezeOnBlur: true, animation: 'none' }}
                      name="HelpCenter"
                      component={HelpCenterScreen}
                    />
                    <Stack.Screen
                      options={{ freezeOnBlur: true, animation: 'none' }}
                      name="CouponList"
                      component={CouponListScreen}
                    />
                    <Stack.Screen
                      options={{ freezeOnBlur: true, animation: 'none' }}
                      name="AddressesScreen"
                      component={AddressesScreen}
                    />
                    <Stack.Screen
                      options={{ freezeOnBlur: true, animation: 'none' }}
                      name="AddAddress"
                      component={AddAddressScreen}
                    />
                  </Stack.Navigator>
                </NavigationContainer>

                <AdminWebLoginPopup
                  isVisible={isAdminPopupVisible}
                  code={adminLoginCode}
                  onExpire={() => {
                    setIsAdminPopupVisible(false);
                    setAdminLoginCode('');
                  }}
                />

                <UpdatePopup
                  isVisible={isUpdateAvailable}
                  onUpdate={triggerUpdate}
                />

                <NoInternetToast isConnected={isConnected} />
              </View>
            </View>
          </WeatherAlertProvider>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mobileCanvas: {
    flex: 1,
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
  },
});

export default App;
