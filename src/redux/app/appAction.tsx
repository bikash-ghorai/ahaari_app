import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';
import { IRestaurant } from '../../types';

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
