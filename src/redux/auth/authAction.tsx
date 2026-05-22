import {createAsyncThunk} from '@reduxjs/toolkit';
import {deleteAuthToken, getAuthToken, setAuthToken} from '../../utils/storage';
import {showToaster} from '../../utils/toaster';
import axios, {removeApiToken, setApiToken} from '../../utils/axios';
import {
  IForgotPasswordReq,
  ILoginReq,
  IResetPasswordReq,
  ISendOtpReq,
  ISignupReq,
  IVerifyUserReq,
  IfcmUpdateReq,
} from '../../../types';
import {navigate, reset} from '../../utils/navigationRef';

// For Check user login or not
export const checkLogin = createAsyncThunk(
  'auth/checkLogin',
  async (_, thunkAPI) => {
    try {
      const token = await getAuthToken();
      if (!token) {
        await deleteAuthToken();
        reset('Auth');
        return null;
      }
      setApiToken(token);
      const {data}: any = await axios.get('user/get-single-user');
      if (data) {
        reset('App');
        return data;
      } else {
        await deleteAuthToken();
        reset('Auth');
        return null;
      }
    } catch (error: any) {
      await deleteAuthToken();
      reset('Auth');
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For login user
export const login = createAsyncThunk(
  'auth/login',
  async (params: ILoginReq, thunkAPI) => {
    try {
      const {data, message}: any = await axios.post('user/userlogin', params);
      if (data) {
        if (data?.is_email_verified) {
          if (data?.address && data?.address?.length > 0) {
            showToaster(message);
            setApiToken(data.token);
            await setAuthToken(data.token);
            reset('App');
          } else {
            showToaster('Please complete your profile');
            setApiToken(data?.token);
            navigate('setProfile', {auth_token: data?.token});
          }
        } else {
          navigate('verifyOtp', {routeFrom: 'login', username: data.email});
        }
      }
      return data;
    } catch (error: any) {
      showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For signup user
export const signup = createAsyncThunk(
  'auth/signup',
  async (params: ISignupReq, thunkAPI) => {
    try {
      const {data, message}: any = await axios.post('user', params);
      showToaster(message);
      return data;
    } catch (error: any) {
      showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For verify User
export const verifyUser = createAsyncThunk(
  'auth/verifyUser',
  async (params: IVerifyUserReq, thunkAPI) => {
    try {
      const {data, message}: any = await axios.post('user/verifyOtp', params);
      showToaster(message);
      if (data) {
        setApiToken(data.token);
        // await setAuthToken(data.token);
      }
      return data;
    } catch (error: any) {
      showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For sendOtp
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (params: ISendOtpReq, thunkAPI) => {
    try {
      const {data, message}: any = await axios.post('user/send-otp', params);
      showToaster(message);
      return data;
    } catch (error: any) {
      showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For forgot password otp send
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (params: IForgotPasswordReq, thunkAPI) => {
    try {
      const {success, message}: any = await axios.post(
        'user/send-reset-otp',
        params,
      );
      showToaster(message);
      return success;
    } catch (error: any) {
      showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For set new password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (params: IResetPasswordReq, thunkAPI) => {
    try {
      const {data, message}: any = await axios.put(
        'user/forgot-password',
        params,
      );
      if (data) {
        navigate('login');
      }
      showToaster(message);
      return data;
    } catch (error: any) {
      showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For user logout
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    const {data, message}: any = await axios.put('user/logout');
    removeApiToken();
    await deleteAuthToken();
    reset('Auth');
    showToaster(message);
    return data;
  } catch (error: any) {
    showToaster(error);
    return thunkAPI.rejectWithValue(error);
  }
});

//For user Delete
export const deleteAccount = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      const {data, message}: any = await axios.post('user/delete-account');
      removeApiToken();
      await deleteAuthToken();
      reset('Auth');
      showToaster(message);
      return data;
    } catch (error: any) {
      showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For user device token update
export const updateFcmToken = createAsyncThunk(
  'auth/fcmUpdate',
  async (params: IfcmUpdateReq, thunkAPI) => {
    try {
      const {data}: any = await axios.post('user/update-device-token', params);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
