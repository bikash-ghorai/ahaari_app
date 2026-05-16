import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN = '@token';
const LOCATION = '@location';
const FCM_TOKEN = '@fcmtoken';

// -----------Auth Token------
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN);
    return token != null ? JSON.parse(token) : null;
  } catch (e) {
    return null;
  }
};

export const setAuthToken = async (value: string): Promise<boolean> => {
  try {
    const token = JSON.stringify(value);
    await AsyncStorage.setItem(AUTH_TOKEN, token);
    return true;
  } catch (e) {
    return false;
  }
};

export const deleteAuthToken = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN);
    return true;
  } catch (e) {
    return false;
  }
};

// -----------Location Cord------

export const getLocation = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(LOCATION);
    return token != null ? JSON.parse(token) : null;
  } catch (e) {
    return null;
  }
};

export const setLocation = async (value: any): Promise<boolean> => {
  try {
    const token = JSON.stringify(value);
    await AsyncStorage.setItem(LOCATION, token);
    return true;
  } catch (e) {
    return false;
  }
};

// -----------Firebase Token------
export const getFCMTokenFromStore = async (): Promise<string> => {
  try {
    const token = await AsyncStorage.getItem(FCM_TOKEN);
    return token != null ? JSON.parse(token) : '';
  } catch (e) {
    return '';
  }
};

export const setFCMToken = async (value: string): Promise<boolean> => {
  try {
    const token = JSON.stringify(value);
    await AsyncStorage.setItem(FCM_TOKEN, token);
    return true;
  } catch (e) {
    return false;
  }
};
