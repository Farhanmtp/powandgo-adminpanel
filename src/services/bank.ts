import apiInstance from '.';
import { AppDispatch } from '@/redux/store';

export const addIBAN = (payload: any) => async (dispatch: AppDispatch) => {
  try {
    const response = await apiInstance.post('bank', payload);
  } catch (error) {
    throw error;
  }
};

export const deleteIBAN = (id: number) => async (dispatch: AppDispatch) => {
  try {
    const response = await apiInstance.delete(`bank/${id}`);
  } catch (error) {
    throw error;
  }
};
