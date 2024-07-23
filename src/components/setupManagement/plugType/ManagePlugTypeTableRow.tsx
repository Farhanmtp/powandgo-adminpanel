'use client';

import React, { FC, useState } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import AppToast from '@/components/Base/AppToast';
import AppSwitch from '@/components/Base/AppSwitch';
import AppModalAction from '@/components/Base/AppModalAction';
import AppModal from '@/components/Base/AppModal';
import {
  deletePlugType,
  getPlugTypes,
  updatePlugTypeStatus,
} from '@/services/plugType';
import AppImage from '@/components/Base/AppImage';
import { showNotification } from '@/redux/slices/commonSlice';
import { useRouter } from 'next/navigation';
import { getHumanReadableDate } from '@/utils/dateTime';

interface ManagePlugTypeTableRowProps {
  plugType: any;
  isAdmin: boolean;
  user: any;
  reLoad?: () => void;
}

const ManagePlugTypeTableRow: FC<ManagePlugTypeTableRowProps> = ({
  plugType,
  isAdmin,
  user,
  reLoad,
}) => {
  const [toastMessage, setToastMessage] = useState({
    type: 'info',
    message: '',
  });
  const dispatch = useAppDispatch();
  const [plugTypeStatusModal, setPlugTypeStatusModal] = useState(false);
  const [plugTypeDeleteModal, setPlugTypeDeleteModal] = useState(false);
  const [plugTypeActive, setPlugTypeActive] = useState(plugType.isActive);

  const router = useRouter();

  const togglePlugTypeActive = () => {
    setPlugTypeActive(!plugTypeActive);
  };

  const togglePlugTypeStatusModal = () => {
    setPlugTypeStatusModal(true);
  };

  const closeModal = () => {
    setPlugTypeStatusModal(false);
  };

  const fetchPlugTypeData = () => {
    if (reLoad) {
      reLoad();
    }
  };

  const changePlugTypeStatusHandler = () => {
    setPlugTypeStatusModal(false);

    dispatch(updatePlugTypeStatus(plugType.id, !plugType.isActive))
      .then(() => {
        setPlugTypeActive(!plugType.isActive);
        dispatch(
          showNotification({
            type: 'successful',
            message: `Plug Type ${
              !plugType.isActive ? 'Activated' : 'Deactivated'
            } successfully`,
          })
        );
        fetchPlugTypeData();
      })
      .catch(() => {
        dispatch(
          showNotification({
            type: 'error',
            message: 'Error changing plug type status',
          })
        );
      });
  };

  const deletePlugTypeHandler = () => {
    setPlugTypeDeleteModal(false);

    dispatch(deletePlugType(plugType.id))
      .then(() => {
        dispatch(
          showNotification({
            type: 'successful',
            message: 'Plug Type deleted Successfully',
          })
        );
        fetchPlugTypeData();
      })
      .catch(() => {
        dispatch(
          showNotification({
            type: 'error',
            message: 'Plug Type delete unsuccessful',
          })
        );
      });
  };

  const editPlugTypeHandler = () => {
    router.push(`/dashboard/setup/plug-type/edit-plug-type/${plugType.id}`);
  };

  return (
    <>
      <tr>
        <td>
          <div className="cell-container">{plugType.type}</div>
        </td>

        <td>
          <div className="cell-container">{plugType.vehicleType}</div>
        </td>

        <td>
          <div className="cell-container">{plugType.power}</div>
        </td>

        <td>
          <div className="cell-container">{plugType.price} €</div>
        </td>

        <td>
          <div className="cell-container">
            {getHumanReadableDate(plugType.createdAt)}
          </div>
        </td>

        {isAdmin && (
          <>
            <td className="w-[150px]">
              <div className="cell-container !border-b-primary flex items-center gap-2">
                <div className="cursor-pointer" onClick={editPlugTypeHandler}>
                  <AppImage
                    src={'/edit-active.svg'}
                    width={24}
                    height={24}
                    alt="Edit"
                  />
                </div>
                <AppSwitch
                  switchHandler={togglePlugTypeStatusModal}
                  enabled={plugTypeActive}
                />

                <div
                  className="cursor-pointer"
                  onClick={() => setPlugTypeDeleteModal(true)}
                >
                  <AppImage
                    src={'/delete.png'}
                    width={24}
                    height={24}
                    alt="Delete"
                  />

                  <AppModal
                    isOpen={plugTypeDeleteModal}
                    modalHandler={closeModal}
                  >
                    <div>
                      <p className="text-black text-xl my-4 text-center">
                        Are you sure you want to Delete this Plug Type?
                      </p>
                      <AppModalAction
                        closeHandler={() => setPlugTypeDeleteModal(false)}
                        proceedHandler={deletePlugTypeHandler}
                      />
                    </div>
                  </AppModal>
                </div>
              </div>
            </td>
          </>
        )}

        <AppModal isOpen={plugTypeStatusModal} modalHandler={closeModal}>
          <div>
            <p className="text-black text-xl my-4 text-center">
              Are you sure you want to{' '}
              {plugType.isActive ? 'Disable ' : 'Activate '}
              this Plug Type?
            </p>
            <AppModalAction
              closeHandler={closeModal}
              proceedHandler={changePlugTypeStatusHandler}
            />
          </div>
        </AppModal>
      </tr>
      {toastMessage.message && (
        <AppToast
          type={toastMessage.type}
          message={toastMessage.message}
          onClose={() => {
            setToastMessage({
              type: 'info',
              message: '',
            });
          }}
        />
      )}
    </>
  );
};

export default ManagePlugTypeTableRow;
