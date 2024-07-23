import apiInstance from '.';
import {
  updateEvcByAccountType,
  updateUsersEvc,
} from '@/redux/slices/evcSlice';
import { AppDispatch } from '@/redux/store';

export const getEvcByUser = () => async (dispatch: AppDispatch) => {
  try {
    const response = await apiInstance.get(`evc/user`);
    if (response.status === 200 && response.data) {
      dispatch(updateUsersEvc(response.data.data));
    } else {
      throw new Error('Get EVC Failed');
    }
  } catch (error) {
    throw error;
  }
};

export const changeEvcStatus =
  (id: string, isActive: boolean) => async (dispatch: AppDispatch) => {
    try {
      const response = await apiInstance.post(`evc/status/${id}`, { isActive });
      if (
        (response.status === 200 || response.status === 201) &&
        response.data
      ) {
        // dispatch(getEvcByUser());
      } else {
        throw new Error('EVC Status Change Failed');
      }
    } catch (error) {
      throw error;
    }
  };

export const createEVC = (evc: any) => async (dispatch: AppDispatch) => {
  try {
    const response = await apiInstance.post('evc', { ...evc });
    if ((response.status === 200 || response.status === 201) && response.data) {
      // dispatch(getEvcByUser());
    } else {
      throw new Error('EVC Creation Failed');
    }
  } catch (error) {
    throw error;
  }
};

export const updateEVC =
  (evc: any, evcId: number) => async (dispatch: AppDispatch) => {
    try {
      const response = await apiInstance.patch(`evc/${evcId}`, { ...evc });
      if (
        (response.status === 200 || response.status === 201) &&
        response.data
      ) {
        // dispatch(getEvcByUser());
      } else {
        throw new Error('EVC Update Failed');
      }
    } catch (error) {
      throw error;
    }
  };

export const getEvcByAdmin = () => async (dispatch: AppDispatch) => {
  try {
    const response = await apiInstance.get(`evc`);
    if (response.status === 200 && response.data) {
      dispatch(updateUsersEvc(response.data.data));
    } else {
      throw new Error('Get EVC Failed');
    }
  } catch (error) {
    throw error;
  }
};

export const getSpecificEvc = async (id: number) => {
  try {
    const response = await apiInstance.get(`evc/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllEvcByUserType =
  (userType: string) => async (dispatch: AppDispatch) => {
    try {
      const response = await apiInstance.get(`evc/user/${userType}`);
      if (response.status === 200 && response.data) {
        dispatch(updateEvcByAccountType(response.data.data));
      } else {
        throw new Error('Get All EVC by User Type Failed');
      }
    } catch (error) {
      throw error;
    }
  };

export const searchAPI = async () => {
  const response = await apiInstance.get(
    `evc/search?vehicleId=1&long=74.323&lat=31.523`
  );
  console.log(response);
};
