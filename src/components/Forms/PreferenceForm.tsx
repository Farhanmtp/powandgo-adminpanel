'use client';

import React, { FC, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import AppButton from '../Base/AppButton';
import { useAppDispatch } from '@/redux/hooks';
import { startLoading, stopLoading } from '@/redux/slices/commonSlice';
import { showNotification } from '@/redux/slices/commonSlice';
import AppSelect from '../Base/AppSelect';
import { languageOptions, currencyOptions } from '@/constants/AppConstants';
import { deleteUserProfile, updatePreference } from '@/services/user';
import { useSession } from 'next-auth/react';
import AppImage from '../Base/AppImage';
import AppModal from '../Base/AppModal';
import AppModalAction from '../Base/AppModalAction';
import { signOut } from 'next-auth/react';
import { capitalizeFirstLetter } from '@/utils/general';
import { reloadSession } from '@/utils/profile';

const hideLoaderCSS = `
  .VIpgJd-ZVi9od-aZ2wEe-wOHMyf {
    visibility: hidden !important;
  }
`;
interface PreferenceFormProps {
  hideModal: () => void;
}
const TranslateElement = () => {
  const googleTranslateElementInit = () => {
    // @ts-ignore:next-line
    new window.google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        includedLanguages: 'en,it',

        autoDisplay: false,
      },
      'google_translate_element'
    );
  };
  useEffect(() => {
    var addScript = document.createElement('script');
    addScript.setAttribute(
      'src',
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    );
    document.body.appendChild(addScript);
    // @ts-ignore:next-line
    window.googleTranslateElementInit = googleTranslateElementInit;
    const hideTranslatePopups = () => {
      const style = document.createElement('style');
      style.innerHTML = `
        .goog-te-banner-frame.skiptranslate { display: none !important; }
        body { top: 0px !important; }
        #goog-gt-tt { display: none !important; top: 0px !important; } 
        .goog-tooltip.skiptranslate { display: none !important; top: 0px !important; } 
        .activity-root { display: none !important; } 
        .status-message { display: none !important; }
        .started-activity-container { display: none !important; }
      `;
      document.head.appendChild(style);
    };

    hideTranslatePopups();
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(hideLoaderCSS));
  }, []);
  return (
    <>
      <div id="google_translate_element"></div>
      <h4></h4>
    </>
  );
};

const PreferenceForm: FC<PreferenceFormProps> = ({ hideModal }) => {
  const dispatch = useAppDispatch();
  const { data } = useSession();

  let user = data?.user.detail;
  let userName =
    capitalizeFirstLetter(user?.firstName || '') + ' ' + user?.lastName;
  let userEmail = user?.email;

  const [deleteModal, setDeleteModal] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

  const getOption = (options: any, name: string) => {
    return options.find((cur: any) => cur.value === name) || options[0];
  };

  let initalValues = {
    currency: getOption(currencyOptions, user.currency),
    language: getOption(languageOptions, user.language),
  };

  const formik = useFormik({
    initialValues: initalValues,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      let payload = {
        currency: values.currency.value,
        language: values.language.value,
      };

      dispatch(startLoading());
      dispatch(updatePreference(payload))
        .then(() => {
          dispatch(
            showNotification({
              type: 'successful',
              message: 'Preferences Updated Successfully',
            })
          );

          reloadSession();
        })
        .catch((e) => {
          dispatch(
            showNotification({
              type: 'error',
              message:
                e?.response?.data?.message || 'Failed to update Preferences',
            })
          );
        })
        .finally(() => {
          dispatch(stopLoading());
          hideModal();
        });
    },
  });

  const deleteAccount = () => {
    setDeleteModal(false);
    setConfirmDeleteModal(false);
    dispatch(startLoading());
    dispatch(deleteUserProfile(data?.user.detail.id))
      .then(() => {
        hideModal();
        signOut();
        dispatch(
          showNotification({
            type: 'successful',
            message: 'Profile deleted Successfully',
          })
        );
      })
      .catch((e) => {
        dispatch(
          showNotification({
            type: 'error',
            message: e?.response?.data?.message || 'Failed to Delete Profile',
          })
        );
      })
      .finally(() => {
        dispatch(stopLoading());
        hideModal();
      });
  };

  return (
    <>
      <div className="flex-1 flex flex-col gap-4 max-w-[700px] justify-center flex-wrap png-form png-modal">
        <h1 className="modalTitle">Preferences</h1>

        <div className="flex flex-col gap-6">
          <div className="png-form-row">
            <div className=" w-[270px] sm:w-[120px]">
              <h4 className="text-[#c6ff36]">Select Language</h4>
              <TranslateElement />
            </div>

            <AppSelect
              options={currencyOptions}
              selected={formik.values.currency || null}
              selectHandler={(value) => {
                formik.setFieldValue('currency', value);
              }}
              multiple={false}
              title="Select Currency"
              error={
                formik.touched.currency && formik.errors.currency
                  ? String(formik.errors.currency)
                  : ''
              }
              className="w-[270px] sm:w-[300px]"
            />
          </div>

          <div className="png-form-row">
            <AppButton
              onClick={() => setDeleteModal(true)}
              className="px-6 py-3 rounded-none border-b border-red-500 min-w-[200px] w-fit"
              secondary
            >
              <div className="flex flex-row gap-[5px] items-center justify-center">
                <AppImage
                  height={20}
                  width={20}
                  src="/bin.svg"
                  alt="App Logo"
                />
                <p className="text-red-500">Delete Account</p>
              </div>
            </AppButton>
          </div>
        </div>

        <div className="flex flex-row gap-[20px] flex-wrap items-end mt-5">
          <AppButton onClick={hideModal} className="px-6 py-3" secondary>
            Cancel
          </AppButton>
          <AppButton onClick={formik.submitForm} className="px-6 py-3" primary>
            Submit
          </AppButton>
        </div>
      </div>
      <AppModal
        isOpen={deleteModal}
        modalHandler={() => setDeleteModal(false)}
        className="!bg-primary"
      >
        <div className="text-white max-w-[600px] flex flex-col items-start gap-4 png-modal">
          <h1 className="modalTitle">Delete Account</h1>
          <div className="">
            {userName && <p className="text-secondary">{userName}</p>}
            {userEmail && <p className="text-white">{userEmail}</p>}
          </div>
          <p className="">
            We&apos;re very sorry that you want to leave! But if this is what
            you want, we respect your decision. Deleting your account means:
          </p>
          <ul className="ml-5 list-disc">
            <li>Deleting your email and personal data. </li>
            <li>
              You won&apos;t be able to use our service without registering
              again.
            </li>
            <li>You won&apos;t receive any commercial communications.</li>
          </ul>
          <p className="">
            If you&apos;re sure you want to delete your account, please request
            it using the button below. Before you go... we thank you for being
            part of powandgo, and when you decide to come back... we&apos;ll be
            here!
          </p>
          <div className="flex flex-row gap-[20px] flex-wrap items-end">
            <AppButton
              onClick={() => setDeleteModal(false)}
              className="px-6 py-3"
              secondary
            >
              Cancel
            </AppButton>
            <AppButton
              onClick={() => {
                setConfirmDeleteModal(true);
              }}
              className="px-6 py-3"
              primary
            >
              Delete Account
            </AppButton>
          </div>
        </div>
      </AppModal>
      <AppModal
        isOpen={confirmDeleteModal}
        modalHandler={() => setConfirmDeleteModal(false)}
      >
        <div>
          <p className="text-primary text-xl my-4 text-center">
            Are you sure you want to Delete your account?
          </p>
          <AppModalAction
            closeHandler={() => setConfirmDeleteModal(false)}
            proceedHandler={deleteAccount}
          />
        </div>
      </AppModal>
    </>
  );
};

export default PreferenceForm;
