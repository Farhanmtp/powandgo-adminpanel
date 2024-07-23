import { createSlice } from '@reduxjs/toolkit';

export interface userState {
  userList: any;
}

const initialState: userState = {
  userList: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserList: (state, action) => {
      state.userList = action.payload;
    },
  },
});

export const { updateUserList } = userSlice.actions;

export default userSlice.reducer;
