import { AppDispatch } from '@/redux/store';
import apiInstance from '.';
import { updateBooking } from '@/redux/slices/booking';

export const getBookings = () => async (dispatch: AppDispatch) => {
  try {
    const res = await apiInstance.get('booking');
    if (res.status === 200) {
      dispatch(updateBooking(res?.data?.data || []));
    }
  } catch (error) {
    throw error;
  }
};

export const getBookingsByAdmin = () => async (dispatch: AppDispatch) => {
  try {
    const res = await apiInstance.get('booking/all');
    if (res.status === 200) {
      dispatch(updateBooking(res?.data?.data || []));
    }
  } catch (error) {
    throw error;
  }
};

export const getBookingsOfProvider = () => async (dispatch: AppDispatch) => {
  try {
    const res = await apiInstance.get('booking/user/provider');
    if (res.status === 200) {
      dispatch(updateBooking(res?.data?.data || []));
    }
  } catch (error) {
    throw error;
  }
};
