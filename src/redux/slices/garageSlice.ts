import { createSlice } from '@reduxjs/toolkit';

export interface garage {}

export interface garageState {
  garageList: garage[];
}

const initialState: garageState = {
  garageList: [],
};

export const garageSlice = createSlice({
  name: 'garageList',
  initialState,
  reducers: {
    updateGarageList: (state, action) => {
      state.garageList = action.payload;
    },
  },
});

export const { updateGarageList } = garageSlice.actions;

export default garageSlice.reducer;
