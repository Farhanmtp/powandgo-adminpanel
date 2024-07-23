'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AppImage from '@/components/Base/AppImage';
import { useFormik } from 'formik';
import AppButton from '@/components/Base/AppButton';
import { resetPassword } from '@/services/auth';
import * as Yup from 'yup';
import AppToast from '@/components/Base/AppToast';
import { useAppDispatch } from '@/redux/hooks';
import { startLoading, stopLoading } from '@/redux/slices/commonSlice';
import { passwordValidation } from '@/constants/AppMessages';
import { passwordRegex } from '@/constants/AppConstants';
import AppInputField from '@/components/Base/AppInputField';

const ResetPassword = () => {
  const dispatch = useAppDispatch();
  const [toastMessage, setToastMessage] = useState({
    type: 'info',
    message: '',
  });
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required('New Password is required')
      .matches(passwordRegex, passwordValidation),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
  });

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      resetPasswordHandler(values.newPassword);
    },
  });

  let initialMessage = {
    type: '',
    text: '',
  };

  const [message, setMessage] = useState(initialMessage);

  const resetPasswordHandler = async (newPassword: string) => {
    setMessage(initialMessage);
    dispatch(startLoading());
    await resetPassword(String(token), String(newPassword))
      .then(() => {
        setToastMessage({
          type: 'successful',
          message: 'Password Reset Successfully',
        });
      })
      .catch((error) => {
        if (error?.response?.data?.statusCode === 444) {
          setMessage({
            type: 'error',
            text: error?.response?.data?.message,
          });
          return;
        }

        setToastMessage({
          type: 'error',
          message:
            error?.response?.data?.message || 'Password reset Unsuccessful',
        });
      })
      .finally(() => {
        dispatch(stopLoading());
      });

    formik.resetForm();
  };

  if (!token || !email) {
    return (
      <div>
        <h1>Invalid URL!</h1>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 flex justify-center items-center">
        <div className="h-full flex items-center justify-center flex-col gap-6">
          <AppImage
            height={200}
            width={200}
            src="/site/logo.svg"
            alt="App Logo"
          />
          <div className="rounded-[22px] overflow-hidden flex flex-col gap-5 items-center justify-center h-[400px] mx-[10px] px-[15px] sm:w-[500px] md:w-[600px] max-w-full sm:mx-auto backdrop-blur-[20px] bg-gradient-to-b from-[#1B204A70] to-[#3C42701F]">
            <form
              className="flex flex-col justify-center md:w-[400px] gap-[20px]"
              onSubmit={formik.handleSubmit}
            >
              <h3 className="text-2xl text-center font-semibold leading-6">
                Reset Password
              </h3>

              <div>
                <AppInputField
                  title="New Password *"
                  value={formik.values.newPassword}
                  inputHandler={formik.handleChange}
                  inputProps={{ name: 'newPassword' }}
                  error={
                    formik.touched.newPassword && formik.errors.newPassword
                      ? String(formik.errors.newPassword)
                      : ''
                  }
                  type="password"
                  containerClass="!w-full"
                  className="!w-full"
                />
              </div>

              <div>
                <AppInputField
                  title="Confirm Password *"
                  value={formik.values.confirmPassword}
                  inputHandler={formik.handleChange}
                  inputProps={{ name: 'confirmPassword' }}
                  error={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                      ? String(formik.errors.confirmPassword)
                      : ''
                  }
                  type="password"
                  containerClass="!w-full"
                  className="!w-full"
                />
              </div>

              <AppButton
                primary
                className="py-3"
                type="submit"
                onClick={() => {}}
              >
                Reset Password
              </AppButton>
              <p
                className={`${
                  message.type === 'error' ? 'text-red-500' : ''
                } text-sm`}
              >
                {message.text}
              </p>
            </form>
          </div>
        </div>
      </div>
      {toastMessage.message && (
        <AppToast
          type={toastMessage.type}
          message={toastMessage.message}
          onClose={() => {
            setToastMessage({
              type: 'info',
              message: '',
            });
          }}
        />
      )}
    </>
  );
};

export default ResetPassword;
