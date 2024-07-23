'use client';

import React, { FC, useState } from 'react';
import { useFormik } from 'formik';
import AppInputField from '../Base/AppInputField';
import { plugTypes } from '@/constants/AppConstants';
import AppSelect from '../Base/AppSelect';
import AppButton from '../Base/AppButton';
import { vehicleModelData } from '@/constants/AppConstants';
import * as Yup from 'yup';
import { addGarage, updateGarage } from '@/services/garage';
import { useAppDispatch } from '@/redux/hooks';
import { showNotification } from '@/redux/slices/commonSlice';
import AppRadioInput from '../Base/AppRadioInput';
import { useRouter } from 'next/navigation';
import AppPlugImage from '../Base/AppPlugImage';
import { ChangeEvent } from 'react';
import AppImage from '../Base/AppImage';
import {
  getBrandObjectByName,
  getModelObjectByName,
  getPlugObjectByName,
} from '@/utils/vehicle';
import { startLoading, stopLoading } from '@/redux/slices/commonSlice';

const validationSchema = Yup.object().shape({
  brand: Yup.object().required('Vehicle Brand is required'),
  model: Yup.object().required('Vehicle Model is required'),
  batteryCapacity: Yup.number().required('Battery Capacity (kWh) is required'),
  displayMeasurement: Yup.number().required('Meter Display is required'),
  plugType: Yup.object().required('Plug Type is required'),
});

const displayMeasureOptions = [
  { value: 1, label: 'Yes' },
  { value: 0, label: 'No' },
];

interface VehicleFormProps {
  editMode?: boolean;
  vehicleData?: any;
  user?: any;
}

const VehicleForm: FC<VehicleFormProps> = ({
  editMode = false,
  vehicleData,
  user = {},
}) => {
  let awsBucketName: string =
    process.env.NEXT_PUBLIC_AWS_PUBLIC_BUCKET_NAME || '';

  let awsBaseUrl: string = process.env.NEXT_PUBLIC_AWS_BASE_URL || '';

  let vehImg =
    editMode && vehicleData.vehiclePicture
      ? `${awsBaseUrl}/${awsBucketName}/${vehicleData.vehiclePicture}`
      : '';

  const dispatch = useAppDispatch();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(vehImg);

  let isAdmin = user?.role?.toLowerCase() === 'admin' ? true : false;

  let initalValues = {
    brand: editMode ? getBrandObjectByName(vehicleData.brand) : (null as any),
    model: editMode
      ? getModelObjectByName(vehicleData.brand, vehicleData.model)
      : (null as any),
    plateNumber: vehicleData?.plateNumber || '',
    batteryCapacity: vehicleData?.batteryCapacity || '',
    employeeName: vehicleData?.employeeName || '',
    plugType: editMode
      ? getPlugObjectByName(vehicleData.plugType)
      : (null as any),
    displayMeasurement: vehicleData
      ? vehicleData.displayMeasurement
        ? 1
        : 0
      : null,
    vehiclePicture: '',
    loading: false,
  };

  const formik = useFormik({
    initialValues: initalValues,
    validationSchema: validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      dispatch(startLoading());
      const formData = new FormData();
      formData.append('brand', values.brand.name);
      formData.append('model', values.model.name);
      formData.append('plateNumber', values.plateNumber);
      formData.append('batteryCapacity', String(values.batteryCapacity));
      formData.append('employeeName', values.employeeName);
      formData.append('plugType', values.plugType?.name || '');
      formData.append(
        'displayMeasurement',
        values.displayMeasurement ? 'true' : 'false'
      );
      if (!editMode) {
        formData.append('vehicleStatus', 'true');
      }
      if (values.vehiclePicture) {
        formData.append('image', values.vehiclePicture);
      }

      const updateOrAdd = editMode
        ? updateGarage(formData, vehicleData.id)
        : addGarage(formData);

      updateOrAdd
        .then(() => {
          dispatch(
            showNotification({
              type: 'successful',
              message: `Vehicle ${editMode ? 'Updated' : 'Added'} Successfully`,
            })
          );
          router.push('/dashboard/vehicle-management/manage-vehicles');
        })
        .catch(() => {
          dispatch(
            showNotification({
              type: 'error',
              message: `Vehicle  ${
                editMode ? 'Update' : 'Creation'
              } Unsuccessful`,
            })
          );
        })
        .finally(() => {
          dispatch(stopLoading());
        });
    },
  });

  const vehicleImageHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataURL = e?.target?.result as string;
        setSelectedImage(imageDataURL);
        formik.setFieldValue('vehiclePicture', file);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImage('');
      formik.setFieldValue('vehiclePicture', '');
    }
  };

  let sectionContainer = 'flex flex-row gap-[50px] flex-wrap';

  return (
    <div className="flex flex-col gap-8">
      <div className={sectionContainer}>
        {/* Brand Name */}
        <AppSelect
          options={vehicleModelData}
          selected={formik.values.brand}
          selectHandler={(value) => {
            formik.setFieldValue('model', null);
            formik.setFieldValue('brand', value);
          }}
          multiple={false}
          title="Select Brand *"
          className="w-[270px] sm:w-[300px]"
          placeholder="Select Brand"
          error={
            formik.touched.brand && formik.errors.brand
              ? String(formik.errors.brand)
              : ''
          }
          disable={isAdmin}
        />

        {/* Model Name */}
        {/* This field will be disabeld untill Brand is selected */}
        <AppSelect
          options={formik.values?.brand?.model || []}
          selected={formik.values.model}
          selectHandler={(value) => {
            formik.setFieldValue('model', value);
          }}
          multiple={false}
          title="Select Model *"
          className="w-[270px] sm:w-[325px]"
          disable={!formik.values.brand || isAdmin}
          placeholder="Select Model"
          error={
            formik.touched.brand && formik.errors.model
              ? String(formik.errors.model)
              : ''
          }
        />
      </div>

      <div className={sectionContainer}>
        {/* Battery Capacity */}
        <AppInputField
          title="Battery Capacity (kWh) *"
          value={formik.values.batteryCapacity}
          inputHandler={formik.handleChange}
          inputProps={{ name: 'batteryCapacity', type: 'number' }}
          error={
            formik.touched.batteryCapacity && formik.errors.batteryCapacity
              ? String(formik.errors.batteryCapacity)
              : ''
          }
          className="w-[270px]"
          disabled={isAdmin}
        />

        {/* Meter Display */}
        <AppRadioInput
          options={displayMeasureOptions}
          name="displayMeasurement"
          selectedValue={formik.values.displayMeasurement}
          onChange={(value) =>
            formik.setFieldValue('displayMeasurement', Number(value))
          }
          error={
            formik.touched.displayMeasurement &&
            formik.errors.displayMeasurement
              ? String(formik.errors.displayMeasurement)
              : ''
          }
          title="Meter Display *"
          disable={isAdmin}
        />
      </div>

      <div className={sectionContainer}>
        {/* Plate Number */}
        <AppInputField
          title="Plate Number"
          value={formik.values.plateNumber}
          inputHandler={formik.handleChange}
          inputProps={{ name: 'plateNumber' }}
          error={
            formik.touched.plateNumber && formik.errors.plateNumber
              ? String(formik.errors.plateNumber)
              : ''
          }
          className="w-[270px]"
          disabled={isAdmin}
        />

        {/* Upload Photo */}
        <div className="flex flex-col gap-2">
          <p className={`${isAdmin ? 'text-gray-500' : 'text-secondary'}`}>
            Upload Photo
          </p>
          <input
            type="file"
            id="uploadEvcImage"
            accept="image/jpeg, image/png"
            onChange={vehicleImageHandler}
            capture="environment"
            className=""
            disabled={isAdmin}
          />
        </div>
        {selectedImage && (
          <div>
            <p className="text-secondary">Selected Image:</p>
            <AppImage
              src={selectedImage}
              alt="Selected"
              width={70}
              height={70}
            />
          </div>
        )}
      </div>

      {/* Plug Types */}

      <div className="flex flex-row gap-3 items-center">
        {formik.values?.plugType?.img && (
          <>
            <AppPlugImage
              name={formik.values?.plugType?.name}
              plugImg={formik.values?.plugType?.img}
            />
          </>
        )}
        <AppSelect
          options={plugTypes.filter(
            (cur) => cur.name.toLowerCase() !== 'domestic'
          )}
          selected={formik.values.plugType}
          selectHandler={(value) => {
            formik.setFieldValue('plugType', value);
          }}
          multiple={false}
          title="Choose Plug Type *"
          className="w-[270px] sm:w-[300px]"
          error={
            formik.touched.plugType && formik.errors.plugType
              ? String(formik.errors.plugType)
              : ''
          }
          placeholder="Choose Plug Type"
          disable={isAdmin}
        />
      </div>

      {!isAdmin && (
        <AppButton
          onClick={formik.submitForm}
          className="px-6 py-3 max-w-[200px] mt-5"
          disabled={isAdmin}
          primary={!isAdmin}
        >
          Submit
        </AppButton>
      )}
    </div>
  );
};

export default VehicleForm;
