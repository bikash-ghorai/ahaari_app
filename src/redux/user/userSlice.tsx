import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { getAddressList, getMyProfile, logout, verifyOTP } from './userAction';
import { IAddress, IUser } from '../../types';

export interface UserState {
  userData: IUser | null;
  addresses: IAddress[] | null;
  userCurrentCoords: {
    latitude: any;
    longitude: any;
  } | null;
  error: string | null;
}

const initialState: UserState = {
  userData: null,
  addresses: [],
  userCurrentCoords: null,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<IUser | null>) => {
      state.userData = action.payload;
    },
    setUserCurrentCoords: (state, action: PayloadAction<any>) => {
      state.userCurrentCoords = action.payload;
    },
  },
  extraReducers: builder => {
    //user phone verify
    builder.addCase(verifyOTP.fulfilled, (state: UserState, action: any) => {
      state.error = null;
      state.userData = action.payload?.data?.user;
    });

    //user phone verify
    builder.addCase(getMyProfile.fulfilled, (state: UserState, action: any) => {
      state.error = null;
      state.userData = action.payload?.data;
    });

    builder.addCase(
      getAddressList.fulfilled,
      (state: UserState, action: any) => {
        state.addresses = action.payload?.data;
      },
    );

    //user logout reducer
    builder.addCase(logout.pending, (state: UserState) => {
      state.error = null;
    });
    builder.addCase(logout.fulfilled, (state: UserState) => {
      state.userData = null;
      state.error = null;
    });
    builder.addCase(logout.rejected, (state: UserState, action: any) => {
      state.error = action.payload;
    });
  },
});

export const { setUserData, setUserCurrentCoords } = userSlice.actions;
export default userSlice.reducer;
