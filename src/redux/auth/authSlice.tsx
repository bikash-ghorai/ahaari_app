import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {
  checkLogin,
  forgotPassword,
  login,
  logout,
  resetPassword,
  sendOtp,
  signup,
  verifyUser,
} from './authAction';
import {IUserRes} from '../../../types';
import {userDetailsUpdate, verifyPhoneOTP} from '../user/userAction';

export interface AuthState {
  isLoading: boolean;
  user: IUserRes | null;
  isBarAdmin: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isLoading: false,
  user: null,
  isBarAdmin: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsBarAdmin: (state, action: PayloadAction<boolean>) => {
      state.isBarAdmin = action.payload;
    },
  },
  extraReducers: builder => {
    //login reducer
    builder.addCase(login.pending, (state: AuthState) => {
      state.isLoading = true;
    });
    builder.addCase(login.fulfilled, (state: AuthState, action: any) => {
      state.user = action.payload;
      state.isBarAdmin = action.payload?.is_bar_admin;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(login.rejected, (state: AuthState, action: any) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    //signup reducer
    builder.addCase(signup.pending, (state: AuthState) => {
      state.isLoading = true;
    });
    builder.addCase(signup.fulfilled, (state: AuthState) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(signup.rejected, (state: AuthState, action: any) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    //verify user email/phone reducer
    builder.addCase(verifyUser.pending, (state: AuthState) => {
      state.isLoading = true;
    });
    builder.addCase(verifyUser.fulfilled, (state: AuthState, action: any) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(verifyUser.rejected, (state: AuthState, action: any) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    //send Otp reducer
    builder.addCase(sendOtp.pending, (state: AuthState) => {
      state.isLoading = true;
    });
    builder.addCase(sendOtp.fulfilled, (state: AuthState) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(sendOtp.rejected, (state: AuthState, action: any) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    //checkLogin reducer
    builder.addCase(checkLogin.fulfilled, (state: AuthState, action: any) => {
      state.user = action.payload;
      state.isBarAdmin = action.payload?.is_bar_admin;
      state.error = null;
    });

    //forgotPassWord reducer
    builder.addCase(forgotPassword.pending, (state: AuthState) => {
      state.isLoading = true;
    });
    builder.addCase(forgotPassword.fulfilled, (state: AuthState) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(
      forgotPassword.rejected,
      (state: AuthState, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
      },
    );

    //setNewPassword reducer
    builder.addCase(resetPassword.pending, (state: AuthState) => {
      state.isLoading = true;
    });
    builder.addCase(resetPassword.fulfilled, (state: AuthState) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(resetPassword.rejected, (state: AuthState, action: any) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    //Set User Details Reducer
    builder.addCase(
      userDetailsUpdate.fulfilled,
      (state: AuthState, action: any) => {
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      },
    );
    //user phone verify
    builder.addCase(
      verifyPhoneOTP.fulfilled,
      (state: AuthState, action: any) => {
        state.error = null;
        state.user = action.payload;
      },
    );

    //user logout reducer
    builder.addCase(logout.pending, (state: AuthState) => {
      state.isLoading = true;
    });
    builder.addCase(logout.fulfilled, (state: AuthState) => {
      state.isLoading = false;
      state.user = null;
      state.isBarAdmin = false;
      state.error = null;
    });
    builder.addCase(logout.rejected, (state: AuthState, action: any) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const {setIsBarAdmin} = authSlice.actions;
export default authSlice.reducer;
