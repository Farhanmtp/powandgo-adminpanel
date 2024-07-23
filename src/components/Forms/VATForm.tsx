'use client';

import React, { FC, useEffect } from 'react';
import { useFormik } from 'formik';
import AppButton from '../Base/AppButton';
import { useAppDispatch } from '@/redux/hooks';
import { startLoading, stopLoading } from '@/redux/slices/commonSlice';
import { showNotification } from '@/redux/slices/commonSlice';
import AppSelect from '../Base/AppSelect';
import * as Yup from 'yup';
import AppInputField from '../Base/AppInputField';
import { countries } from 'countries-list';
import { addVAT, getSpecificVAT, updateVAT } from '@/services/vat';
import { useRouter } from 'next/navigation';
import { getCountryData } from 'countries-list';

const validationSchema = Yup.object().shape({
  country: Yup.object().required('Country is required'),
  vatRate: Yup.number()
    .required('VAT Rate is required')
    .max(100, 'VAT Rate cannot exceed 100%'),
});

interface VATFormProps {
  vatId?: number;
  hideModal?: () => void;
}

const VATForm: FC<VATFormProps> = ({ vatId }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const countryList = Object.entries(countries).map(([code, country]) => ({
    id: code,
    value: code,
    name: country.name,
  }));
  countryList.sort((a, b) => a.name.localeCompare(b.name));

  let initialValues: any = {
    country: null,
    vatRate: '',
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      let payload = {
        countryCode: values?.country?.value,
        countryName: values?.country?.name,
        vatRate: values.vatRate,
      };

      let action = vatId ? updateVAT(vatId, payload) : addVAT(payload);
      dispatch(startLoading());
      dispatch(action)
        .then(() => {
          dispatch(
            showNotification({
              type: 'successful',
              message: `VAT ${vatId ? 'updated' : 'added'} Successfully`,
            })
          );
          router.push('/dashboard/setup/vat/manage-vat');
        })
        .catch((e) => {
          dispatch(
            showNotification({
              type: 'error',
              message:
                e?.response?.data?.message ||
                `Failed to ${vatId ? 'update' : 'add'} VAT`,
            })
          );
        })
        .finally(() => {
          dispatch(stopLoading());
        });
    },
  });

  useEffect(() => {
    if (vatId) {
      getSpecificVAT(vatId).then((data) => {
        let countryData = getCountryData(data.countryCode);

        let country = {
          id: data.countryCode,
          value: data.countryCode,
          name: countryData.name,
        };
        let values = {
          country,
          vatRate: data.vatRate,
        };

        formik.setValues(values);
      });
    }

    return () => {};
  }, []);

  return (
    <div className="flex-1 flex flex-col gap-4 justify-center flex-wrap png-form">
      <div className="png-form-row">
        <AppSelect
          options={countryList || []}
          selected={formik.values.country}
          selectHandler={(value) => {
            formik.setFieldValue('country', value);
          }}
          multiple={false}
          title="Select Country *"
          className="w-[270px] sm:w-[300px]"
          placeholder="Country"
          error={
            formik.touched.country && formik.errors.country
              ? String(formik.errors.country)
              : ''
          }
          optionsClass="!max-h-[250px]"
        />
        <AppInputField
          title="VAT Rate *"
          value={formik.values.vatRate}
          inputHandler={formik.handleChange}
          inputProps={{ name: 'vatRate', type: 'number', min: '0', max: '100' }}
          error={
            formik.touched.vatRate && formik.errors.vatRate
              ? String(formik.errors.vatRate)
              : ''
          }
          endingText="%"
        />
      </div>

      <div className="flex flex-row gap-3 mt-4">
        <AppButton
          onClick={() => {
            router.push('/dashboard/setup/vat/manage-vat');
          }}
          secondary
          className="h-[45px] py-[4px] px-[24px]"
        >
          <p>Cancel</p>
        </AppButton>
        <AppButton onClick={formik.submitForm} className="px-6 py-3" primary>
          {vatId ? 'Update' : 'Add'}
        </AppButton>
      </div>
    </div>
  );
};

export default VATForm;
