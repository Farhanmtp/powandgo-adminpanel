import { createSlice } from '@reduxjs/toolkit';

export interface BookingState {
  bookingList: any;
  incomeReceipts: any;
}

const initialState: BookingState = {
  bookingList: [],
  incomeReceipts: [],
};

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    updateBooking: (state, action) => {
      state.bookingList = action.payload;
    },
    updateIncomeReceipts: (state, action) => {
      state.incomeReceipts = action.payload;
    },
  },
});

export const { updateBooking, updateIncomeReceipts } = bookingSlice.actions;

export default bookingSlice.reducer;
