'use client';

import React, { FC, useState, useEffect } from 'react';
import AppModal from '../Base/AppModal';
import AppSwitch from '../Base/AppSwitch';
import AppButton from '../Base/AppButton';
import {
  changeGarageStatus,
  deleteGarage,
  getAllGarage,
  getUserGarage,
} from '@/services/garage';
import { useAppDispatch } from '@/redux/hooks';
import AppImage from '../Base/AppImage';
import { useRouter } from 'next/navigation';
import { showNotification } from '@/redux/slices/commonSlice';
import { checkIfBookingActive, checkIfChargingActive } from '@/utils/vehicle';
import AppModalAction from '../Base/AppModalAction';

interface Vehicle {
  id: number;
  brand: string;
  model: string;
  batteryCapacity: string;
  isActive: boolean;
  displayMeasurement: boolean;
  user: any;
  booking: any;
  charging: any;
}

interface VehicleTableRowProps {
  vehicle: Vehicle;
  isAdmin: boolean;
}

const VehicleTableRow: FC<VehicleTableRowProps> = ({ vehicle, isAdmin }) => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const [vehicleStatusModal, setVehicleStatusModal] = useState(false);
  const [vehicleDeleteModal, setVehicleDeleteModal] = useState(false);

  const [vehicleActive, setVehicleActive] = useState(vehicle.isActive);

  useEffect(() => {
    setVehicleActive(vehicle.isActive);

    return () => {};
  }, [vehicle]);

  const toggleVehicleActive = (value: boolean) => {
    setVehicleStatusModal(true);
  };

  const closeModal = () => {
    setVehicleStatusModal(false);
  };

  const changeVehicleStatus = () => {
    // Check if Vehicle Status can be updated
    setVehicleStatusModal(false);
    let bookingActive = checkIfBookingActive(vehicle.booking);

    if (bookingActive) {
      dispatch(
        showNotification({
          type: 'error',
          message: `This vehicle has an active ${bookingActive.type} and cannot be disabled`,
        })
      );
      return;
    }

    if (checkIfChargingActive(vehicle.charging)) {
      dispatch(
        showNotification({
          type: 'error',
          message:
            'This vehicle has an active charging session and cannot be disabled',
        })
      );
      return;
    }

    let currentStatus = vehicleActive;
    setVehicleActive((cur) => !cur);
    dispatch(changeGarageStatus(String(vehicle.id), !currentStatus))
      .then(() => {
        fetchVehicleData();
      })
      .catch(() => {
        setVehicleActive(currentStatus);
        dispatch(
          showNotification({
            type: 'error',
            message: "Something went wrong. Vehicle Status couldn't be updated",
          })
        );
      });
  };

  const fetchVehicleData = () => {
    if (isAdmin) {
      dispatch(getAllGarage());
    } else {
      dispatch(getUserGarage());
    }
  };

  const editVehicleHandler = () => {
    if (isAdmin) {
      router.push(`/dashboard/vehicle-management/vehicle/${vehicle.id}`);
    } else {
      router.push(`/dashboard/vehicle-management/edit-vehicle/${vehicle.id}`);
    }
  };

  const deleteVehicleHandler = () => {
    setVehicleDeleteModal(false);
    let bookingActive = checkIfBookingActive(vehicle.booking);
    let chargingActive = checkIfChargingActive(vehicle.charging);
    if (bookingActive) {
      dispatch(
        showNotification({
          type: 'error',
          message: `This vehicle has an active ${bookingActive.type} and cannot be deleted`,
        })
      );
      return;
    }

    if (chargingActive) {
      dispatch(
        showNotification({
          type: 'error',
          message:
            'This vehicle has an active charging session and cannot be deleted',
        })
      );
      return;
    }
    dispatch(deleteGarage(vehicle.id))
      .then(() => {
        fetchVehicleData();
        dispatch(
          showNotification({
            type: 'successful',
            message: 'Vehicle deleted Successfully',
          })
        );
      })
      .catch(() => {
        dispatch(
          showNotification({
            type: 'error',
            message: 'Vehicle delete unsuccessful',
          })
        );
      });
  };

  return (
    <tr>
      <td>
        <div className="cell-container">
          <p>{vehicle.brand}</p>
        </div>
      </td>
      <td>
        <div className="cell-container">
          <p>{vehicle.model}</p>
        </div>
      </td>
      {isAdmin && (
        <td>
          <div className="cell-container">
            <p>{vehicle.user.firstName + ' ' + vehicle.user.lastName}</p>
          </div>
        </td>
      )}

      {isAdmin && (
        <td>
          <div className="cell-container">
            <p>{vehicle.user.email}</p>
          </div>
        </td>
      )}

      <td>
        <div className="cell-container">
          <p>{vehicle.batteryCapacity} kWh</p>
        </div>
      </td>
      <td>
        <div className="cell-container">
          <p>{vehicle.displayMeasurement ? 'Yes' : 'No'}</p>
        </div>
      </td>
      <td>
        <div className="cell-container">
          <p>{vehicleActive ? 'Active' : 'Disabled'}</p>
        </div>
      </td>
      <td className="min-w-[150px]">
        <div className="cell-container !border-b-primary flex items-center gap-2">
          <AppSwitch
            switchHandler={toggleVehicleActive}
            enabled={vehicleActive}
          />

          {!isAdmin && (
            <>
              <div className="cursor-pointer" onClick={editVehicleHandler}>
                <AppImage
                  src={'/edit-active.svg'}
                  width={24}
                  height={24}
                  alt="Edit"
                />
              </div>
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
              <AppModal isOpen={vehicleDeleteModal} modalHandler={closeModal}>
                <div>
                  <p className="text-black text-xl my-4 text-center">
                    Are you sure you want to Delete this vehicle?
                  </p>
                  <AppModalAction
                    closeHandler={() => setVehicleDeleteModal(false)}
                    proceedHandler={deleteVehicleHandler}
                  />
                </div>
              </AppModal>
            </>
          )}

          {isAdmin && (
            <>
              <div className="cursor-pointer" onClick={editVehicleHandler}>
                <AppImage
                  src={'/eye-open.svg'}
                  width={35}
                  height={35}
                  alt="View"
                />
              </div>
            </>
          )}

          <AppModal isOpen={vehicleStatusModal} modalHandler={closeModal}>
            <div>
              <p className="text-black text-xl my-4 text-center">
                Are you sure you want to{' '}
                {vehicleActive ? 'Disable ' : 'Active '}
                this vehicle?
              </p>
              <AppModalAction
                closeHandler={closeModal}
                proceedHandler={changeVehicleStatus}
              />
            </div>
          </AppModal>
        </div>
      </td>
    </tr>
  );
};

export default VehicleTableRow;
