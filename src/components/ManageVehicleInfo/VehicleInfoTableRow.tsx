'use client';

import React, { FC, useState, useEffect } from 'react';
import AppModal from '../Base/AppModal';
import { useAppDispatch } from '@/redux/hooks';
import AppImage from '../Base/AppImage';
import { showNotification } from '@/redux/slices/commonSlice';
import AppModalAction from '../Base/AppModalAction';
import { getHumanReadableDate } from '@/utils/dateTime';
import AppSwitch from '../Base/AppSwitch';
import { useRouter } from 'next/navigation';
import {
  changeVehicleInfoStatus,
  deleteVehicleInfo,
  getAllVehicleInfo,
} from '@/services/vehicleInfo';

interface VehicleInfoTableRowProps {
  vehicleInfo: any;
  isAdmin: boolean;
}

const VehicleInfoTableRow: FC<VehicleInfoTableRowProps> = ({
  vehicleInfo,
  isAdmin,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [vehicleInfoActive, setVehicleInfoActive] = useState(
    vehicleInfo.isActive
  );
  const [vehicleDeleteModal, setVehicleDeleteModal] = useState(false);
  const [vehicleStatusModal, setVehicleStatusModal] = useState(false);

  useEffect(() => {
    setVehicleInfoActive(vehicleInfo.isActive);

    return () => {};
  }, [vehicleInfo]);

  const deleteVehicleHandler = () => {
    setVehicleDeleteModal(false);

    dispatch(deleteVehicleInfo(vehicleInfo.id))
      .then(() => {
        dispatch(getAllVehicleInfo());
        dispatch(
          showNotification({
            type: 'successful',
            message: 'Vehicle Info deleted Successfully',
          })
        );
      })
      .catch(() => {
        dispatch(
          showNotification({
            type: 'error',
            message: 'Vehicle Info delete unsuccessful',
          })
        );
      });
  };

  const editVehicleInfoHandler = () => {
    router.push(`/dashboard/setup/edit-vehicle-info/${vehicleInfo.id}`);
  };

  const toggleVehicleActive = () => {
    setVehicleStatusModal(true);
  };

  const changeVehicleStatusHandler = () => {
    // Check if Vehicle Status can be updated
    setVehicleStatusModal(false);

    let currentStatus = vehicleInfoActive;
    setVehicleInfoActive((cur: any) => !cur);
    dispatch(changeVehicleInfoStatus(String(vehicleInfo.id), !currentStatus))
      .then(() => {
        dispatch(
          showNotification({
            type: 'successful',
            message: 'Vehicle Info Status changed Successfully',
          })
        );
        dispatch(getAllVehicleInfo());
      })
      .catch(() => {
        setVehicleInfoActive(currentStatus);
        dispatch(
          showNotification({
            type: 'error',
            message: "Something went wrong. Vehicle couldn't be updated",
          })
        );
      });
  };

  const closeVehicleStatusModal = () => {
    setVehicleStatusModal(false);
  };

  return (
    <tr>
      <td>
        <div className="cell-container">
          <p>{vehicleInfo.brand}</p>
        </div>
      </td>
      <td>
        <div className="cell-container">
          <p>{vehicleInfo.model}</p>
        </div>
      </td>

      <td>
        <div className="cell-container">
          <p>{getHumanReadableDate(vehicleInfo.createdAt)} </p>
        </div>
      </td>

      <td className="min-w-[150px] w-[150px]">
        <div className="cell-container !border-b-primary flex items-center gap-2 min-w-[150px]">
          <>
            <AppSwitch
              switchHandler={toggleVehicleActive}
              enabled={vehicleInfoActive}
            />
            <AppModal
              isOpen={vehicleStatusModal}
              modalHandler={closeVehicleStatusModal}
            >
              <div>
                <p className="text-black text-xl my-4 text-center">
                  Are you sure you want to{' '}
                  {vehicleInfoActive ? 'Disable ' : 'Activate '}
                  this Vehicle?
                </p>
                <AppModalAction
                  closeHandler={closeVehicleStatusModal}
                  proceedHandler={changeVehicleStatusHandler}
                />
              </div>
            </AppModal>
          </>

          <>
            <div className="cursor-pointer" onClick={editVehicleInfoHandler}>
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
              onClick={() => setVehicleDeleteModal(true)}
            >
              <AppImage
                src={'/delete.png'}
                width={24}
                height={24}
                alt="Delete"
              />
            </div>
            <AppModal
              isOpen={vehicleDeleteModal}
              modalHandler={() => setVehicleDeleteModal(false)}
            >
              <div>
                <p className="text-black text-xl my-4 text-center">
                  Are you sure you want to Delete this Vehicle brand?
                </p>
                <AppModalAction
                  closeHandler={() => setVehicleDeleteModal(false)}
                  proceedHandler={deleteVehicleHandler}
                />
              </div>
            </AppModal>
          </>
        </div>
      </td>
    </tr>
  );
};

export default VehicleInfoTableRow;
