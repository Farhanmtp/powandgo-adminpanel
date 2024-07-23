'use client';

import React, { FC, useState, useEffect } from 'react';
import AppModal from '../Base/AppModal';
import { useAppDispatch } from '@/redux/hooks';
import AppImage from '../Base/AppImage';
import { showNotification } from '@/redux/slices/commonSlice';
import AppModalAction from '../Base/AppModalAction';
import {
  getHumanReadableDate,
  getHumanReadableDateTime,
} from '@/utils/dateTime';
import AppSwitch from '../Base/AppSwitch';
import { useRouter } from 'next/navigation';
import {
  deleteCommission,
  getAllCommission,
  changeCommissionStatus,
} from '@/services/commission';
import AppTableHeader from '../Base/AppTableHeader';

const headersAdmin = [
  'Commission Type',
  'Provider Type',
  'EVC Name',
  'Commission Rate (%)',
  'Created Date',
  'Status',
  'Action',
];

const historyHeaders = [
  'Commission Type',
  'Provider Type',
  'EVC Name',
  'Commission Rate (%)',
  'Created Date',
  'Updated Date',
];

interface CommissionTableRowProps {
  commission: any;
  isAdmin: boolean;
}

const CommissionTableRow: FC<CommissionTableRowProps> = ({
  commission,
  isAdmin,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [commissionActive, setCommissionActive] = useState(commission.isActive);
  const [commissionDeleteModal, setCommissionDeleteModal] = useState(false);
  const [commissionActiveStatusModal, setCommissionStatusModal] =
    useState(false);

  const [historyModal, setHistoryModal] = useState(false);

  useEffect(() => {
    setCommissionActive(commission.isActive);

    return () => {};
  }, [commission]);

  const deleteCommissionHandler = () => {
    setCommissionDeleteModal(false);

    dispatch(deleteCommission(commission.id))
      .then(() => {
        dispatch(getAllCommission());
        dispatch(
          showNotification({
            type: 'successful',
            message: 'Commission deleted Successfully',
          })
        );
      })
      .catch(() => {
        dispatch(
          showNotification({
            type: 'error',
            message: 'Commission delete unsuccessful',
          })
        );
      });
  };

  const editCommissionHandler = () => {
    router.push(
      `/dashboard/commission-management/edit-commission/${commission.id}`
    );
  };

  const toggleCommissionActive = () => {
    setCommissionStatusModal(true);
  };

  const changeCommissionStatusHandler = () => {
    // Check if Vehicle Status can be updated
    setCommissionStatusModal(false);

    let currentStatus = commissionActive;
    setCommissionActive((cur: any) => !cur);
    dispatch(changeCommissionStatus(String(commission.id), !currentStatus))
      .then(() => {
        dispatch(getAllCommission());
      })
      .catch(() => {
        setCommissionActive(currentStatus);
        dispatch(
          showNotification({
            type: 'error',
            message:
              "Something went wrong. Commission Status couldn't be updated",
          })
        );
      });
  };

  const closeCommissionStatusModal = () => {
    setCommissionStatusModal(false);
  };

  const closeHistoryModal = () => {
    setHistoryModal(false);
  };

  let evcNames = commission.evcs?.map((evc: any) => evc.name).join(', ');
  return (
    <tr>
      <td>
        <div className="cell-container">
          <p>{commission.isCustom ? 'Custom' : 'General'}</p>
        </div>
      </td>
      <td>
        <div className="cell-container">
          <p>{commission.providerType}</p>
        </div>
      </td>
      <td>
        <div className="cell-container max-w-[350px] overflow-auto">
          <p>{evcNames} </p>
        </div>
      </td>

      <td>
        <div className="cell-container">
          <p>{commission.commissionRate}%</p>
        </div>
      </td>

      <td>
        <div className="cell-container">
          <p>{getHumanReadableDate(commission.createdAt)}</p>
        </div>
      </td>

      <td>
        <div className="cell-container">
          <p>{commission.isActive ? 'Active' : 'Disabled'}</p>
        </div>
      </td>

      <td className="min-w-[150px]">
        <div className="cell-container !border-b-primary flex items-center gap-2 min-w-[150px]">
          <>
            <AppSwitch
              switchHandler={toggleCommissionActive}
              enabled={commissionActive}
            />
            <AppModal
              isOpen={commissionActiveStatusModal}
              modalHandler={closeCommissionStatusModal}
            >
              <div>
                <p className="text-black text-xl my-4 text-center">
                  Are you sure you want to{' '}
                  {commissionActive ? 'Disable ' : 'Active '}
                  this Commission?
                </p>
                <AppModalAction
                  closeHandler={closeCommissionStatusModal}
                  proceedHandler={changeCommissionStatusHandler}
                />
              </div>
            </AppModal>
          </>

          <>
            <div className="cursor-pointer" onClick={editCommissionHandler}>
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
              onClick={() => setCommissionDeleteModal(true)}
            >
              <AppImage
                src={'/delete.png'}
                width={24}
                height={24}
                alt="Delete"
              />
            </div>
            <AppModal
              isOpen={commissionDeleteModal}
              modalHandler={() => setCommissionDeleteModal(false)}
            >
              <div>
                <p className="text-black text-xl my-4 text-center">
                  Are you sure you want to Delete this Commission?
                </p>
                <AppModalAction
                  closeHandler={() => setCommissionDeleteModal(false)}
                  proceedHandler={deleteCommissionHandler}
                />
              </div>
            </AppModal>
          </>

          {commission.commissionHistory.length > 0 && (
            <>
              <div
                className="cursor-pointer"
                onClick={() => {
                  setHistoryModal(true);
                }}
              >
                <AppImage
                  src={'/eye-open.svg'}
                  width={24}
                  height={24}
                  alt="Show History"
                />
              </div>
              <AppModal isOpen={historyModal} modalHandler={closeHistoryModal}>
                <div className="text-black">
                  <div>
                    <table id="customers">
                      <AppTableHeader headers={historyHeaders} />
                      <tbody>
                        {commission.commissionHistory.map(
                          (cur: any, index: number) => {
                            return (
                              <tr key={index}>
                                <td>
                                  {commission.isCustom ? 'Custom' : 'General'}
                                </td>
                                <td>{cur.providerType}</td>
                                <td>{evcNames}</td>

                                <td>{cur.commissionRate}</td>
                                <td>
                                  {getHumanReadableDateTime(
                                    commission.createdAt
                                  )}
                                </td>
                                <td>
                                  {getHumanReadableDateTime(cur.createdAt)}
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                  <AppModalAction
                    proceedHandlerText="Close"
                    proceedHandler={closeHistoryModal}
                  />
                </div>
              </AppModal>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default CommissionTableRow;
