import { createSlice } from '@reduxjs/toolkit';

export interface BookingTransactionsState {
  bookingTransactionsList: any;
}

const initialState: BookingTransactionsState = {
  bookingTransactionsList: [],
};

export const bookingTransactionsSlice = createSlice({
  name: 'bookingTransactions',
  initialState,
  reducers: {
    updateBookingTransactions: (state, action) => {
      state.bookingTransactionsList = action.payload;
    },
  },
});

export const { updateBookingTransactions } = bookingTransactionsSlice.actions;

export default bookingTransactionsSlice.reducer;
