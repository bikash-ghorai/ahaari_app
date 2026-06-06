import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';
import {
  ICartItemReq,
  ICartItemRes,
  ICheckoutReq,
  ICheckoutRes,
  ICoupon,
  IHomePageData,
  IOrderDetails,
  IOrderListRes,
  IRestaurant,
  IRestaurantDetails,
  IRestaurantRes,
} from '../../types';

//For getting order details
export const homePageAPI = createAsyncThunk(
  'app/homePageAPI',
  async (_, thunkAPI) => {
    try {
      const { data, message }: { data: IHomePageData; message: string } =
        await axios.get('user/home');
      return { data, message };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For getting restaurants
export const getRestaurants = createAsyncThunk(
  'app/getRestaurants',
  async (categoryId: string | null, thunkAPI) => {
    try {
      const { data, message }: { data: IRestaurantRes; message: string } =
        await axios.get(`user/shops${categoryId ? `?category_id=${categoryId}` : ''}`);
      return { data, message };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For getting restaurant details
export const getRestaurantDetails = createAsyncThunk(
  'app/getRestaurantDetails',
  async (shopId: string, thunkAPI) => {
    try {
      const { data, message }: { data: IRestaurantDetails; message: string } =
        await axios.get(`user/shop/${shopId}`);
      return { data, message };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For adding item to cart
export const addCartItem = createAsyncThunk(
  'app/addCartItem',
  async (params: ICartItemReq, thunkAPI) => {
    try {
      const { data, message }: { data: ICartItemRes; message: string } =
        await axios.post('user/cart', params);
      return { data, message };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For getting coupons
export const getCoupons = createAsyncThunk(
  'app/getCoupons',
  async (_, thunkAPI) => {
    try {
      const { data, message }: { data: Array<ICoupon>; message: string } =
        await axios.get('user/coupons');
      return { data, message };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For applying coupon
export const applyCoupon = createAsyncThunk(
  'app/applyCoupon',
  async (params: { coupon_id: string }, thunkAPI) => {
    try {
      const { data, message }: { data: Array<ICoupon>; message: string } =
        await axios.post('user/apply-coupon', params);
      return { data, message };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For removing coupon
export const removeCoupon = createAsyncThunk(
  'app/removeCoupon',
  async (_, thunkAPI) => {
    try {
      const { data, message }: { data: Array<ICoupon>; message: string } =
        await axios.get('user/remove-coupon');
      return { data, message };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For checkout
export const checkoutCart = createAsyncThunk(
  'app/checkoutCart',
  async (params: ICheckoutReq, thunkAPI) => {
    try {
      const { data, message }: { data: ICheckoutRes; message: string } =
        await axios.post('user/checkout', params);
      return { data, message };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For getting orders
export const getOrders = createAsyncThunk(
  'app/getOrders',
  async (_, thunkAPI) => {
    try {
      const { data, message }: { data: IOrderListRes; message: string } =
        await axios.get('user/orders');
      return { data, message };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For getting order details
export const getOrderDetails = createAsyncThunk(
  'app/getOrderDetails',
  async (orderId: string, thunkAPI) => {
    try {
      const { data, message }: { data: IOrderDetails; message: string } =
        await axios.get(`user/order/${orderId}`);
      return { data, message };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For cancelling order (after payment is done)
export const cancelOrder = createAsyncThunk(
  'app/cancelOrder',
  async (params: { order_id: string; reason: string }, thunkAPI) => {
    try {
      const { data, message }: { data: any; message: string } =
        await axios.post(`user/cancel-order`, params);
      return { data, message };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For pre-payment cancellation (before payment is done)
export const prePayment = createAsyncThunk(
  'app/prePayment',
  async (params: { order_id: string; }, thunkAPI) => {
    try {
      const { data, message }: { data: any; message: string } =
        await axios.post(`user/order-pre-payment`, params);
      return { data, message };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For adding cooking instructions
export const addCookingInstructions = createAsyncThunk(
  'app/addCookingInstructions',
  async (params: { order_id: string; instruction: string }, thunkAPI) => {
    try {
      const { data, message }: { data: any; message: string } =
        await axios.post(`user/add-instruction`, params);
      return { data, message };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For searching products and shops
export const searchAPI = createAsyncThunk(
  'app/search',
  async (query: string, thunkAPI) => {
    try {
      const { data, message }: { data: { products: any[]; shops: any[] }; message: string } =
        await axios.get(`user/search?keyword=${query}`);
      return { data, message };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

