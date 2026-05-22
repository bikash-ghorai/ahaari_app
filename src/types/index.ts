export type IUser = {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  dob: string | null;
  picture: string | null;
  phone: string;
  referred_by: string | null;
  balance: number;
  zone: string;
  last_login: string | null;
  type: string;
  status: string;
  flag: string | null;
  in_zones: string[];
};

export type ISendOtpReq = {
  phone: string | number;
};

export type ILoginReq = {
  phone: string | number;
};

export type IVerifyUserReq = {
  phone: string | number;
  otp: string | number;
};

export type IRestaurant = {
  id: string | number;
  shop_id: string;
  name: string;
  address: string;
  longitude: string;
  latitude: string;
  image: string;
  timing: string | null;
  commission: string | number;
  price_hike: string | number;
  tax: string | number;
  discount: string | number;
  discount_upto: string | number;
  discount_type: string;
  rating: string | number;
  rated: string | number;
  zone_id: string;
  use_app: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type IAddress = {
  address_id: string;
  type: 'Home' | 'Work' | 'Other';
  address: string;
  landmark: string;
  pincode: string;
  phone_no: string;
  latitude: string;
  longitude: string;
  is_default: number | string;
  zone_ids: string[];
};

export type IAddressAddReq = {
  type: 'Home' | 'Work' | 'Other';
  first_name?: string;
  last_name?: string;
  address: string;
  landmark?: string;
  pincode: string;
  phone_no?: string;
  latitude: string;
  longitude: string;
};

export type IUpdateLocationReq = {
  latitude?: number | string;
  longitude?: number | string;
  address_id?: string;
};
