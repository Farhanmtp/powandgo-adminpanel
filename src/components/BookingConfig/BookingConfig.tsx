'use client';

import React, { useEffect } from 'react';
import { getBookingConfig } from '@/services/bookingconfig';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import BookingConfigForm from '../Forms/BookingConfigForm';

const BookingConfig = () => {
  const dispatch = useAppDispatch();
  const bookingConfig = useAppSelector(
    (state: RootState) => state?.bookingConfig.bookingConfig
  );

  useEffect(() => {
    dispatch(getBookingConfig());
    return () => {};
  }, []);

  return (
    <div>
      <BookingConfigForm bookingConfig={bookingConfig} />
    </div>
  );
};

export default BookingConfig;
