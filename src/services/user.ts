import { updateUserList } from '@/redux/slices/userSlice';
import apiInstance from '.';
import { AppDispatch } from '@/redux/store';

export const getAppUsers = () => async (dispatch: AppDispatch) => {
  try {
    const response = await apiInstance.get(`users/all`);
    if (response.status === 200 && response.data) {
      dispatch(updateUserList(response?.data?.data || []));
    } else {
      throw new Error('Get Users Failed');
    }
  } catch (error) {
    throw error;
  }
};

export const getSpecificUser = async (id: number) => {
  try {
    const response = await apiInstance.get(`users/${id}/profile`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile =
  (id: number, payload: any) => async (dispatch: AppDispatch) => {
    try {
      const response = await apiInstance.put(
        `users/${id}/update-profile-commercial`,
        payload
      );
    } catch (error) {
      throw error;
    }
  };

export const updateUserStatus =
  (id: number, payload: any) => async (dispatch: AppDispatch) => {
    try {
      const response = await apiInstance.put(`users/${id}/status`, payload);
      dispatch(getAppUsers());
    } catch (error) {
      throw error;
    }
  };

export const updateUserEmail =
  (id: number, payload: any) => async (dispatch: AppDispatch) => {
    try {
      const response = await apiInstance.put(
        `users/${id}/update-email`,
        payload
      );
    } catch (error) {
      throw error;
    }
  };

export const updateUserPassword =
  (payload: any) => async (dispatch: AppDispatch) => {
    try {
      const response = await apiInstance.patch('users/reset-password', payload);
    } catch (error) {
      throw error;
    }
  };

export const forgotPassword =
  (payload: any) => async (dispatch: AppDispatch) => {
    try {
      const response = await apiInstance.post('users/forgot-password', payload);
    } catch (error) {
      throw error;
    }
  };

export const deleteUserProfile =
  (id: number) => async (dispatch: AppDispatch) => {
    try {
      await apiInstance.delete(`users/${id}/delete`);
    } catch (error) {
      throw error;
    }
  };

export const updatePreference =
  (payload: any) => async (dispatch: AppDispatch) => {
    try {
      await apiInstance.patch('users/preference', payload);
    } catch (error) {
      throw error;
    }
  };
