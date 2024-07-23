import React, { FC } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AppInputField from '../Base/AppInputField';
import AppButton from '../Base/AppButton';
import { useAppDispatch } from '@/redux/hooks';
import { startLoading, stopLoading } from '@/redux/slices/commonSlice';
import { showNotification } from '@/redux/slices/commonSlice';
import { updateUserPassword } from '@/services/user';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { passwordRegex } from '@/constants/AppConstants';
import { passwordValidation } from '@/constants/AppMessages';
import { forgotPassword } from '@/services/user';

interface UpdatePasswordFormProps {
  hideModal: () => void;
}

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required('Password is required')
    .matches(passwordRegex, passwordValidation),

  newPassword: Yup.string()
    .required('New Password is required')
    .matches(passwordRegex, passwordValidation)
    .notOneOf(
      [Yup.ref('password')],
      'New Password must be different from Current Password'
    ),

  confirmNewPassword: Yup.string()
    .required('Confirm Password is required')
    .oneOf(
      [Yup.ref('newPassword')],
      'Please enter the same passwords in both fields'
    )
    .matches(passwordRegex, passwordValidation),
});

const UpdatePasswordForm: FC<UpdatePasswordFormProps> = ({ hideModal }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { data } = useSession();

  let initalValues = {
    password: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const formik = useFormik({
    initialValues: initalValues,
    validationSchema: validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    // enableReinitialize: true,
    onSubmit: (values) => {
      let payload = {
        oldPassword: values.password,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword,
        password: values.password,
      };

      dispatch(startLoading());
      dispatch(updateUserPassword(payload))
        .then(() => {
          dispatch(
            showNotification({
              type: 'successful',
              message: 'Your Password has been updated successfully',
            })
          );
          hideModal();
        })
        .catch((e) => {
          if (e?.response?.data?.statusCode === 444) {
            formik.setErrors({
              password: e?.response?.data?.message,
            });
            return;
          }
          dispatch(
            showNotification({
              type: 'error',
              message:
                e?.response?.data?.message || 'Failed to Update User Password',
            })
          );
          hideModal();
        })
        .finally(() => {
          dispatch(stopLoading());
        });
    },
  });

  const forgotPasswordHandler = () => {
    let payload = {
      email: data?.user?.detail?.email,
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
  };

  let formRow = 'flex flex-row gap-[40px] flex-wrap';

  return (
    <>
      <h2 className="mb-[20px] text-xl">Change Password</h2>
      <div className="flex flex-col gap-[20px] flex-wrap">
        <div className={`${formRow}`}>
          <AppInputField
            title="Current Password *"
            value={formik.values.password}
            inputHandler={formik.handleChange}
            inputProps={{ name: 'password' }}
            error={
              formik.touched.password && formik.errors.password
                ? String(formik.errors.password)
                : ''
            }
            type="password"
          />
        </div>

        <div className={`${formRow}`}>
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
          />
          <AppInputField
            title="Confirm New Password *"
            value={formik.values.confirmNewPassword}
            inputHandler={formik.handleChange}
            inputProps={{ name: 'confirmNewPassword' }}
            error={
              formik.touched.confirmNewPassword &&
              formik.errors.confirmNewPassword
                ? String(formik.errors.confirmNewPassword)
                : ''
            }
            type="password"
          />
        </div>

        <p
          className="cursor-pointer underline underline-offset-2 mb-2 w-fit"
          onClick={forgotPasswordHandler}
        >
          Forgot Password
        </p>

        <div className="flex flex-row gap-[20px] flex-wrap items-end">
          <AppButton
            onClick={hideModal}
            className="px-6 py-3 max-w-[200px]"
            secondary
          >
            Cancel
          </AppButton>
          <AppButton
            onClick={formik.submitForm}
            className="px-6 py-3 max-w-[200px]"
            primary
          >
            Submit
          </AppButton>
        </div>
      </div>
    </>
  );
};

export default UpdatePasswordForm;
