import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { logout } from '../user/userAction';

export interface appState {
  cartStateValue: any;
}

const initialState: appState = {
  cartStateValue: null,
};

export const app = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCartToState: (state, action: PayloadAction<any>) => {
      state.cartStateValue = action.payload;
    },
  },
  extraReducers: builder => {
    //User logout reducer
    builder.addCase(logout.fulfilled, (state: appState) => {
      state.cartStateValue = null;
    });
  },
});

export const { setCartToState } = app.actions;

export default app.reducer;
