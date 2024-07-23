'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AppInputField from '../Base/AppInputField';
import AppButton from '../Base/AppButton';
import { useAppDispatch } from '@/redux/hooks';
import { startLoading, stopLoading } from '@/redux/slices/commonSlice';
import { showNotification } from '@/redux/slices/commonSlice';
import { forgotPassword, updateUserPassword } from '@/services/user';
import { reloadSession } from '@/utils/profile';
import AppImage from '../Base/AppImage';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
});

const ForgotPasswordForm = () => {
  const dispatch = useAppDispatch();

  let initalValues = {
    email: '',
  };

  const formik = useFormik({
    initialValues: initalValues,
    validationSchema: validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    // enableReinitialize: true,
    onSubmit: (values) => {
      let payload = {
        email: values.email,
      };

      dispatch(startLoading());
      dispatch(forgotPassword(payload))
        .then(() => {
          dispatch(
            showNotification({
              type: 'successful',
              message: 'Password Reset Email Sent',
            })
          );
        })
        .catch((e) => {
          dispatch(
            showNotification({
              type: 'error',
              message:
                e?.response?.data?.message ||
                'Failed to send Password Reset Email',
            })
          );
        })
        .finally(() => {
          dispatch(stopLoading());
        });
    },
  });

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6">
      <div className="w-fit mx-auto">
        <AppImage
          src="/site/logo.svg"
          alt="website logo"
          width={174}
          height={42}
        />
      </div>
      <div className="rounded-[22px] overflow-hidden flex flex-col gap-5 items-center justify-center h-[300px] mx-[10px] px-[15px] sm:w-[500px] md:w-[600px] max-w-full sm:mx-auto backdrop-blur-[20px] bg-gradient-to-b from-[#1B204A70] to-[#3C42701F]">
        <h3 className="text-2xl font-semibold leading-6">Forgot Password</h3>

        <div>
          <AppInputField
            title="Email *"
            value={formik.values.email}
            inputHandler={formik.handleChange}
            inputProps={{ name: 'email' }}
            error={
              formik.touched.email && formik.errors.email
                ? String(formik.errors.email)
                : ''
            }
            type="email"
          />
        </div>

        <div className="flex flex-row gap-[20px] flex-wrap items-end">
          <AppButton
            onClick={formik.submitForm}
            className="px-6 py-3  mt-5"
            primary
          >
            Forgot Password
          </AppButton>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
