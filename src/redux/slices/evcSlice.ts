import { createSlice } from '@reduxjs/toolkit';

export interface EvcState {
  usersEvc: any;
  evcByAccountType: any;
}

const initialState: EvcState = {
  usersEvc: [],
  evcByAccountType: [],
};

export const evcSlice = createSlice({
  name: 'evc',
  initialState,
  reducers: {
    updateUsersEvc: (state, action) => {
      state.usersEvc = action.payload;
    },
    updateEvcByAccountType: (state, action) => {
      state.evcByAccountType = action.payload;
    },
  },
});

export const { updateUsersEvc, updateEvcByAccountType } = evcSlice.actions;

export default evcSlice.reducer;
