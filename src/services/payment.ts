import { AppDispatch } from '@/redux/store';
import apiInstance from '.';

export const addPayment = (payload: any) => async (dispatch: AppDispatch) => {
  try {
    await apiInstance.post('payment', payload);
  } catch (error) {
    throw error;
  }
};

export const deletePayment =
  (paymentId: number) => async (dispatch: AppDispatch) => {
    try {
      await apiInstance.delete(`payment/${paymentId}`);
    } catch (error) {
      throw error;
    }
  };

export const updatePayment =
  (paymentId: number, tokenId: string) => async (dispatch: AppDispatch) => {
    try {
      await apiInstance.put(`payment/${paymentId}`, {
        tokenId,
      });
    } catch (error) {
      throw error;
    }
  };
