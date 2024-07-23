import apiInstance from '.';
import { AppDispatch } from '@/redux/store';
import { updateBookingConfig } from '@/redux/slices/bookingConflgSlice';

export const getBookingConfig = () => async (dispatch: AppDispatch) => {
  try {
    const response = await apiInstance.get(`bookingconfig`);
    if (response.status === 200 && response.data) {
      dispatch(updateBookingConfig(response.data.data));
    } else {
      throw new Error('Get Booking Config Failed');
    }
  } catch (error) {
    throw error;
  }
};

export const postBookingConfig =
  (payload: any) => async (dispatch: AppDispatch) => {
    try {
      const response = await apiInstance.post(`bookingconfig`, payload);
      if (response.status === 201 && response.data) {
        dispatch(getBookingConfig());
      } else {
        throw new Error('Get Booking Config Failed');
      }
    } catch (error) {
      throw error;
    }
  };
