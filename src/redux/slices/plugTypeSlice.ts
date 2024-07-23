import { createSlice } from '@reduxjs/toolkit';

export interface plugType {}

export interface garageState {
  plugTypeList: plugType[];
}

const initialState: garageState = {
  plugTypeList: [],
};

export const plugTypeSlice = createSlice({
  name: 'plugType',
  initialState,
  reducers: {
    updatePlugTypeList: (state, action) => {
      state.plugTypeList = action.payload;
    },
  },
});

export const { updatePlugTypeList } = plugTypeSlice.actions;

export default plugTypeSlice.reducer;
