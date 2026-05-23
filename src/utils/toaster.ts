import Toast from 'react-native-simple-toast';

export function showToaster(message: string) {
  Toast.show(message, Toast.SHORT);
}
