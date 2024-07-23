'use client';

import React, { FC, useState, useEffect } from 'react';
import AppModal from '../Base/AppModal';
import { useAppDispatch } from '@/redux/hooks';
import AppImage from '../Base/AppImage';
import { showNotification } from '@/redux/slices/commonSlice';
import AppModalAction from '../Base/AppModalAction';
import AppSwitch from '../Base/AppSwitch';
import { useRouter } from 'next/navigation';
import { changeVatStatus, deleteVat, getVAT } from '@/services/vat';
import { getHumanReadableDate } from '@/utils/dateTime';

interface ManageVatTableRowProps {
  vat: any;
}

const ManageVatTableRow: FC<ManageVatTableRowProps> = ({ vat }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [vatActive, setVatActive] = useState(vat.isActive);
  const [vatDeleteModal, setVatDeleteModal] = useState(false);
  const [vatActiveStatusModal, setVatStatusModal] = useState(false);

  const [historyModal, setHistoryModal] = useState(false);

  useEffect(() => {
    setVatActive(vat.isActive);

    return () => {};
  }, [vat]);

  const deleteVatHandler = () => {
    setVatDeleteModal(false);

    dispatch(deleteVat(vat.id))
      .then(() => {
        dispatch(getVAT());
        dispatch(
          showNotification({
            type: 'successful',
            message: 'VAT deleted Successfully',
          })
        );
      })
      .catch(() => {
        dispatch(
          showNotification({
            type: 'error',
            message: 'VAT delete unsuccessful',
          })
        );
      });
  };

  const editVatHandler = () => {
    router.push(`/dashboard/setup/vat/edit-vat/${vat.id}`);
  };

  const toggleVatActive = () => {
    setVatStatusModal(true);
  };

  const changeVatStatusHandler = () => {
    // Check if Vehicle Status can be updated
    setVatStatusModal(false);

    let currentStatus = vatActive;
    setVatActive((cur: any) => !cur);
    dispatch(changeVatStatus(vat.id, !currentStatus))
      .then(() => {
        dispatch(getVAT());
      })
      .catch(() => {
        setVatActive(currentStatus);
        dispatch(
          showNotification({
            type: 'error',
            message: "Something went wrong. VAT Status couldn't be updated",
          })
        );
      });
  };

  const closeVatStatusModal = () => {
    setVatStatusModal(false);
  };

  const closeHistoryModal = () => {
    setHistoryModal(false);
  };

  return (
    <tr>
      <td>
        <div className="cell-container">
          <p>{vat.countryName}</p>
        </div>
      </td>

      <td>
        <div className="cell-container">
          <p>{vat.countryCode}</p>
        </div>
      </td>
      <td>
        <div className="cell-container">
          <p>{vat.vatRate} </p>
        </div>
      </td>

      <td>
        <div className="cell-container">
          <p>{getHumanReadableDate(vat.createdAt)} </p>
        </div>
      </td>

      <td className="w-[150px]">
        <div className="cell-container !border-b-primary flex items-center gap-2 w-[100%]">
          <>
            <AppSwitch switchHandler={toggleVatActive} enabled={vatActive} />
            <AppModal
              isOpen={vatActiveStatusModal}
              modalHandler={closeVatStatusModal}
            >
              <div>
                <p className="text-black text-xl my-4 text-center">
                  Are you sure you want to {vatActive ? 'Disable ' : 'Active '}
                  this VAT?
                </p>
                <AppModalAction
                  closeHandler={closeVatStatusModal}
                  proceedHandler={changeVatStatusHandler}
                />
              </div>
            </AppModal>
          </>

          <>
            <div className="cursor-pointer" onClick={editVatHandler}>
              <AppImage
                src={'/edit-active.svg'}
                width={24}
                height={24}
                alt="Edit"
              />
            </div>
          </>
          <>
            <div
              className="cursor-pointer"
              onClick={() => setVatDeleteModal(true)}
            >
              <AppImage
                src={'/delete.png'}
                width={24}
                height={24}
                alt="Delete"
              />
            </div>
            <AppModal
              isOpen={vatDeleteModal}
              modalHandler={() => setVatDeleteModal(false)}
            >
              <div>
                <p className="text-black text-xl my-4 text-center">
                  Are you sure you want to Delete this VAT?
                </p>
                <AppModalAction
                  closeHandler={() => setVatDeleteModal(false)}
                  proceedHandler={deleteVatHandler}
                />
              </div>
            </AppModal>
          </>
        </div>
      </td>
    </tr>
  );
};

export default ManageVatTableRow;
