import Geolocation from 'react-native-geolocation-service';

import { Linking, PermissionsAndroid, Platform } from 'react-native';

export const statusColors: any = {
  Processing: '#FBBF24',
  Pending: '#FBBF24',
  Preparing: '#3B82F6',
  Ready: '#3B82F6',
  'On The Way': '#10B981',
  Delivered: '#10B981',
  Cancelled: '#EF4444',
  Undelivered: '#EF4444',
};

export const handleCall = (phoneNumber: string) => {
  if (phoneNumber) {
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch(err =>
      console.error('Error opening dialer:', err),
    );
  }
};
export const handleWhatsapp = (text: string) => {
  const phoneNumber = '919134331144';
  if (phoneNumber) {
    const url = `whatsapp://send?phone=${phoneNumber}&text=${text}`;
    Linking.openURL(url).catch(err =>
      console.error('Error opening WhatsApp:', err),
    );
  }
};

const requestLocationPermission = async () => {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location permission',
        message:
          'We use your location to show nearby restaurants and delivery options.',
        buttonPositive: 'Allow',
        buttonNegative: 'Not now',
      },
    );

    return result === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.error('Location permission error:', error);
    return false;
  }
};

export const fetchUserCurrentLocation = async () => {
  console.log('Fetching user location...');
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) {
    return Promise.reject(new Error('Location permission denied'));
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve(position.coords);
      },
      error => {
        console.log('Geolocation error:', error);
        Geolocation.getCurrentPosition(
          (position) => {
            resolve(position.coords);
          },
          (error) => {
            console.log('Background update failed: ', error.message);
            reject(error);
          },
          {
            enableHighAccuracy: true,  // Use GPS hardware now for the exact pinpoint
            timeout: 10000,            // Give hardware time to lock in background
            maximumAge: 0,             // Force a brand new reading
          }
        )
      },
      {
        enableHighAccuracy: false, // Force it to use cellular/network cache
        timeout: 3000, // Fail quickly if no cache exists
        maximumAge: 3600000, // Accept a cached location up to 1 hour old
      },
    );
  });
};

export const currencyFormate = (
  value: number | string,
  decimals: number = 2,
) => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) {
    return '₹0.00';
  }

  if (numValue < 0) {
    return '-₹' + Math.abs(numValue).toFixed(decimals);
  }

  return '₹' + numValue.toFixed(decimals);
};
