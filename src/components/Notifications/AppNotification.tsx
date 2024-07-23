'use client';

import React from 'react';
import AppToast from '@/components/Base/AppToast';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { useAppDispatch } from '@/redux/hooks';
import { clearNotification } from '@/redux/slices/commonSlice';

const AppNotification = () => {
  const toastMessage = useAppSelector(
    (state: RootState) => state?.common.toastMessage
  );
  const dispatch = useAppDispatch();
  return (
    <div>
      {toastMessage.message && (
        <AppToast
          type={toastMessage.type}
          message={toastMessage.message}
          duration={toastMessage?.duration || 3000}
          onClose={() => {
            dispatch(clearNotification());
          }}
        />
      )}
    </div>
  );
};

export default AppNotification;
