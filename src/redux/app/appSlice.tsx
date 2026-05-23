import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { logout } from '../user/userAction';

export interface appState {
  isLocationPermissionAllowed: boolean;
  orderCompletedModalVisible: boolean;
  orderSendedModalVisible: boolean;
  markerListModalShow: boolean;
  storeLocation: any;
}

const initialState: appState = {
  isLocationPermissionAllowed: false,
  orderCompletedModalVisible: false,
  orderSendedModalVisible: false,
  markerListModalShow: false,
  storeLocation: null,
};

export const app = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLocationDenyModal: (state, action: PayloadAction<boolean>) => {
      state.isLocationPermissionAllowed = action.payload;
    },
    setStoreLocation: (state, action: any) => {
      state.storeLocation = action.payload;
    },
    setOrderCompletedModalVisible: (state, action: PayloadAction<boolean>) => {
      state.orderCompletedModalVisible = action.payload;
    },
    setOrderSendedModalVisible: (state, action: PayloadAction<boolean>) => {
      state.orderSendedModalVisible = action.payload;
    },
    setMarkerListModalShow: (state, action: PayloadAction<boolean>) => {
      state.markerListModalShow = action.payload;
    },
  },
  extraReducers: builder => {
    //User logout reducer
    builder.addCase(logout.fulfilled, (state: appState) => {
      state.isLocationPermissionAllowed = false;
      state.orderCompletedModalVisible = false;
      state.orderSendedModalVisible = false;
      state.markerListModalShow = false;
      state.storeLocation = null;
    });
  },
});

export const {
  setLocationDenyModal,
  setStoreLocation,
  setOrderCompletedModalVisible,
  setOrderSendedModalVisible,
  setMarkerListModalShow,
} = app.actions;

export default app.reducer;
