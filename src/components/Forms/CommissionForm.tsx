'use client';

import React, { FC, useState, useEffect } from 'react';
import AppSelect from '../Base/AppSelect';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import AppInputField from '../Base/AppInputField';
import AppAutoComplete from '../Base/AppAutoComplete';
import { useAppDispatch } from '@/redux/hooks';
import { getAllEvcByUserType } from '@/services/evc';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { updateEvcByAccountType } from '@/redux/slices/evcSlice';
import AppButton from '../Base/AppButton';
import {
  createCommission,
  updateSpecificCommission,
} from '@/services/commission';
import { useRouter } from 'next/navigation';
import {
  showNotification,
  startLoading,
  stopLoading,
} from '@/redux/slices/commonSlice';
import { getSpecificCommission } from '@/services/commission';

const usersType = [
  {
    id: 1,
    name: 'Residential',
  },
  {
    id: 2,
    name: 'Commercial',
  },
];

const validationSchema = Yup.object().shape({
  userType: Yup.object().required('User Type is required'),
  commission: Yup.number()
    .required('Commission Rate is required')
    .max(100, 'Commission Rate cannot exceed 100%'),
  effectiveDate: Yup.date().required('Effective Date is required'),
  customCommission: Yup.boolean(),
  evcs: Yup.array(),
});

interface CommissionFormProps {
  commissionId?: number;
}

const CommissionForm: FC<CommissionFormProps> = ({ commissionId }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Manually doing conditional validation for EVCs error Message
  const [errorMessage, setErrorMessage] = useState({
    evcs: '',
  });

  const evcByAccountType = useAppSelector(
    (state: RootState) => state?.evc.evcByAccountType
  );

  let initalValues = {
    userType: null,
    commission: '',
    effectiveDate: '',
    customCommission: false,
    evcs: [],
  };

  const checkCommissionsPresent = (selectedEvcs: any) => {
    if (commissionId) {
      return selectedEvcs.filter(
        (evc: any) =>
          evc?.commissions?.length > 0 &&
          evc.commissions.every(
            (commission: any) => commission.id !== commissionId
          )
      );
    } else {
      return selectedEvcs.filter((evc: any) => evc?.commissions?.length > 0);
    }
  };

  const formik = useFormik({
    initialValues: initalValues,
    validationSchema: validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values: any) => {
      if (values.customCommission && !values.evcs.length) {
        setErrorMessage((cur) => {
          return {
            ...cur,
            evcs: 'EVC is required',
          };
        });
        return;
      }

      let evcThatHasCommissionPresent = checkCommissionsPresent(values.evcs);
      if (evcThatHasCommissionPresent.length) {
        let names = evcThatHasCommissionPresent
          .map((evc: any) => evc.name)
          .join(', ');

        setErrorMessage((cur) => {
          return {
            ...cur,
            evcs: `You’ve already created a commission for ${names}.\n If you want to create a new commission rate for  ${names}, you need to remove the previously created commission first.`,
          };
        });
        return;
      }

      let payload: any = {
        providerType: values?.userType?.name,
        commissionRate: parseFloat(values.commission),
        isActive: true,
        isCustom: values.customCommission,
        effectiveDate: values.effectiveDate,
        evcId: values.customCommission
          ? values.evcs.map((evc: any) => evc.id)
          : [],
      };

      dispatch(startLoading());
      dispatch(
        commissionId
          ? updateSpecificCommission(commissionId, payload)
          : createCommission(payload)
      )
        .then(() => {
          dispatch(
            showNotification({
              type: 'successful',
              message: commissionId
                ? 'Record Updated Successfully'
                : 'Commission created Successfully',
            })
          );
          router.push('/dashboard/commission-management/manage-commission');
        })
        .catch((e) => {
          dispatch(
            showNotification({
              type: 'error',
              message: commissionId
                ? e?.response?.data?.message || 'Record Updation unsuccessful'
                : e?.response?.data?.message ||
                  'Commission creation unsuccessful',
            })
          );
        })
        .finally(() => {
          dispatch(stopLoading());
        });
    },
  });

  const getEvcByUserType = (userType: string) => {
    dispatch(updateEvcByAccountType([]));
    formik.setFieldValue('evcs', []);
    dispatch(getAllEvcByUserType(userType));
  };

  useEffect(() => {
    if (commissionId) {
      getSpecificCommission(commissionId).then((data) => {
        let commission = data.data;

        if (!commission) {
          return;
        }
        if (commission.providerType) {
          getEvcByUserType(commission.providerType);
        }
        formik.setValues({
          userType: commission?.providerType
            ? usersType.find((type) => type.name === commission.providerType)
            : null,
          commission: commission?.commissionRate.toString() || '',
          effectiveDate: commission?.effectiveDate
            ? new Date(commission.effectiveDate).toISOString().split('T')[0]
            : '',
          customCommission: commission?.isCustom || false,
          evcs: commission?.evcs || [],
        });
      });
    }

    return () => {};
  }, [commissionId]);

  return (
    <div className="png-form flex flex-col gap-8">
      {/* Type  - Residential / Commercial - Dropdown*/}

      <div className="png-form-row">
        <AppSelect
          options={usersType}
          selected={formik.values.userType}
          selectHandler={(value: any) => {
            getEvcByUserType(value.name);
            formik.setFieldValue('userType', value);
          }}
          multiple={false}
          title="Select Type *"
          className="w-[270px] sm:w-[300px]"
          placeholder="Select Type"
          error={
            formik.touched.userType && formik.errors.userType
              ? String(formik.errors.userType)
              : ''
          }
        />

        {/* Commission Rate - Number % */}

        <AppInputField
          title="Commission Rate *"
          value={formik.values.commission}
          inputHandler={formik.handleChange}
          inputProps={{ name: 'commission' }}
          error={
            formik.touched.commission && formik.errors.commission
              ? String(formik.errors.commission)
              : ''
          }
          className="w-[270px]"
          endingText="%"
          type="number"
        />
      </div>

      <div className="png-form-row">
        {/* Effective Date - Input Date */}

        <AppInputField
          title="Effective Date *"
          value={formik.values.effectiveDate}
          inputHandler={formik.handleChange}
          inputProps={{
            name: 'effectiveDate',
            min: `${new Date().toISOString().split('T')[0]}`,
          }}
          error={
            formik.touched.effectiveDate && formik.errors.effectiveDate
              ? String(formik.errors.effectiveDate)
              : ''
          }
          className="w-[270px]"
          type="date"
        />

        {/* Custom Checkbox */}

        {!commissionId && (
          <div className="flex flex-col items-start gap-2">
            <label htmlFor="customCommissions" className="text-secondary">
              Custom Commissions
            </label>
            <input
              type="checkbox"
              id="customCommissions"
              name="customCommissions"
              value="customCommissions"
              checked={formik.values.customCommission}
              onChange={(event) => {
                formik.setFieldValue('customCommission', event.target.checked);
              }}
            />
          </div>
        )}
      </div>

      {/*******************ELSE*******************************/}

      {formik.values.customCommission && (
        <AppAutoComplete
          title="Select EVC *"
          options={evcByAccountType}
          selected={formik.values.evcs}
          selectHandler={(value) => {
            formik.setFieldValue('evcs', value);
          }}
          disable={!formik.values.userType}
          error={errorMessage.evcs}
          className="lg:w-[650px]"
        />
      )}

      <AppButton
        onClick={formik.submitForm}
        className="px-6 py-3 max-w-[200px]"
        primary
      >
        {commissionId ? 'Update' : 'Submit'}
      </AppButton>

      {/* EVCs Search Dropdown for Residential or Commercial */}
    </div>
  );
};

export default CommissionForm;
