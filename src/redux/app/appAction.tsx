import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';
import {
  ICartItemReq,
  ICartItemRes,
  ICoupon,
  IRestaurant,
  IRestaurantDetails,
} from '../../types';

//For getting restaurants
export const getRestaurants = createAsyncThunk(
  'app/getRestaurants',
  async (_, thunkAPI) => {
    try {
      const { data, message }: { data: Array<IRestaurant>; message: string } =
        await axios.get('user/shops');
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
  async (params: any, thunkAPI) => {
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
  async (params: any, thunkAPI) => {
    try {
      const { data, message }: { data: Array<ICoupon>; message: string } =
        await axios.post('user/remove-coupon', params);
      return { data, message };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
