import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  deleteAuthTokenFromAsyncStore,
  deleteUserDetailsFromAsyncStore,
  setAuthTokenToAsyncStore,
  setUserDetailsToAsyncStore,
} from '../../utils/storage';
import axios, { removeApiToken, setApiToken } from '../../utils/axios';
import { navigate, reset } from '../../utils/navigationRef';
import {
  IAddress,
  IAddressAddReq,
  ILoginReq,
  ISendOtpReq,
  IUpdateLocationReq,
  IVerifyUserReq,
} from '../../types';
import { showToaster } from '../../utils/toaster';

//For login
export const login = createAsyncThunk(
  'user/login',
  async (params: ILoginReq, thunkAPI) => {
    try {
      const { data, message }: any = await axios.post('user/login', params);
      showToaster(message);
      console.log('data', data);
      navigate('OtpAuth', { phone: data?.phone });
      return { data, message };
    } catch (error: any) {
      showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For resendOtp
export const resendOtp = createAsyncThunk(
  'user/resendOtp',
  async (params: ISendOtpReq, thunkAPI) => {
    try {
      const { data, message }: any = await axios.post(
        'user/resend-otp',
        params,
      );
      showToaster(message);
      console.log('data', data);
      return { data, message };
    } catch (error: any) {
      showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For verify OTP
export const verifyOTP = createAsyncThunk(
  'user/verifyOtp',
  async (params: IVerifyUserReq, thunkAPI) => {
    try {
      const { data, message }: any = await axios.post(
        'user/verify-otp',
        params,
      );
      showToaster(message);
      if (data) {
        setApiToken(data.token);
        await setAuthTokenToAsyncStore(data.token);
        await setUserDetailsToAsyncStore(data.user);
      }
      reset('Tabs');
      return { data, message };
    } catch (error: any) {
      showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For fetching user addresses
export const getAddressList = createAsyncThunk(
  'user/getAddressList',
  async (_, thunkAPI) => {
    try {
      const { data, message }: { data: IAddress[]; message: string } =
        await axios.get('user/addresses');
      console.log('data1', data);
      return { data, message };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For adding user address
export const addAddress = createAsyncThunk(
  'user/addAddress',
  async (params: IAddressAddReq, thunkAPI) => {
    try {
      const { data, message }: { data: IAddress; message: string } =
        await axios.post('user/add-address', params);
      showToaster(message);
      return { data, message };
    } catch (error: any) {
      showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For setting default address
export const setDefaultAddress = createAsyncThunk(
  'user/setDefaultAddress',
  async (params: { address_id: string }, thunkAPI) => {
    try {
      const { data, message }: { data: IAddress; message: string } =
        await axios.post('user/set-default-address', params);
      return { data, message };
    } catch (error: any) {
      // showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For updating user location
export const updateLocation = createAsyncThunk(
  'user/updateLocation',
  async (params: IUpdateLocationReq, thunkAPI) => {
    try {
      const { data, message }: any = await axios.post(
        'user/update-location',
        params,
      );
      return { data, message };
    } catch (error: any) {
      // showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For user logout
export const logout = createAsyncThunk(
  'user/logout',
  async (
    { msg = '', type }: { msg?: string; type: 'manual' | 'auto' },
    thunkAPI,
  ) => {
    try {
      let message = msg;
      if (type === 'manual') {
        const res: any = await axios.get('user/logout');
        message = res?.message || msg;
      }
      removeApiToken();
      await deleteAuthTokenFromAsyncStore();
      await deleteUserDetailsFromAsyncStore();
      reset('Login');
      showToaster(message);
      return null;
    } catch (error: any) {
      // showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For user Delete
export const deleteAccount = createAsyncThunk(
  'user/deleteAccount',
  async (_, thunkAPI) => {
    try {
      const { data, message }: any = await axios.post('user/delete-account');
      removeApiToken();
      await deleteUserDetailsFromAsyncStore();
      await deleteAuthTokenFromAsyncStore();
      reset('Login');
      // showToaster(message);
      return { data, message };
    } catch (error: any) {
      // showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);
