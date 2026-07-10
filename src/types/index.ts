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
  id_token?: string;
  device_token?: string;
};

export type IFirebaseLoginReq = {
  id_token?: string;
  device_token?: string;
  referrer?: string | null;
};

export type IHomePageData = {
  slides: Array<{
    id: string;
    image: string;
  }>;
  categories: Array<{
    category_id: string;
    emoji: string;
    name: string;
    image: string;
  }>;
  todaySpecials: Array<{
    shop_id: string;
    shop_name: string;
    variant_id: string;
    product_id: string;
    name: string;
    description: string;
    price: number | string;
    image: string | null;
    type: 'Veg' | 'Non-Veg';
  }>;
  coupons: Array<{
    title: string;
    description: string;
    expire_on: string;
  }>;
  shops: Array<{
    shop_id: string;
    name: string;
    image: string | null;
    type: string;
    time: string | null;
    have_discount: boolean;
    offer: string | null;
    rating: number | string;
  }>;
  event: null | any;
  topRated: null | any;
  bad_weather: boolean;
};

export type IRestaurant = {
  shop_id: string;
  name: string;
  address: string;
  image: string | null;
  images?: string[];
  discount: string | number;
  discount_upto: string | number;
  discount_type: string;
  rating: string | number;
  rated: string | number;
  is_wishlist: boolean;
  status: string;
  type: string;
  delivery_time: string;
  time: string;
};

export type IRestaurantRes = {
  shops: Array<IRestaurant>;
  categories: Array<{
    category_id: string;
    name: string;
  }>;
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

export type IVariantStatus = 'Available' | 'Unavailable' | 'Out Of Stock';

export type IVariant = {
  variant_id: string;
  product_id: string;
  name: string;
  price: number | string;
  seller_price: number | string;
  menu_price: number | string;
  container_charge: number | string;
  container_charge_on_qty: number | string;
  status: IVariantStatus;
};

export type IProduct = {
  product_id: string;
  name: string;
  type: 'Veg' | 'Non-Veg';
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
    image: null;
    price: number;
    quantity: number;
    status: IVariantStatus;
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
  checkout: boolean;
  delivery_charge_discount: {
    progress: number;
    message: string;
  };
  message: string;
};

export type ICoupon = {
  coupon_id: string;
  code: string;
  description: string;
  expire_on: string;
  is_applicable: boolean;
  reason: string;
  title: string;
};

export type IPaymentMethod = 'Online' | 'COD';
export type IOrderStatus =
  | 'Processing'
  | 'Pending'
  | 'Preparing'
  | 'Ready'
  | 'On The Way'
  | 'Delivered'
  | 'Cancelled'
  | 'Undelivered'
  | 'Failed';

export type ICheckoutReq = {
  payment_method: IPaymentMethod;
  is_vip: boolean;
  tips: number;
  use_wallet_balance: boolean;
};

export type ICheckoutRes = {
  order_id: string;
  user_id: string;
  shop_id: string;
  sub_total: number;
  delivery_charge: number;
  tax: number;
  extra_charges: Array<{
    label: string;
    amount: number;
  }>;
  discount: number;
  coupon_id: string | null;
  used_wallet_balance: number;
  payable_amount: number;
  paid_amount: number;
  payment_type: IPaymentMethod;
  gateway_txn_id: string | null;
  gateway_response: string | null;
  remarks: string | null;
  zone_id: string;
  is_rated: boolean;
  status: IOrderStatus;
  updated_at: string;
  created_at: string;
  id: number;
  gateway_info?: {
    receipt: string;
    amount: number;
    currency: string;
    partial_payment: boolean;
    order_id: string;
    key: string;
  };
};

export type IOrderDetails = {
  order_id: string;
  order_id_label: string;
  shop_name: string;
  status: IOrderStatus;
  message: {
    title: string;
    description: string;
  };
  date: string;
  delivery_address: string;
  items: Array<{
    name: string;
    description: string;
    image: string;
    quantity: number;
    price: number;
  }>;
  sub_total: number;
  delivery_charge: number;
  tax: number;
  extra_charges: Array<{
    label: string;
    amount: number;
  }>;
  discount: number;
  wallet_used: number;
  payable_amount: number;
  total: number;
  payment_type: IPaymentMethod;
  partner_info: {
    name: string;
    picture: string;
    contact: string;
    rating: number | string;
  };
  shop_coordinate: {
    latitude: string | number;
    longitude: string | number;
  };
  delivery_coordinate: {
    latitude: string | number;
    longitude: string | number;
  };
  is_vip: boolean;
  estimate_delivery_time: number | string;
  instruction: string | null;
  otp: string | null;
};

export type IActiveOrder = {
  order_id: string;
  order_id_label: string;
  shop_name: string;
  shop_image: string;
  status: IOrderStatus;
  date: string;
  message: string;
  timeline: {
    step_1: {
      title: string;
      status: string;
    };
    step_2: {
      title: string;
      status: string;
    };
    step_3: {
      title: string;
      status: string;
    };
  };
  partner_info: {
    name: string;
    picture: string;
    contact: string;
    rating: number | string;
  };
};
export type IPastOrder = {
  order_id: string;
  order_id_label: string;
  shop_id: string;
  shop_name: string;
  shop_image: string;
  status: IOrderStatus;
  date: string;
  total: string | number;
  rating: {
    star: number | null;
    feedback: string | null;
  } | null;
  items: Array<{
    product_id: string;
    variant_id: string;
    quantity: number;
  }>;
};
export type IOrderListRes = {
  active_orders: Array<IActiveOrder>;
  past_orders: Array<IPastOrder>;
};
