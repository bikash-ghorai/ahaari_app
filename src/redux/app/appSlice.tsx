import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { logout } from '../user/userAction';
import { getPendingRatings } from './appAction';

export interface appState {
  cartStateValue: any;
  isBadWeather: boolean;
  hasPendingRating: boolean;
}

const initialState: appState = {
  cartStateValue: null,
  isBadWeather: false,
  hasPendingRating: false,
};

export const app = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCartToState: (state, action: PayloadAction<any>) => {
      state.cartStateValue = action.payload;
    },
    setIsBadWeather: (state, action: PayloadAction<boolean>) => {
      state.isBadWeather = action.payload;
    }
  },
  extraReducers: builder => {
    builder.addCase(getPendingRatings.fulfilled, (state: appState, action: any) => {
      state.hasPendingRating = action.payload?.data;
    });
    //User logout reducer
    builder.addCase(logout.fulfilled, (state: appState) => {
      state.cartStateValue = null;
      state.isBadWeather = false;
      state.hasPendingRating = false;
    });
  },
});

export const { setCartToState, setIsBadWeather } = app.actions;

export default app.reducer;
