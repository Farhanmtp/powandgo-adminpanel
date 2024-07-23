'use client';

import React, { FC, ChangeEvent } from 'react';
import AppSelect from '../Base/AppSelect';
import AppButton from '../Base/AppButton';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { vehicleType } from '@/constants/AppConstants';
import { startLoading, stopLoading } from '@/redux/slices/commonSlice';
import useCurrencyInfo from '@/hooks/useCurrencyInfo';
import * as Yup from 'yup';
import AppInputField from '../Base/AppInputField';
import { showNotification } from '@/redux/slices/commonSlice';
import { addPlugType, updatePlugType } from '@/services/plugType';

interface PlugTypeFormProps {
  editMode?: boolean;
  user?: any;
  plugTypeData?: any;
}

const initialPlug = {
  plugtype: '',
};

interface Option {
  label: string;
  value: string;
}

const PlugTypeForm: FC<PlugTypeFormProps> = ({ editMode, plugTypeData }) => {
  const validationSchema = Yup.object().shape({
    plugType: Yup.string().required('Plug Type is required'),
    vehicleType: Yup.object().required('Plug Type is required'),
    plugPower: Yup.number().required('Plug Power is required'),
    suggestedPrice: Yup.number().required('Suggested Price is required'),
    image: editMode ? Yup.mixed() : Yup.mixed().required('Image is required'),
  });

  let initialValues: any = {
    plugType: plugTypeData?.type || '',
    plugImageUrl: plugTypeData?.imageUrl || '',
    plugPower: plugTypeData?.power,
    suggestedPrice: plugTypeData?.price,
<<<<<<< HEAD
    vehicleType: plugTypeData?.vehicleType,
=======
    vehicleType:
      vehicleType.find(
        (vehicle) => vehicle.name === plugTypeData?.vehicleType
      ) || null,
>>>>>>> f8d7678d100a2d9c7139227ffe43748efe56f802
  };

  const { currencySymbol } = useCurrencyInfo();

  const router = useRouter();
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append('type', String(values.plugType));
      formData.append('power', String(values.plugPower));
      formData.append('price', String(values.suggestedPrice));
      formData.append('vehicleType', String(values?.vehicleType?.name));
      if (values.image) {
        formData.append('image', values.image);
      }

      // let payload = {
      //   name: values.plugName,
      //   type: values.plugType,
      //   power: parseFloat(values.plugPower),
      //   price: parseFloat(values.suggestedPrice),
      //   vehicleType: values.vehicleType?.value,
      // };

      dispatch(startLoading());
      const updateOrAdd = editMode
        ? updatePlugType(formData, plugTypeData.id)
        : addPlugType(formData);

      updateOrAdd
        .then(() => {
          dispatch(
            showNotification({
              type: 'successful',
              message: `PlugType ${
                editMode ? 'Updated' : 'Added'
              } Successfully`,
            })
          );
          router.push('/dashboard/setup/plug-type');
        })
        .catch((e) => {
          dispatch(
            showNotification({
              type: 'error',
              message:
                e?.response?.data?.message ||
                `PlugType  ${editMode ? 'Update' : 'Creation'} Unsuccessful`,
            })
          );
        })
        .finally(() => {
          dispatch(stopLoading());
        });
    },
  });

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataURL = e?.target?.result as string;
        // setEvcForm((cur) => {
        //   return {
        //     ...cur,
        //     evcImageUrl: imageDataURL,
        //     image: file,
        //   };
        // });
        formik.setFieldValue('image', file);
      };
      reader.readAsDataURL(file);
    } else {
      // setEvcForm((cur) => {
      //   return {
      //     ...cur,
      //     evcImageUrl: '',
      //   };
      // });
    }
  };

  let imageError = formik?.errors?.image;

  console.log(formik.values.vehicleType);

  return (
    <div className="flex flex-col gap-[40px] png-form">
      {/* Plug Info */}
      <>
        <div className="png-form-row">
          <AppSelect
            options={vehicleType}
            selectHandler={(value: any) => {
              formik.setFieldValue('vehicleType', value);
            }}
            selected={formik.values.vehicleType}
            multiple={false}
            title="Vehicle Type *"
            className="w-[270px] sm:w-[300px]"
            placeholder="Select Plug Type"
            error={
              formik.touched.vehicleType && formik.errors.vehicleType
                ? String(formik.errors.vehicleType)
                : ''
            }
          />
          <AppInputField
            title="Plug Type *"
            inputHandler={(event) => {
              formik.setFieldValue('plugType', event.target.value);
            }}
            value={formik.values.plugType}
            error={
              formik.touched.plugType && formik.errors.plugType
                ? String(formik.errors.plugType)
                : ''
            }
          />
        </div>

        <div className="png-form-row">
          <div className="flex flex-col gap-2">
            <p className="text-secondary">
              {editMode ? 'Update Image' : 'Capture / Uploads *'}
            </p>
            <div>
              <input
                type="file"
                id="uploadPlugImage"
                accept=".png, .jpeg, .jpg"
                onChange={handleImageChange}
                capture="environment"
                className=""
              />
              {imageError && typeof imageError === 'string' && (
                <p className="text-sm text-red-500">{imageError}</p>
              )}
            </div>
          </div>
        </div>
      </>

      {/* Plug Pricing */}
      <>
        <div className="png-form-row">
          <AppInputField
            title="Plug Power *"
            inputHandler={(event) => {
              formik.setFieldValue('plugPower', event?.target.value);
            }}
            value={formik.values.plugPower}
            type="number"
            error={
              formik.touched.plugPower && formik.errors.plugPower
                ? String(formik.errors.plugPower)
                : ''
            }
            endingText={`/KW`}
          />

          <AppInputField
            title="Suggested Price *"
            inputHandler={(event) => {
              formik.setFieldValue('suggestedPrice', event.target.value);
            }}
            value={formik.values.suggestedPrice}
            type="number"
            endingText={`${currencySymbol}/Kwh`}
            error={
              formik.touched.suggestedPrice && formik.errors.suggestedPrice
                ? String(formik.errors.suggestedPrice)
                : ''
            }
          />
        </div>
      </>

      <div className="flex flex-row gap-3">
        <AppButton
          onClick={() => {
            router.push('/dashboard/setup/plug-type');
          }}
          secondary
          className="h-[45px] py-[4px] px-[24px]"
        >
          <p>Cancel</p>
        </AppButton>
        <AppButton
          onClick={formik.submitForm}
          primary
          className="h-[45px] py-[4px] px-[24px]"
        >
          <div className="flex flex-row gap-[10px] items-center">
            <p>{editMode ? 'Update' : 'Add'}</p>
          </div>
        </AppButton>
      </div>
    </div>
  );
};

export default PlugTypeForm;
