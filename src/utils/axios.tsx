import axios from 'axios';
import {deleteAuthToken} from './storage';
import * as navigation from './navigationRef';
import {Constant} from './constants';

const axiosInstance = axios.create({
  baseURL: Constant.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    app_type: 'user',
  },
});

axiosInstance.interceptors.response.use(
  function (response) {
    console.log(response.config.url + ': axios-response', response);
    if (response.data?.success) {
      return response.data;
    } else {
      const message = response.data?.message;
      return Promise.reject(message);
    }
  },
  async function (error) {
    console.log((error.config.url || '') + ': axios-error', error);
    let message = '';
    if (error.response) {
      if (error.response.status === 401) {
        removeApiToken();
        await deleteAuthToken();
        navigation.reset('Auth');
      }
      message = error.response.data?.message || error?.message;
    } else {
      message = error.message;
    }
    return Promise.reject(message);
  },
);

export const setApiToken = (AUTH_TOKEN: string) => {
  return (axiosInstance.defaults.headers.common.Authorization = `Bearer ${AUTH_TOKEN}`);
};

export const removeApiToken = () => {
  return (axiosInstance.defaults.headers.common.Authorization = '');
};

export default axiosInstance;
