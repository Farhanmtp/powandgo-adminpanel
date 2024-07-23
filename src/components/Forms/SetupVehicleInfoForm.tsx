'use client';

import React, { ChangeEvent, FC, useEffect, useState, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AppInputField from '../Base/AppInputField';
import AppButton from '../Base/AppButton';
import { useAppDispatch } from '@/redux/hooks';
import { startLoading, stopLoading } from '@/redux/slices/commonSlice';
import {
  addMultipleVehicleInfo,
  addVehicleInfo,
  getVehicleInfo,
  updateVehicleInfo,
} from '@/services/vehicleInfo';
import { showNotification } from '@/redux/slices/commonSlice';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';

const validationSchema = Yup.object().shape({
  brand: Yup.string().required('Vehicle Brand is required'),
  model: Yup.string().required('Vehicle Model is required'),
});

let initalValues: any = {
  brand: '',
  model: '',
};

interface SetupVehicleInfoFormProps {
  vehicleInfoId?: number;
}

const SetupVehicleInfoForm: FC<SetupVehicleInfoFormProps> = ({
  vehicleInfoId,
}) => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  const formik = useFormik({
    initialValues: initalValues,
    validationSchema: validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      let payload = {
        brand: values.brand,
        model: values.model,
      };

      let action = vehicleInfoId
        ? () => updateVehicleInfo(payload, vehicleInfoId)
        : () => addVehicleInfo(payload);

      dispatch(startLoading());
      dispatch(action())
        .then(() => {
          dispatch(
            showNotification({
              type: 'successful',
              message: `Vehicle Info ${
                vehicleInfoId ? 'Updated' : 'Added'
              } Successfully`,
            })
          );
          router.push('/dashboard/setup/manage-vehicle-info');
        })
        .catch((e) => {
          dispatch(
            showNotification({
              type: 'error',
              message:
                e?.response?.data?.message ||
                `Failed to ${vehicleInfoId ? 'Update' : 'Add'}  Vehicle Info`,
            })
          );
        })
        .finally(() => {
          dispatch(stopLoading());
        });
    },
  });

  const [vehicleInfoArr, setVehicleInfoArr] = useState([]);

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setSelectedFile(event.target.files[0]);

      Papa.parse(event.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const rowsArray: any = [];
          const valuesArray: any = [];

          // Iterating data to get column name and their values
          results.data.map((d: any) => {
            rowsArray.push(Object.keys(d));
            valuesArray.push(Object.values(d));
          });

          // Get index of 'Model' and 'Brand' columns
          const modelColumnIndex = rowsArray[0].indexOf('Model');
          const brandColumnIndex = rowsArray[0].indexOf('Brand');

          if (modelColumnIndex === -1 || brandColumnIndex === -1) {
            dispatch(
              showNotification({
                type: 'error',
                message: `Please ensure that you have Model & Brand Headings in your CSV File.`,
              })
            );
            resetInputFile();
          }

          // Create an object of 'Model' and its corresponding 'Brand'
          const modelBrandArr: any = [];
          valuesArray.forEach((row: any) => {
            const model = row[modelColumnIndex];
            const brand = row[brandColumnIndex];

            if (model && brand) {
              modelBrandArr.push({
                model,
                brand,
              });
            }
          });
          setVehicleInfoArr(modelBrandArr);
        },
      });
    } else {
      setSelectedFile(null);
    }
  };

  const addMultipleVehicleData = () => {
    let payload = {
      vehicleInfoData: vehicleInfoArr,
    };
    dispatch(startLoading());
    dispatch(addMultipleVehicleInfo(payload))
      .then(() => {
        dispatch(
          showNotification({
            type: 'successful',
            message: `Multiple Vehicle Info Added Successfully`,
          })
        );
        router.push('/dashboard/setup/manage-vehicle-info');
      })
      .catch((e) => {
        dispatch(
          showNotification({
            type: 'error',
            message: e?.response?.data?.message || `Failed to Add Vehicle Info`,
          })
        );
      })
      .finally(() => {
        dispatch(stopLoading());
      });
  };

  useEffect(() => {
    if (vehicleInfoId) {
      getVehicleInfo(vehicleInfoId).then(({ data }) => {
        let formData = {
          brand: data.brand,
          model: data.model,
        };
        formik.setValues(formData);
      });
    }
    return () => {};
  }, [vehicleInfoId]);

  const resetInputFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setSelectedFile(null);
  };
  return (
    <div className="png-form flex flex-col gap-8">
      {!vehicleInfoId && (
        <>
          <div className="png-form-row">
            <div className="flex flex-col gap-4">
              <p
                className={`text-base not-italic font-normal leading-[150%] text-secondary`}
              >
                Upload CSV
              </p>
              <input
                accept=".csv"
                type="file"
                onChange={onFileChange}
                ref={fileInputRef}
              />
            </div>
          </div>
          <div className=" flex flex-row flex-wrap gap-2">
            <AppButton onClick={resetInputFile} className="px-6 py-3" secondary>
              Clear
            </AppButton>
            <AppButton
              onClick={addMultipleVehicleData}
              className="px-6 py-3 max-w-[200px]"
              primary={!!selectedFile && !!vehicleInfoArr.length}
              disabled={!selectedFile || !vehicleInfoArr.length}
            >
              Add CSV Data
            </AppButton>
          </div>
        </>
      )}
      <div className="png-form-row">
        <AppInputField
          title="Vehicle Brand *"
          value={formik.values.brand}
          inputHandler={formik.handleChange}
          inputProps={{ name: 'brand' }}
          error={
            formik.touched.brand && formik.errors.brand
              ? String(formik.errors.brand)
              : ''
          }
        />

        <AppInputField
          title="Vehicle Model *"
          value={formik.values.model}
          inputHandler={formik.handleChange}
          inputProps={{ name: 'model' }}
          error={
            formik.touched.model && formik.errors.model
              ? String(formik.errors.model)
              : ''
          }
        />
      </div>

      <div className="flex flex-row gap-3">
        <AppButton
          onClick={() => {
            router.push('/dashboard/setup/manage-vehicle-info');
          }}
          secondary
          className="h-[45px] py-[4px] px-[24px]"
        >
          <p>Cancel</p>
        </AppButton>
        <AppButton
          onClick={formik.submitForm}
          className="px-6 py-3 max-w-[200px]"
          primary
        >
          {vehicleInfoId ? 'Update' : 'Add'}
        </AppButton>
      </div>
    </div>
  );
};

export default SetupVehicleInfoForm;
