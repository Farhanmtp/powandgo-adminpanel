import React, { FC } from 'react';
import AppImage from '../Base/AppImage';
import { useAppDispatch } from '@/redux/hooks';
import { deleteIBAN } from '@/services/bank';
import { showNotification, startLoading } from '@/redux/slices/commonSlice';
import { stopLoading } from '@/redux/slices/commonSlice';
import { reloadSession } from '@/utils/profile';
import AppButton from '../Base/AppButton';

interface IbanInfoProps {
  user: any;
  hideModal: () => void;
}

const IbanInfo: FC<IbanInfoProps> = ({ user, hideModal }) => {
  const dispatch = useAppDispatch();

  let bank = user.bank;

  const deleteIban = () => {
    dispatch(startLoading());
    dispatch(deleteIBAN(bank.id))
      .then(() => {
        hideModal();
        reloadSession();
        dispatch(
          showNotification({
            type: 'successful',
            message: 'IBAN deleted Successfully',
          })
        );
      })
      .catch((e) => {
        dispatch(
          showNotification({
            type: 'error',
            message: e?.response?.data?.message || 'Failed to Delete IBAN',
          })
        );
      })
      .finally(() => {
        dispatch(stopLoading());
      });
  };

  const copyIban = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(bank.iban)
        .then(() => {
          dispatch(
            showNotification({
              type: 'successful',
              message: 'IBAN Copied',
            })
          );
        })
        .catch((error) => {
          console.error('Error copying IBAN to clipboard:', error);
        });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = bank.iban;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        dispatch(
          showNotification({
            type: 'successful',
            message: 'IBAN Copied',
          })
        );
      } catch (err) {
        console.error('Unable to copy to clipboard', err);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="md:max-w-[400px] lg:w-[700px] min-h-[200px] w-fit png-modal relative">
      <h1 className="modalTitle">IBAN</h1>
      <div className="flex flex-col gap-5 min-h-[150px] items-center justify-center">
        <div className="flex flex-row gap-2">
          <p className="font-semibold text-xl">{user.bank.iban}</p>

          {/* <div
            className="cursor-pointer w-fit"
            onClick={copyIban}
            title="Copy IBAN"
          >
            <AppImage
              src={'/copy-icon.svg'}
              width={24}
              height={24}
              alt="Copy"
            />
          </div> */}
        </div>

        <div className="flex flex-row gap-4 items-center">
          <AppButton
            onClick={copyIban}
            className="px-6 py-3 rounded-none border-b border-green-500 max-w-[170px]"
            secondary
          >
            <div className="flex flex-row gap-[5px] items-center justify-center">
              <AppImage
                height={20}
                width={20}
                src="/copy-icon.svg"
                alt="App Logo"
              />
              <p className="text-green-500 text-sm">Copy IBAN</p>
            </div>
          </AppButton>

          <AppButton
            onClick={deleteIban}
            className="px-6 py-3 rounded-none border-b border-red-500 max-w-[170px]"
            secondary
          >
            <div className="flex flex-row gap-[5px] items-center justify-center">
              <AppImage
                height={20}
                width={20}
                src="/delete.png"
                alt="App Logo"
              />
              <p className="text-red-500 text-sm">Delete IBAN</p>
            </div>
          </AppButton>
        </div>
      </div>

      <div
        className="cursor-pointer w-fit absolute top-0 right-0"
        onClick={hideModal}
      >
        <AppImage src={'/close-cross.svg'} width={24} height={24} alt="Close" />
      </div>
    </div>
  );
};

export default IbanInfo;
