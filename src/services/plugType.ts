import { AppDispatch } from '@/redux/store';
import apiInstance from '.';
import { updatePlugTypeList } from '@/redux/slices/plugTypeSlice';
import { AxiosResponse } from 'axios';

export const getPlugTypes = async () => {
  try {
    const response = await apiInstance.get('plugTypes?powandgoDashboard=true');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addPlugType = async (payload: FormData) => {
  try {
    const response = await apiInstance.post(`plugtypes`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePlugType = async (payload: any, plugTypeId: number) => {
  try {
    const response = await apiInstance.put(`plugtypes/${plugTypeId}`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePlugTypeStatus =
  (id: string, isActive: boolean) => async (dispatch: AppDispatch) => {
    try {
      await apiInstance.post(`plugtypes/status/${id}`, {
        isActive,
      });
<<<<<<< HEAD

      if (response.status === 200 || response.status === 201) {
        return response.data;
      } else {
        throw new Error('Plug Type Status Change Failed');
      }
=======
>>>>>>> f8d7678d100a2d9c7139227ffe43748efe56f802
    } catch (error) {
      throw error;
    }
  };

export const deletePlugType = (id: number) => async (dispatch: AppDispatch) => {
  try {
    const response = await apiInstance.delete(`/plugtypes/${id}`);
    if (response.status !== 200 && response.status !== 201 && !response.data) {
      throw new Error("Plug Type couldn't be deleted");
    }
  } catch (error) {
    throw error;
  }
};

export const getSpecificPlugType = async (id: number) => {
  try {
    const response = await apiInstance.get(`plugtypes/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFilteredPlugType = async (isActive: boolean, name: string) => {
  try {
    const response = await apiInstance.get(`plugtypes/search`, {
      params: {
        isActive: isActive,
        name: name,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllPlugTypes = () => async (dispatch: AppDispatch) => {
  try {
    const res = await apiInstance.get('plugtypes');
    if (res.status === 200) {
      dispatch(updatePlugTypeList(res?.data?.data || []));
    }
  } catch (error) {
    throw error;
  }
};
