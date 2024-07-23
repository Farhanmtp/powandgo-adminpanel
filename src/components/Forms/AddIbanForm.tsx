'use client';

import React, { FC } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AppInputField from '../Base/AppInputField';
import AppButton from '../Base/AppButton';
import { useAppDispatch } from '@/redux/hooks';
import { startLoading, stopLoading } from '@/redux/slices/commonSlice';
import { showNotification } from '@/redux/slices/commonSlice';
import { isValid } from 'iban';
import { addIBAN } from '@/services/bank';
import { reloadSession } from '@/utils/profile';

interface AddIbanFormProps {
  hideModal: () => void;
}

const validationSchema = Yup.object().shape({
  iban: Yup.string().required('IBAN is required'),
});

const AddIbanForm: FC<AddIbanFormProps> = ({ hideModal }) => {
  const dispatch = useAppDispatch();

  let initalValues = {
    iban: '',
  };

  const formik = useFormik({
    initialValues: initalValues,
    validationSchema: validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    // enableReinitialize: true,
    onSubmit: (values) => {
      if (!isValid(values.iban)) {
        formik.setErrors({ iban: 'Please enter the Correct IBAN' });
        return;
      }
      let payload = {
        iban: values.iban,
      };

      dispatch(startLoading());
      dispatch(addIBAN(payload))
        .then(() => {
          dispatch(
            showNotification({
              type: 'successful',
              message: 'IBAN added Successfully',
            })
          );
          reloadSession();
        })
        .catch((e) => {
          dispatch(
            showNotification({
              type: 'error',
              message: e?.response?.data?.message || 'Failed to add IBAN',
            })
          );
        })
        .finally(() => {
          dispatch(stopLoading());
          hideModal();
        });
    },
  });

  return (
    <>
      <div className="flex-1 flex flex-col gap-4 max-w-[600px] justify-center flex-wrap">
        <div className="flex flex-col gap-1">
          <div>
            <h1 className="mb-2 text-2xl font-semibold">Add IBAN</h1>
            <p className="text-sm">
              Once your data verification is complete, you will receive an
              in-app notification with instructions on how to proceed with the
              activation. We will send two small amount transfers to your
              private current account in order to correctly verify the IBAN code
              you provided during registration.You simply need to open the app,
              click on Profile, and enter the amounts of both transfers in the
              designated screen.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-[18px] font-semibold">
              Where I can find the transfers?
            </h2>
            <p className="text-sm">
              You will see the two transfers in the statement of the IBAN
              associated with your Powandgo account, which can be accessed
              through your Home Banking or at your Bank.If you don&apos;t
              immediately see the two transfers, don&apos;t worry, you will
              receive them within a couple of business days.
            </p>
          </div>
        </div>

        <div className="flex flex-row gap-[60px] flex-wrap">
          <AppInputField
            title="IBAN *"
            value={formik.values.iban}
            inputHandler={formik.handleChange}
            inputProps={{ name: 'iban' }}
            error={
              formik.touched.iban && formik.errors.iban
                ? String(formik.errors.iban)
                : ''
            }
            placeholder="Enter your IBAN"
          />
          <div className="flex flex-row gap-[20px] flex-wrap items-end mt-5">
            <AppButton onClick={hideModal} className="px-6 py-3" secondary>
              Cancel
            </AppButton>
            <AppButton
              onClick={formik.submitForm}
              className="px-6 py-3"
              primary
            >
              Add IBAN
            </AppButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddIbanForm;
