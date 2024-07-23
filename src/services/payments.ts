import { AppDispatch } from '@/redux/store';
import apiInstance from '.';
import { updateIncomeReceipts } from '@/redux/slices/booking';

export const getProviderIncomeReceipts =
  () => async (dispatch: AppDispatch) => {
    try {
      const res = await apiInstance.get('invoice/income/provider');
      if (res.status === 200) {
        dispatch(updateIncomeReceipts(res?.data?.data || []));
      }
    } catch (error) {
      throw error;
    }
  };

export const getAdminIncomeReceipts = () => async (dispatch: AppDispatch) => {
  try {
    const res = await apiInstance.get('invoice/income/admin');
    if (res.status === 200) {
      dispatch(updateIncomeReceipts(res?.data?.data || []));
    }
  } catch (error) {
    throw error;
  }
};

export const getProviderPaymentById = async (id: number) => {
  try {
    const res = await apiInstance.get(`invoice/income/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
