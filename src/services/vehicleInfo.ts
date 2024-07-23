import { AppDispatch } from '@/redux/store';
import apiInstance from '.';
import { updateVehicleInfoList } from '@/redux/slices/vehicleInfoSlice';

export const addVehicleInfo =
  (payload: any) => async (dispatch: AppDispatch) => {
    try {
      await apiInstance.post('vehicleinfo', payload);
    } catch (error) {
      throw error;
    }
  };

export const updateVehicleInfo =
  (payload: any, id: number) => async (dispatch: AppDispatch) => {
    try {
      await apiInstance.patch(`vehicleinfo/${id}`, payload);
    } catch (error) {
      throw error;
    }
  };

export const getAllVehicleInfo = () => async (dispatch: AppDispatch) => {
  try {
    const res = await apiInstance.get('vehicleinfo');
    if (res.status === 200) {
      dispatch(updateVehicleInfoList(res?.data?.data || []));
    }
  } catch (error) {
    throw error;
  }
};

export const changeVehicleInfoStatus =
  (id: string, isActive: boolean) => async (dispatch: AppDispatch) => {
    try {
      await apiInstance.post(`vehicleinfo/status/${id}`, {
        isActive,
      });
    } catch (error) {
      throw error;
    }
  };

export const deleteVehicleInfo =
  (id: number) => async (dispatch: AppDispatch) => {
    try {
      await apiInstance.delete(`vehicleinfo/${id}`);
    } catch (error) {
      throw error;
    }
  };

export const getVehicleInfo = async (id: number) => {
  try {
    const res = await apiInstance.get(`vehicleinfo/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addMultipleVehicleInfo =
  (payload: any) => async (dispatch: AppDispatch) => {
    try {
      await apiInstance.post('vehicleinfo/multiple', payload);
    } catch (error) {
      throw error;
    }
  };
