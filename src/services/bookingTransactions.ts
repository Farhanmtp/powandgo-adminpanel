import { AppDispatch } from '@/redux/store';
import apiInstance from '.';
import { updateBookingTransactions } from '@/redux/slices/bookingTransactionsSlice';

export const getAllInvoice = () => async (dispatch: AppDispatch) => {
  try {
    const response = await apiInstance.get(`invoice/all`);
    if (response.status === 200 && response.data) {
      dispatch(updateBookingTransactions(response.data.data));
    } else {
      throw new Error('Failed to fetch Transactions');
    }
  } catch (error) {
    throw error;
  }
};

export const getProviderInvoice = () => async (dispatch: AppDispatch) => {
  try {
    const response = await apiInstance.get(`invoice`);
    if (response.status === 200 && response.data) {
      dispatch(updateBookingTransactions(response.data.data));
    } else {
      throw new Error('Failed to fetch User Transactions');
    }
  } catch (error) {
    throw error;
  }
};

export const deleteInvoice = (id: number) => async (dispatch: AppDispatch) => {
  try {
    const response = await apiInstance.delete(`invoice/${id}`);
    if (response.status !== 200 && response.status !== 201 && !response.data) {
      throw new Error("Garage couldn't be deleted");
    }
  } catch (error) {
    throw error;
  }
};
