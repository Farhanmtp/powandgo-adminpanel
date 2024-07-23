import { createSlice } from '@reduxjs/toolkit';

export interface CommissionState {
  commissionList: any;
}

const initialState: CommissionState = {
  commissionList: [],
};

export const commissionSlice = createSlice({
  name: 'commission',
  initialState,
  reducers: {
    updateCommission: (state, action) => {
      state.commissionList = action.payload;
    },
  },
});

export const { updateCommission } = commissionSlice.actions;

export default commissionSlice.reducer;
