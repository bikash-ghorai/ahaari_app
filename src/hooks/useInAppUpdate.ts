import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import SpInAppUpdates, {
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';

const inAppUpdates = new SpInAppUpdates(
  false // isDebug
);

export const useInAppUpdate = () => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    if (__DEV__) {
      return;
    }

    inAppUpdates.checkNeedsUpdate().then((result) => {
      if (result.shouldUpdate) {
        setIsUpdateAvailable(true);
      }
    }).catch((err) => {
      console.log('Error checking for updates', err);
    });
  }, []);

  const triggerUpdate = () => {
    let updateOptions: StartUpdateOptions = {};
    if (Platform.OS === 'android') {
      updateOptions = {
        updateType: IAUUpdateKind.IMMEDIATE,
      };
    }
    inAppUpdates.startUpdate(updateOptions);
  };

  return { isUpdateAvailable, triggerUpdate };
};
