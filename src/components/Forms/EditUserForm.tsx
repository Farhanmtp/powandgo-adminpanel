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

interface EditUserFormProps {
  user: any;
}

// editable: name, providerType

// non-editable:

const validationSchema = Yup.object().shape({});

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

const EditUserForm: FC<EditUserFormProps> = ({ user }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  let providerType = providerTypes.find(
    (cur) => cur.value.toLowerCase() === user.use.toLowerCase()
  );

  let initalValues = {
    use: providerType,
    companyName: user.companyName || '',
    dateOfIncorporation: user.dateOfIncorporation || '',
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
        use: values.use?.value,
      };

      dispatch(startLoading());
      dispatch(updateUserProfile(user.id, payload))
        .then(() => {
          router.push('/dashboard/user-management');
          dispatch(
            showNotification({
              type: 'successful',
              message: 'User Profile Updated',
            })
          );
        })
        .catch(() => {
          dispatch(
            showNotification({
              type: 'error',
              message: 'Failed to Update User Profile',
            })
          );
        })
        .finally(() => {
          dispatch(stopLoading());
        });
    },
  });

  const cancelForm = () => {
    router.push('/dashboard/user-management');
  };

  let formRow = 'flex flex-row gap-[40px] flex-wrap';

  return (
    <div className="flex flex-col gap-[40px] flex-wrap">
      {user.use.toLowerCase() === 'residential' && (
        <>
          <div className={`${formRow}`}>
            <AppInputField
              title="First Name"
              value={formik.values.firstName}
              inputHandler={formik.handleChange}
              inputProps={{ name: 'firstName' }}
              error={
                formik.touched.firstName && formik.errors.firstName
                  ? String(formik.errors.firstName)
                  : ''
              }
              className=""
            />
            <AppInputField
              title="Last Name"
              value={formik.values.lastName}
              inputHandler={formik.handleChange}
              inputProps={{ name: 'lastName' }}
              error={
                formik.touched.lastName && formik.errors.lastName
                  ? String(formik.errors.lastName)
                  : ''
              }
              className=""
            />
          </div>

          <div className={`${formRow}`}>
            <AppInputField
              title="Contact Number"
              value={formik.values.contactNumber}
              inputHandler={formik.handleChange}
              inputProps={{ name: 'contactNumber' }}
              error={
                formik.touched.contactNumber && formik.errors.contactNumber
                  ? String(formik.errors.contactNumber)
                  : ''
              }
              disabled={true}
            />

            <AppInputField
              title="Date of Birth"
              value={formik.values.dateOfBirth}
              inputHandler={formik.handleChange}
              inputProps={{ name: 'dateOfBirth' }}
              error={
                formik.touched.dateOfBirth && formik.errors.dateOfBirth
                  ? String(formik.errors.dateOfBirth)
                  : ''
              }
              disabled={true}
            />
          </div>

          <div className={`${formRow}`}>
            <AppInputField
              title="Fiscal Code"
              value={formik.values.fiscalCode}
              inputHandler={formik.handleChange}
              inputProps={{ name: 'fiscalCode' }}
              error={
                formik.touched.fiscalCode && formik.errors.fiscalCode
                  ? String(formik.errors.fiscalCode)
                  : ''
              }
              disabled={true}
            />
            <AppSelect
              options={providerTypes}
              selected={formik.values.use || null}
              selectHandler={(value) => {
                formik.setFieldValue('use', value);
              }}
              multiple={false}
              title="Select User Type"
              className="w-[270px] sm:w-[300px]"
              placeholder="Select User Type"
              error={
                formik.touched.use && formik.errors.use
                  ? String(formik.errors.use)
                  : ''
              }
            />
          </div>
        </>
      )}

      {user.use.toLowerCase() === 'commercial' && (
        <>
          <div className={`${formRow}`}>
            <AppInputField
              title="Company Name"
              value={formik.values.companyName}
              inputHandler={formik.handleChange}
              inputProps={{ name: 'companyName' }}
              error={
                formik.touched.companyName && formik.errors.companyName
                  ? String(formik.errors.companyName)
                  : ''
              }
              disabled={true}
            />

            <AppInputField
              title="Date of Incorporation"
              value={formik.values.dateOfIncorporation}
              inputHandler={formik.handleChange}
              inputProps={{ name: 'dateOfIncorporation' }}
              error={
                formik.touched.dateOfIncorporation &&
                formik.errors.dateOfIncorporation
                  ? String(formik.errors.dateOfIncorporation)
                  : ''
              }
              disabled={true}
            />
          </div>

          <div className={`${formRow}`}>
            <AppInputField
              title="VAT"
              value={formik.values.vat}
              inputHandler={formik.handleChange}
              inputProps={{ name: 'vat' }}
              error={
                formik.touched.vat && formik.errors.vat
                  ? String(formik.errors.vat)
                  : ''
              }
              disabled={true}
            />
            <AppInputField
              title="Fiscal Code"
              value={formik.values.fiscalCode}
              inputHandler={formik.handleChange}
              inputProps={{ name: 'fiscalCode' }}
              error={
                formik.touched.fiscalCode && formik.errors.fiscalCode
                  ? String(formik.errors.fiscalCode)
                  : ''
              }
              disabled={true}
            />
          </div>

          <div className={`${formRow}`}>
            <AppInputField
              title="Contact Number"
              value={formik.values.contactNumber}
              inputHandler={formik.handleChange}
              inputProps={{ name: 'contactNumber' }}
              error={
                formik.touched.contactNumber && formik.errors.contactNumber
                  ? String(formik.errors.contactNumber)
                  : ''
              }
              disabled={true}
            />
            <AppInputField
              title="Address"
              value={formik.values.legalAddress}
              inputHandler={formik.handleChange}
              inputProps={{ name: 'legalAddress' }}
              error={
                formik.touched.legalAddress && formik.errors.legalAddress
                  ? String(formik.errors.legalAddress)
                  : ''
              }
              disabled={true}
            />
          </div>

          <div className={`${formRow}`}>
            <AppInputField
              title="City"
              value={formik.values.city}
              inputHandler={formik.handleChange}
              inputProps={{ name: 'city' }}
              error={
                formik.touched.city && formik.errors.city
                  ? String(formik.errors.city)
                  : ''
              }
              disabled={true}
            />
            <AppInputField
              title="Postal Code"
              value={formik.values.postalCode}
              inputHandler={formik.handleChange}
              inputProps={{ name: 'postalCode' }}
              error={
                formik.touched.postalCode && formik.errors.postalCode
                  ? String(formik.errors.postalCode)
                  : ''
              }
              disabled={true}
            />
          </div>

          <div className={`${formRow}`}>
            <AppInputField
              title="Country"
              value={formik.values.country}
              inputHandler={formik.handleChange}
              inputProps={{ name: 'country' }}
              error={
                formik.touched.country && formik.errors.country
                  ? String(formik.errors.country)
                  : ''
              }
              disabled={true}
            />
            <AppSelect
              options={providerTypes}
              selected={formik.values.use || null}
              selectHandler={(value) => {
                formik.setFieldValue('use', value);
              }}
              multiple={false}
              title="Select User Type"
              className="w-[270px] sm:w-[300px]"
              placeholder="Select User Type"
              error={
                formik.touched.use && formik.errors.use
                  ? String(formik.errors.use)
                  : ''
              }
            />
          </div>

          <p>Contact Person Info</p>

          <div className={`${formRow}`}>
            <AppInputField
              title="First Name"
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
              title="Last Name"
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
              title="Designation"
              value={formik.values.designation}
              inputHandler={formik.handleChange}
              inputProps={{ name: 'designation' }}
              error={
                formik.touched.designation && formik.errors.designation
                  ? String(formik.errors.designation)
                  : ''
              }
              disabled={true}
            />
            <AppInputField
              title="Email"
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
              title="Contact Number"
              value={formik.values.contactNumber}
              inputHandler={formik.handleChange}
              inputProps={{ name: 'contactNumber' }}
              error={
                formik.touched.contactNumber && formik.errors.contactNumber
                  ? String(formik.errors.contactNumber)
                  : ''
              }
              disabled={true}
            />
          </div>
        </>
      )}

      <div className="flex flex-row gap-[20px] flex-wrap">
        <AppButton
          onClick={cancelForm}
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
  );
};

export default EditUserForm;
