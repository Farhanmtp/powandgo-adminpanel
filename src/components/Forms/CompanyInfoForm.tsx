import React, { FC } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AppInputField from '../Base/AppInputField';
import AppSelect from '../Base/AppSelect';
import AppButton from '../Base/AppButton';
import { useAppDispatch } from '@/redux/hooks';
import { startLoading, stopLoading } from '@/redux/slices/commonSlice';
import { showNotification } from '@/redux/slices/commonSlice';
import { updateUserProfile } from '@/services/user';
import { useRouter } from 'next/navigation';

interface CompanyInfoFormProps {
  user: any;
  hideModal: () => void;
}

const validationSchema = Yup.object().shape({
  contactPersonEmail: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  contactPersonNumber: Yup.string(),
  designation: Yup.string().required('Designation is required'),
  companyName: Yup.string().required('Company Name is required'),
  dateOfIncorporation: Yup.date().required('Date of Incorporation is required'),
  vat: Yup.string()
    .required('VAT is required')
    .min(11, 'VAT must have 11 characters'),
  fiscalCode: Yup.string()
    .required('Fiscal Code is required')
    .min(16, 'Fiscal code must have 16 characters'),
  contactNumber: Yup.string().required('Contact Number is required'),
  legalAddress: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  postalCode: Yup.string().required('Postal Code is required'),
  country: Yup.string().required('Country is required'),
});

const providerTypes = [
  {
    id: 1,
    name: 'Residential',
    value: 'RESIDENTIAL',
  },
  {
    id: 2,
    name: 'Commercial',
    value: 'COMMERCIAL',
  },
];

const CompanyInfoForm: FC<CompanyInfoFormProps> = ({ user, hideModal }) => {
  const dispatch = useAppDispatch();

  let providerType = providerTypes.find(
    (cur) => cur.value?.toLowerCase() === user?.use?.toLowerCase()
  );

  let dateOfIncorporation = Date.parse(user.dateOfIncorporation)
    ? new Date(user.dateOfIncorporation)?.toISOString()?.split('T')[0]
    : '';

  let initalValues = {
    use: providerType,
    companyName: user.companyName || '',
    dateOfIncorporation,
    dateOfBirth: user.dateOfBirth || '',
    vat: user.vat || '',
    fiscalCode: user.fiscalCode || '',
    contactNumber: user.contactNumber || '',
    legalAddress: user.legalAddress || '',
    designation: user.designation || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    contactPersonEmail: user.contactPersonEmail || '',
    contactPersonNumber: user.contactPersonNumber || '',
    city: user.city || '',
    country: user.country || '',
    postalCode: user.postalCode || '',
    email: user.email || '',
  };

  const formik = useFormik({
    initialValues: initalValues,
    validationSchema: validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      let payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        contactPersonEmail: values.contactPersonEmail,
        contactPersonNumber: String(values.contactPersonNumber),
        designation: values.designation,
        companyName: values.companyName,
        dateOfIncorporation: String(values.dateOfIncorporation),
        vat: values.vat,
        fiscalCode: values.fiscalCode,
        contactNumber: String(values.contactNumber),
        legalAddress: values.legalAddress,
        city: values.city,
        postalCode: values.postalCode,
        country: values.country,
      };

      dispatch(startLoading());
      dispatch(updateUserProfile(user.id, payload))
        .then(() => {
          dispatch(
            showNotification({
              type: 'successful',
              message: 'Company Info Updated',
            })
          );
        })
        .catch(() => {
          dispatch(
            showNotification({
              type: 'error',
              message: 'Failed to Update Company Info',
            })
          );
        })
        .finally(() => {
          dispatch(stopLoading());
          hideModal();
        });
    },
  });

  let formRow = 'flex flex-row gap-[40px] flex-wrap';

  return (
    <>
      <h2 className="mb-[20px] text-xl">Company Info</h2>
      <div className="flex flex-col gap-[20px] flex-wrap">
        <div className={`${formRow}`}>
          <AppInputField
            title="Company Name *"
            value={formik.values.companyName}
            inputHandler={formik.handleChange}
            inputProps={{ name: 'companyName' }}
            error={
              formik.touched.companyName && formik.errors.companyName
                ? String(formik.errors.companyName)
                : ''
            }
          />

          <AppInputField
            title="Date of Incorporation *"
            value={formik.values.dateOfIncorporation}
            inputHandler={formik.handleChange}
            inputProps={{
              name: 'dateOfIncorporation',
              min: `${new Date()?.toISOString()?.slice(0, 10)}`,
            }}
            error={
              formik.touched.dateOfIncorporation &&
              formik.errors.dateOfIncorporation
                ? String(formik.errors.dateOfIncorporation)
                : ''
            }
            type="date"
          />
        </div>

        <div className={`${formRow}`}>
          <AppInputField
            title="VAT *"
            value={formik.values.vat}
            inputHandler={formik.handleChange}
            inputProps={{ name: 'vat' }}
            error={
              formik.touched.vat && formik.errors.vat
                ? String(formik.errors.vat)
                : ''
            }
          />
          <AppInputField
            title="Fiscal Code *"
            value={formik.values.fiscalCode}
            inputHandler={formik.handleChange}
            inputProps={{ name: 'fiscalCode' }}
            error={
              formik.touched.fiscalCode && formik.errors.fiscalCode
                ? String(formik.errors.fiscalCode)
                : ''
            }
          />
        </div>

        <div className={`${formRow}`}>
          <AppInputField
            title="Contact Number *"
            value={formik.values.contactNumber}
            inputHandler={formik.handleChange}
            inputProps={{ name: 'contactNumber' }}
            error={
              formik.touched.contactNumber && formik.errors.contactNumber
                ? String(formik.errors.contactNumber)
                : ''
            }
            type="number"
          />
          <AppInputField
            title="Address *"
            value={formik.values.legalAddress}
            inputHandler={formik.handleChange}
            inputProps={{ name: 'legalAddress' }}
            error={
              formik.touched.legalAddress && formik.errors.legalAddress
                ? String(formik.errors.legalAddress)
                : ''
            }
          />
        </div>

        <div className={`${formRow}`}>
          <AppInputField
            title="City *"
            value={formik.values.city}
            inputHandler={formik.handleChange}
            inputProps={{ name: 'city' }}
            error={
              formik.touched.city && formik.errors.city
                ? String(formik.errors.city)
                : ''
            }
          />
          <AppInputField
            title="Postal Code *"
            value={formik.values.postalCode}
            inputHandler={formik.handleChange}
            inputProps={{ name: 'postalCode' }}
            error={
              formik.touched.postalCode && formik.errors.postalCode
                ? String(formik.errors.postalCode)
                : ''
            }
          />
        </div>

        <div className={`${formRow}`}>
          <AppInputField
            title="Country *"
            value={formik.values.country}
            inputHandler={formik.handleChange}
            inputProps={{ name: 'country' }}
            error={
              formik.touched.country && formik.errors.country
                ? String(formik.errors.country)
                : ''
            }
          />
        </div>

        <h2 className="text-xl">Contact Person Info</h2>

        <div className={`${formRow}`}>
          <AppInputField
            title="First Name *"
            value={formik.values.firstName}
            inputHandler={formik.handleChange}
            inputProps={{ name: 'firstName' }}
            error={
              formik.touched.firstName && formik.errors.firstName
                ? String(formik.errors.firstName)
                : ''
            }
          />
          <AppInputField
            title="Last Name *"
            value={formik.values.lastName}
            inputHandler={formik.handleChange}
            inputProps={{ name: 'lastName' }}
            error={
              formik.touched.lastName && formik.errors.lastName
                ? String(formik.errors.lastName)
                : ''
            }
          />
        </div>
        <div className={`${formRow}`}>
          <AppInputField
            title="Designation *"
            value={formik.values.designation}
            inputHandler={formik.handleChange}
            inputProps={{ name: 'designation' }}
            error={
              formik.touched.designation && formik.errors.designation
                ? String(formik.errors.designation)
                : ''
            }
          />
          <AppInputField
            title="Email *"
            value={formik.values.contactPersonEmail}
            inputHandler={formik.handleChange}
            inputProps={{ name: 'contactPersonEmail' }}
            error={
              formik.touched.contactPersonEmail &&
              formik.errors.contactPersonEmail
                ? String(formik.errors.contactPersonEmail)
                : ''
            }
          />
        </div>

        <div className={`${formRow}`}>
          <AppInputField
            title="Contact Number"
            value={formik.values.contactPersonNumber}
            inputHandler={formik.handleChange}
            inputProps={{ name: 'contactPersonNumber' }}
            error={
              formik.touched.contactPersonNumber &&
              formik.errors.contactPersonNumber
                ? String(formik.errors.contactPersonNumber)
                : ''
            }
            type="number"
          />
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

export default CompanyInfoForm;
