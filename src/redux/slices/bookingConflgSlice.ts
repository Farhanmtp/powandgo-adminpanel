import { createSlice } from '@reduxjs/toolkit';

export interface BookingConfigState {
  bookingConfig: any;
}

const initialState: BookingConfigState = {
  bookingConfig: [],
};

export const bookingConfigSlice = createSlice({
  name: 'bookingConfig',
  initialState,
  reducers: {
    updateBookingConfig: (state, action) => {
      state.bookingConfig = action.payload;
    },
  },
});

export const { updateBookingConfig } = bookingConfigSlice.actions;

export default bookingConfigSlice.reducer;
