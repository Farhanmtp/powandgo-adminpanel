import { createSlice } from '@reduxjs/toolkit';

export interface vehicleInfo {}

export interface vehicleInfoState {
  vehicleInfoList: vehicleInfo[];
}

const initialState: vehicleInfoState = {
  vehicleInfoList: [],
};

export const vehicleInfoSlice = createSlice({
  name: 'vehicleInfo',
  initialState,
  reducers: {
    updateVehicleInfoList: (state, action) => {
      state.vehicleInfoList = action.payload;
    },
  },
});

export const { updateVehicleInfoList } = vehicleInfoSlice.actions;

export default vehicleInfoSlice.reducer;
