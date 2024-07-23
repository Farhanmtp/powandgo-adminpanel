import apiInstance from '.';
import { AppDispatch } from '@/redux/store';
import { updateGarageList } from '@/redux/slices/garageSlice';

export const addGarage = async (payload: any) => {
  try {
    const response = await apiInstance.post(`garages`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateGarage = async (payload: any, garageId: number) => {
  try {
    const response = await apiInstance.patch(`garages/${garageId}`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getUserGarage = () => async (dispatch: AppDispatch) => {
  try {
    const response = await apiInstance.get(`garages`);
    if (response.status === 200 && response.data) {
      dispatch(updateGarageList(response.data.data));
    } else {
      throw new Error('Get EVC Failed');
    }
  } catch (error) {
    throw error;
  }
};

export const getAllGarage = () => async (dispatch: AppDispatch) => {
  try {
    const response = await apiInstance.get(`garages/all`);
    if (response.status === 200 && response.data) {
      dispatch(updateGarageList(response.data.data));
    } else {
      throw new Error('Get EVC Failed');
    }
  } catch (error) {
    throw error;
  }
};

export const changeGarageStatus =
  (id: string, isActive: boolean) => async (dispatch: AppDispatch) => {
    try {
      const response = await apiInstance.post(`garages/status/${id}`, {
        isActive,
      });
      if (
        response.status !== 200 &&
        response.status !== 201 &&
        !response.data
      ) {
        throw new Error('EVC Status Change Failed');
      }
    } catch (error) {
      throw error;
    }
  };

export const getEvcByUser = () => async (dispatch: AppDispatch) => {
  try {
  } catch (error) {
    throw error;
  }
};

export const getSpecificGarage = async (id: number) => {
  try {
    const response = await apiInstance.get(`garages/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteGarage = (id: number) => async (dispatch: AppDispatch) => {
  try {
    const response = await apiInstance.delete(`garages/${id}`);
    if (response.status !== 200 && response.status !== 201 && !response.data) {
      throw new Error("Garage couldn't be deleted");
    }
  } catch (error) {
    throw error;
  }
};
