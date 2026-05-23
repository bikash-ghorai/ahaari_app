import {
  CommonActions,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export const navigate = (name: string, params?: undefined | any) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as any, params as any);
  }
};
export const goBack = () => {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
};

export const reset = (name: string, params?: undefined) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({ index: 1, routes: [{ name, params }] }),
    );
  }
};
