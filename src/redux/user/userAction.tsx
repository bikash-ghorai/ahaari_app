import {createAsyncThunk} from '@reduxjs/toolkit';
import {showToaster} from '../../utils/toaster';
import axios from '../../utils/axios';
import {
  IActivityListReq,
  IAddComplaintReq,
  IBannerViewCountReq,
  IChangePasswordReq,
  IPhoneOTPReq,
  ISendSupportMsgReq,
  IUpdateCurrentLocationReq,
  IUserInstallCountReq,
  IUserSettingReq,
  IUserUpdateReq,
  IVerifyPhoneOTPReq,
} from '../../../types';

//For user details update
export const userDetailsUpdate = createAsyncThunk(
  'user/updateUser',
  async (params: IUserUpdateReq, thunkAPI) => {
    try {
      const {data, message}: any = await axios.put('user/updateUser', params);
      showToaster(message);
      return data;
    } catch (error: any) {
      showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For user Image upload
export const userImageUpload = createAsyncThunk(
  'user/uploadImage',
  async (params: any, thunkAPI) => {
    try {
      const {data}: any = await axios.post('upload/upload', params, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // showToaster(message);
      return data;
    } catch (error: any) {
      showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For user City List
export const getCityList = createAsyncThunk(
  'user/getCityList',
  async (_, thunkAPI) => {
    try {
      const {data}: any = await axios.get('common/state-and-city');
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For user password change
export const changePassword = createAsyncThunk(
  'user/passwordChange',
  async (params: IChangePasswordReq, thunkAPI) => {
    try {
      const {data, message}: any = await axios.post(
        'user/change-password',
        params,
      );
      showToaster(message);
      return data;
    } catch (error: any) {
      showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//Get Activity History
export const getActivityHistory = createAsyncThunk(
  'user/getActivityHistory',
  async (params: IActivityListReq, thunkAPI) => {
    try {
      const {data, count}: any = await axios.get('user/get-activity-logs', {
        params: params,
      });
      // showToaster(message);
      return {data, count};
    } catch (error: any) {
      // showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//Get Complaints
export const getComplaints = createAsyncThunk(
  'user/getComplaints',
  async (_, thunkAPI) => {
    try {
      const {data}: any = await axios.get('complaints/get-all-complaints');
      // showToaster(message);
      return data;
    } catch (error: any) {
      // showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//Get Complaint Details
export const getComplaintDetails = createAsyncThunk(
  'user/getComplaintDetails',
  async (_id: string, thunkAPI) => {
    try {
      const {data}: any = await axios.get(`complaints/?id=${_id}`);
      // showToaster(message);
      return data;
    } catch (error: any) {
      showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//Add Complaint
export const addComplaint = createAsyncThunk(
  'user/addComplaint',
  async (params: IAddComplaintReq, thunkAPI) => {
    try {
      const {data, message}: any = await axios.post('complaints', params);
      showToaster(message);
      return data;
    } catch (error: any) {
      showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//Get CMS Content
export const getCMSContent = createAsyncThunk(
  'user/getCMSContent',
  async (slug: string, thunkAPI) => {
    try {
      const {data}: any = await axios.get(`cms/?slug=${slug}`);
      // showToaster(message);
      return data;
    } catch (error: any) {
      // showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//Get FAQ Content
export const getFAQContent = createAsyncThunk(
  'user/getFAQContent',
  async (_, thunkAPI) => {
    try {
      const {data}: any = await axios.get('faq/get-all-faq');
      // showToaster(message);
      return data;
    } catch (error: any) {
      // showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//Get Support email and mobile
export const getSupportCred = createAsyncThunk(
  'user/getSupportCred',
  async (_, thunkAPI) => {
    try {
      const {data}: any = await axios.get('support-message/support-details');
      // showToaster(message);
      return data;
    } catch (error: any) {
      // showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//Send Support Message
export const sendSupportMsg = createAsyncThunk(
  'user/sendSupportMsg',
  async (params: ISendSupportMsgReq, thunkAPI) => {
    try {
      const {data, message}: any = await axios.post(
        'support-message/send-support-msg',
        params,
      );
      showToaster(message);
      return data;
    } catch (error: any) {
      showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//Get checkin /rating /alert count
export const getActivityCount = createAsyncThunk(
  'user/getActivityCount',
  async (_, thunkAPI) => {
    try {
      const {data}: any = await axios.get('user/get-activity-count');
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
//Get user setting
export const getUserSetting = createAsyncThunk(
  'user/getUserSetting',
  async (_, thunkAPI) => {
    try {
      const {data}: any = await axios.get('user/get-user-settings');
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//Update user setting
export const updateUserSetting = createAsyncThunk(
  'user/updateUserSetting',
  async (params: IUserSettingReq, thunkAPI) => {
    try {
      const {data, message}: any = await axios.put(
        'user/update-user-settings',
        params,
      );
      showToaster(message);
      return data;
    } catch (error: any) {
      showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//Send OTP to mobile no
export const sendOTPToPhone = createAsyncThunk(
  'user/sendOTPToPhone',
  async (params: IPhoneOTPReq, thunkAPI) => {
    try {
      const {data, message}: any = await axios.post(
        'user/send-mobile-verification-otp',
        params,
      );
      showToaster(message);
      return data;
    } catch (error: any) {
      showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);
//verify phone OTP
export const verifyPhoneOTP = createAsyncThunk(
  'user/verifyPhoneOTP',
  async (params: IVerifyPhoneOTPReq, thunkAPI) => {
    try {
      const {data, message}: any = await axios.post(
        'user/verify-mobile-verification-otp',
        params,
      );
      showToaster(message);
      return data;
    } catch (error: any) {
      showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For user current location update
export const updateCurrentLocation = createAsyncThunk(
  'user/updateCurrentLocation',
  async (params: IUpdateCurrentLocationReq, thunkAPI) => {
    try {
      const {data}: any = await axios.post('userLocation', params);
      // showToaster(message);
      return data;
    } catch (error: any) {
      // showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For count user install
export const userInstallCount = createAsyncThunk(
  'user/userInstallCount',
  async (params: IUserInstallCountReq, thunkAPI) => {
    console.log(params);
    try {
      const {data}: any = await axios.post(
        'app-reporting/ios-data-add',
        params,
      );
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For Get Banner List
export const getBannerList = createAsyncThunk(
  'user/getBannerList',
  async (_, thunkAPI) => {
    try {
      const {data}: any = await axios.get('adv-module/adv-baners-user');
      // showToaster(message);
      return data;
    } catch (error: any) {
      // showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For Banner View Count
export const updateBannerViewCount = createAsyncThunk(
  'user/updateBannerViewCount',
  async (Params: IBannerViewCountReq, thunkAPI) => {
    try {
      const {data}: any = await axios.post(
        'adv-module/banner-add-view',
        Params,
      );
      // showToaster(message);
      return data;
    } catch (error: any) {
      // showToaster(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);
