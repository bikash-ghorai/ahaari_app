import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppBackground from './src/components/AppBackground';
import BottomNav from './src/components/BottomNav';
import NoInternetToast from './src/components/NoInternetToast';
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
import AddressListScreen from './src/screens/AddressListScreen';
import CouponListScreen from './src/screens/CouponListScreen';
import SelectAddressScreen from './src/screens/SelectAddressScreen';
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
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/screens/SplashScreen';
import { navigationRef } from './src/utils/navigationRef';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import NetInfo from '@react-native-community/netinfo';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
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

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected);
      console.log('state', state);
    });
    return () => unsubscribe();
  }, []);

  const updateCurrentRoute = () => {
    const routeName = navigationRef.getCurrentRoute()?.name;
    if (routeName && routeName !== currentRouteName) {
      setCurrentRouteName(routeName);
    }
  };

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
                      name="AddressList"
                      component={AddressListScreen}
                    />
                    <Stack.Screen
                      options={{ freezeOnBlur: true, animation: 'none' }}
                      name="CouponList"
                      component={CouponListScreen}
                    />
                    <Stack.Screen
                      options={{ freezeOnBlur: true, animation: 'none' }}
                      name="SelectAddress"
                      component={SelectAddressScreen}
                    />
                    <Stack.Screen
                      options={{ freezeOnBlur: true, animation: 'none' }}
                      name="AddAddress"
                      component={AddAddressScreen}
                    />
                  </Stack.Navigator>
                </NavigationContainer>

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
