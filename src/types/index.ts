export type IUser = {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  dob: string | null;
  picture: string | null;
  phone: string;
  referred_by: string | null;
  balance: string | number;
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
  hasVip: string;
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

export type IVariant = {
  variant_id: string;
  product_id: string;
  name: string;
  price: number | string;
  seller_price: number | string;
  menu_price: number | string;
  container_charge: number | string;
  container_charge_on_qty: number | string;
  status: string;
};

export type IProduct = {
  product_id: string;
  name: string;
  type: string;
  description: string;
  image: string;
  category_id: string;
  shop_id: string;
  rating: number | string;
  rated: number | string;
  show_on: string;
  tags: string | null;
  variants: Array<IVariant>;
};

export type ICategory = {
  category_id: string;
  name: string;
  type: string;
  image: string;
  status: string;
  products: Array<IProduct>;
};

export type IRestaurantDetails = {
  shop: IRestaurant;
  categories: Array<ICategory>;
};

export type ICartItemReq = {
  shop_id: string;
  products: Array<{
    variant_id: string;
    quantity: string | number;
  }>;
};

export type ICartItemRes = {
  cart_id: string;
  shop: {
    shop_id: string;
    name: string;
    address: string;
  };
  address: IAddress;
  coupon: {
    applied: boolean;
    code: null;
    discount: number;
  };
  items: Array<{
    variant_id: string;
    product_id: string;
    type: null;
    name: string;
    description: string;
    picture: null;
    price: number;
    quantity: number;
  }>;
  addons_products: [];
  payment_method: {
    cod: {
      available: true;
      charge: 0;
      is_selected: boolean;
    };
    online: {
      available: true;
      charge: 0;
      is_selected: boolean;
    };
  };
  sub_total: number;
  tax: number;
  delivery_charge: number;
  distance: number;
  wallet_balance: number;
  vip_charge: number;
  total: number;
  extra_charges: Array<{
    label: string;
    amount: number;
  }>;
};

export type ICoupon = {};
