import type { NavigatorScreenParams } from '@react-navigation/native';

export type CouponSelection = {
  code: string;
  discount: number;
};

export type RootTabParamList = {
  Home: undefined;
  Restaurants: undefined;
  Cart: { appliedCoupon?: CouponSelection } | undefined;
  Orders: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Splash: undefined;
  OtpAuth: { phone?: string } | undefined;
  Tabs: NavigatorScreenParams<RootTabParamList> | undefined;
  Search: undefined;
  MyCircle: undefined;
  RateExperience: undefined;
  ReferEarn: undefined;
  RestaurantDetails: { id: any };
  OrderConfirmed:
    | {
        orderId?: string;
        etaMinutes?: number;
        itemName?: string;
        chefName?: string;
      }
    | undefined;
  OrderFailed:
    | {
        reason?: string;
      }
    | undefined;
  OrderDetails: { orderId?: string } | undefined;
  WalletHistory: undefined;
  Plan: undefined;
  PersonalInfo: undefined;
  About: undefined;
  HelpCenter: undefined;
  AddressList: undefined;
  CouponList: { currentCode?: string } | undefined;
  SelectAddress: undefined;
  AddAddress: undefined;
};
