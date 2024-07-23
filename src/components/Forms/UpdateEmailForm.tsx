import React, { FC } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AppInputField from '../Base/AppInputField';
import AppButton from '../Base/AppButton';
import { useAppDispatch } from '@/redux/hooks';
import { startLoading, stopLoading } from '@/redux/slices/commonSlice';
import { showNotification } from '@/redux/slices/commonSlice';
import { updateUserEmail } from '@/services/user';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { passwordRegex } from '@/constants/AppConstants';
import { passwordValidation } from '@/constants/AppMessages';

interface UpdateEmailFormProps {
  hideModal: () => void;
}

const validationSchema = Yup.object().shape({
  email: Yup.string().required(''),

  newEmail: Yup.string()
    .required('New Email is required')
    .email('Invalid email format')
    .notOneOf(
      [Yup.ref('email')],
      'New Email must be different from current Email'
    ),

  confirmNewEmail: Yup.string()
    .required('Confirm Email is required')
    .oneOf([Yup.ref('newEmail')], 'Emails must match')
    .email('Invalid email format'),

  password: Yup.string()
    .required('Password is required')
    .matches(passwordRegex, passwordValidation),
});

const UpdateEmailForm: FC<UpdateEmailFormProps> = ({ hideModal }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { data } = useSession();

  let initalValues = {
    email: String(data?.user.detail.email),
    newEmail: '',
    confirmNewEmail: '',
    password: '',
  };

  const formik = useFormik({
    initialValues: initalValues,
    validationSchema: validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      let payload = {
        existingEmail: values.email,
        newEmail: values.newEmail,
        confirmNewEmail: values.confirmNewEmail,
        password: values.password,
      };

      dispatch(startLoading());
      dispatch(updateUserEmail(data?.user.detail.id, payload))
        .then(() => {
          dispatch(
            showNotification({
              type: 'successful',
              message:
                'Email update successfully. We have sent verification email to the email you provided',
            })
          );
          signOut();
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
                e?.response?.data?.message || 'Failed to Update User Email',
            })
          );
          hideModal();
        })
        .finally(() => {
          dispatch(stopLoading());
        });
    },
  });

  let formRow = 'flex flex-row gap-[40px] flex-wrap';

  return (
    <>
      <h2 className="mb-[20px] text-xl">Change Email</h2>
      <div className="flex flex-col gap-[20px] flex-wrap">
        <div className={`${formRow}`}>
          <AppInputField
            title="Current Email"
            value={formik.values.email}
            inputHandler={formik.handleChange}
            inputProps={{ name: 'email' }}
            error={
              formik.touched.email && formik.errors.email
                ? String(formik.errors.email)
                : ''
            }
            disabled={true}
          />
        </div>

        <div className={`${formRow}`}>
          <AppInputField
            title="New Email *"
            value={formik.values.newEmail}
            inputHandler={formik.handleChange}
            inputProps={{ name: 'newEmail', autoComplete: 'off' }}
            error={
              formik.touched.newEmail && formik.errors.newEmail
                ? String(formik.errors.newEmail)
                : ''
            }
          />
          <AppInputField
            title="Confirm New Email *"
            value={formik.values.confirmNewEmail}
            inputHandler={formik.handleChange}
            inputProps={{ name: 'confirmNewEmail', autoComplete: 'off' }}
            error={
              formik.touched.confirmNewEmail && formik.errors.confirmNewEmail
                ? String(formik.errors.confirmNewEmail)
                : ''
            }
          />
        </div>

        <div className={`${formRow}`}>
          <div className="max-w-[300px]">
            <AppInputField
              title="Password *"
              value={formik.values.password}
              inputHandler={formik.handleChange}
              inputProps={{ name: 'password', autoComplete: 'new-password' }}
              error={
                formik.touched.password && formik.errors.password
                  ? String(formik.errors.password)
                  : ''
              }
              type="password"
            />
          </div>
        </div>

        <div className="flex flex-row gap-[20px] flex-wrap items-end">
          <AppButton
            onClick={hideModal}
            className="px-6 py-3 max-w-[200px] mt-5"
            secondary
          >
            Cancel
          </AppButton>
          <AppButton
            onClick={formik.submitForm}
            className="px-6 py-3 max-w-[200px] mt-5"
            primary
          >
            Submit
          </AppButton>
        </div>
      </div>
    </>
  );
};

export default UpdateEmailForm;
