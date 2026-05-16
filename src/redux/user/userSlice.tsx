import {createSlice} from '@reduxjs/toolkit';
import {
  addComplaint,
  changePassword,
  getActivityCount,
  getActivityHistory,
  getCMSContent,
  getComplaintDetails,
  getComplaints,
  getFAQContent,
  userDetailsUpdate,
  userImageUpload,
} from './userAction';
import {logout} from '../auth/authAction';
import {IActivityCountData} from '../../../types';

export interface UserState {
  isLoading: boolean;
  activityCount: IActivityCountData | null;
  error: string | null;
}

const initialState: UserState = {
  isLoading: false,
  error: null,
  activityCount: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    //User details update reducer
    builder.addCase(userDetailsUpdate.pending, (state: UserState) => {
      state.isLoading = true;
    });
    builder.addCase(userDetailsUpdate.fulfilled, (state: UserState) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(
      userDetailsUpdate.rejected,
      (state: UserState, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
      },
    );

    //User Image Upload reducer
    builder.addCase(userImageUpload.pending, (state: UserState) => {
      state.isLoading = true;
    });
    builder.addCase(userImageUpload.fulfilled, (state: UserState) => {
      state.error = null;
    });
    builder.addCase(
      userImageUpload.rejected,
      (state: UserState, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
      },
    );

    //Change Password reducer
    builder.addCase(changePassword.pending, (state: UserState) => {
      state.isLoading = true;
    });
    builder.addCase(changePassword.fulfilled, (state: UserState) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(
      changePassword.rejected,
      (state: UserState, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
      },
    );

    //Get Activity History reducer
    builder.addCase(getActivityHistory.pending, (state: UserState) => {
      state.isLoading = true;
    });
    builder.addCase(getActivityHistory.fulfilled, (state: UserState) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(
      getActivityHistory.rejected,
      (state: UserState, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
      },
    );

    //Get Complaints reducer
    builder.addCase(getComplaints.pending, (state: UserState) => {
      state.isLoading = true;
    });
    builder.addCase(getComplaints.fulfilled, (state: UserState) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getComplaints.rejected, (state: UserState, action: any) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    //Get Complaint Details reducer
    builder.addCase(getComplaintDetails.pending, (state: UserState) => {
      state.isLoading = true;
    });
    builder.addCase(getComplaintDetails.fulfilled, (state: UserState) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(
      getComplaintDetails.rejected,
      (state: UserState, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
      },
    );

    //Add Complaint reducer
    builder.addCase(addComplaint.pending, (state: UserState) => {
      state.isLoading = true;
    });
    builder.addCase(addComplaint.fulfilled, (state: UserState) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(addComplaint.rejected, (state: UserState, action: any) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    //Get Activity count
    builder.addCase(
      getActivityCount.fulfilled,
      (state: UserState, action: any) => {
        state.error = null;
        state.activityCount = action.payload;
      },
    );
    builder.addCase(
      getActivityCount.rejected,
      (state: UserState, action: any) => {
        state.error = action.payload;
        state.activityCount = null;
      },
    );

    //Get CMS Content
    builder.addCase(
      getCMSContent.pending,
      (state: UserState) => {
        state.isLoading = true;
      },
    );
    builder.addCase(
      getCMSContent.fulfilled,
      (state: UserState) => {
        state.error = null;
        state.isLoading = false;
      },
    );
    builder.addCase(
      getCMSContent.rejected,
      (state: UserState, action: any) => {
        state.error = action.payload;
        state.isLoading = false;
      },
    );

     //Get CMS Content
     builder.addCase(
      getFAQContent.pending,
      (state: UserState) => {
        state.isLoading = true;
      },
    );
    builder.addCase(
      getFAQContent.fulfilled,
      (state: UserState) => {
        state.error = null;
        state.isLoading = false;
      },
    );
    builder.addCase(
      getFAQContent.rejected,
      (state: UserState, action: any) => {
        state.error = action.payload;
        state.isLoading = false;
      },
    );

    //User logout reducer
    builder.addCase(logout.fulfilled, (state: UserState) => {
      state.isLoading = false;
      state.error = null;
      state.activityCount = null;
    });
  },
});

export default userSlice.reducer;
