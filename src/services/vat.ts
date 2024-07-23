import { AppDispatch } from '@/redux/store';
import apiInstance from '.';
import { updateVatList } from '@/redux/slices/vat';

export const addVAT = (payload: any) => async (dispatch: AppDispatch) => {
  try {
    await apiInstance.post('vat', payload);
  } catch (error) {
    throw error;
  }
};

export const getVAT = () => async (dispatch: AppDispatch) => {
  try {
    let res = await apiInstance.get('vat');
    dispatch(updateVatList(res?.data?.data || []));
  } catch (error) {
    throw error;
  }
};

export const changeVatStatus =
  (id: string, isActive: boolean) => async (dispatch: AppDispatch) => {
    try {
      await apiInstance.post(`vat/status/${id}`, {
        isActive,
      });
    } catch (error) {
      throw error;
    }
  };

export const deleteVat = (id: string) => async (dispatch: AppDispatch) => {
  try {
    await apiInstance.delete(`vat/${id}`);
  } catch (error) {
    throw error;
  }
};

export const updateVAT =
  (id: number, payload: any) => async (dispatch: AppDispatch) => {
    try {
      await apiInstance.patch(`vat/${id}`, payload);
    } catch (error) {
      throw error;
    }
  };

export const getSpecificVAT = async (id: number) => {
  try {
    let res = await apiInstance.get(`vat/${id}`);
    return res?.data?.data || [];
  } catch (error) {
    throw error;
  }
};
