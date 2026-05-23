import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN = '@token';
const USER_DETAILS = '@userdetailsToAsyncStore';
const LOCATION = '@location';
const FCM_TOKEN = '@fcmtoken';

// -----------Auth Token------
export const getAuthTokenFromAsyncStore = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN);
    return token != null ? JSON.parse(token) : null;
  } catch (e) {
    console.log('error', e);
    return null;
  }
};

export const setAuthTokenToAsyncStore = async (
  value: string,
): Promise<boolean> => {
  try {
    const token = JSON.stringify(value);
    await AsyncStorage.setItem(AUTH_TOKEN, token);
    return true;
  } catch (e) {
    console.log('error', e);
    return false;
  }
};

export const deleteAuthTokenFromAsyncStore = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN);
    return true;
  } catch (e) {
    console.log('error', e);
    return false;
  }
};

// -----------User Details------
export const getUserDetailsFromAsyncStore = async (): Promise<
  string | null
> => {
  try {
    const user_data = await AsyncStorage.getItem(USER_DETAILS);
    return user_data != null ? JSON.parse(user_data) : null;
  } catch (e) {
    console.log('error', e);
    return null;
  }
};

export const setUserDetailsToAsyncStore = async (
  value: string,
): Promise<boolean> => {
  try {
    const user_data = JSON.stringify(value);
    await AsyncStorage.setItem(USER_DETAILS, user_data);
    return true;
  } catch (e) {
    console.log('error', e);
    return false;
  }
};

export const deleteUserDetailsFromAsyncStore = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(USER_DETAILS);
    return true;
  } catch (e) {
    console.log('error', e);
    return false;
  }
};

// -----------Location Cord------

export const getLocation = async (): Promise<string | null> => {
  try {
    const location = await AsyncStorage.getItem(LOCATION);
    return location != null ? JSON.parse(location) : null;
  } catch (e) {
    console.log('error', e);
    return null;
  }
};

export const setLocation = async (value: any): Promise<boolean> => {
  try {
    const location = JSON.stringify(value);
    await AsyncStorage.setItem(LOCATION, location);
    return true;
  } catch (e) {
    console.log('error', e);
    return false;
  }
};

// -----------Firebase Token------
export const getFCMTokenFromStore = async (): Promise<string> => {
  try {
    const ftoken = await AsyncStorage.getItem(FCM_TOKEN);
    return ftoken != null ? JSON.parse(ftoken) : '';
  } catch (e) {
    console.log('error', e);
    return '';
  }
};

export const setFCMToken = async (value: string): Promise<boolean> => {
  try {
    const ftoken = JSON.stringify(value);
    await AsyncStorage.setItem(FCM_TOKEN, ftoken);
    return true;
  } catch (e) {
    console.log('error', e);
    return false;
  }
};
