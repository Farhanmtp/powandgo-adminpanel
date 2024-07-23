'use client';

import React, { FC, useState } from 'react';
import AppModal from '../Base/AppModal';
import { useAppDispatch } from '@/redux/hooks';
import AppImage from '../Base/AppImage';
import { showNotification } from '@/redux/slices/commonSlice';
import AppModalAction from '../Base/AppModalAction';
import { getHumanReadableDateTime } from '@/utils/dateTime';
import {
  deleteInvoice,
  getAllInvoice,
  getProviderInvoice,
} from '@/services/bookingTransactions';
import useCurrencyInfo from '@/hooks/useCurrencyInfo';

interface TransactionsTableRowProps {
  transaction: any;
  isAdmin: boolean;
}

const TransactionsTableRow: FC<TransactionsTableRowProps> = ({
  transaction,
  isAdmin,
}) => {
  const dispatch = useAppDispatch();
  const [invoiceDeleteModal, setInvoiceDeleteModal] = useState(false);
  const { currencySymbol } = useCurrencyInfo();

  const fetchTransactionData = () => {
    if (isAdmin) {
      dispatch(getAllInvoice());
    } else {
      dispatch(getProviderInvoice());
    }
  };

  const deleteInvoiceHandler = () => {
    setInvoiceDeleteModal(false);

    dispatch(deleteInvoice(transaction.id))
      .then(() => {
        fetchTransactionData();
        dispatch(
          showNotification({
            type: 'successful',
            message: 'Transaction deleted Successfully',
          })
        );
      })
      .catch(() => {
        dispatch(
          showNotification({
            type: 'error',
            message: 'Transaction delete unsuccessful',
          })
        );
      });
  };

  let bookingStage = transaction?.booking?.stage?.toLowerCase();

  if (bookingStage === '') {
    bookingStage = transaction.booking.type;
  } else if (bookingStage === 'completed') {
    bookingStage = 'Charged & Paid';
  } else if (bookingStage === 'failed') {
    bookingStage = 'Payment Failed';
  } else if (bookingStage === 'cancelled') {
    bookingStage = 'Cancelled';
  }

  return (
    <tr>
      <td>
        <div className="cell-container">
          <p>{transaction.brand}</p>
        </div>
      </td>
      {isAdmin && (
        <td>
          <div className="cell-container">
            <p>{transaction?.consumer?.firstName}</p>
          </div>
        </td>
      )}
      {isAdmin && (
        <td>
          <div className="cell-container">
            <p>{transaction?.consumer?.lastName}</p>
          </div>
        </td>
      )}

      {isAdmin && (
        <td>
          <div className="cell-container">
            <p>{transaction?.consumer?.email}</p>
          </div>
        </td>
      )}

      <td>
        <div className="cell-container">
          <p>{transaction.booking.type}</p>
        </div>
      </td>

      <td>
        <div className="cell-container">
          <p>{bookingStage}</p>
        </div>
      </td>
      <td>
        <div className="cell-container">
          <p>
            {transaction.booking.startTime
              ? getHumanReadableDateTime(transaction.booking.startTime)
              : ''}
          </p>
        </div>
      </td>
      <td>
        <div className="cell-container">
          <p>{transaction.kwCharged} kWh</p>
        </div>
      </td>
      <td>
        <div className="cell-container">
          <p>
            {transaction.totalPaid} {currencySymbol}
          </p>
        </div>
      </td>
      {!isAdmin && (
        <td className="min-w-[70px]">
          <div className="cell-container !border-b-primary flex items-center gap-2">
            <>
              <div
                className="cursor-pointer"
                onClick={() => setInvoiceDeleteModal(true)}
              >
                <AppImage
                  src={'/delete.png'}
                  width={24}
                  height={24}
                  alt="Delete"
                />
              </div>
              <AppModal
                isOpen={invoiceDeleteModal}
                modalHandler={() => setInvoiceDeleteModal(false)}
              >
                <div>
                  <p className="text-black text-xl my-4 text-center">
                    Are you sure you want to Delete this Transaction?
                  </p>
                  <AppModalAction
                    closeHandler={() => setInvoiceDeleteModal(false)}
                    proceedHandler={deleteInvoiceHandler}
                  />
                </div>
              </AppModal>
            </>
          </div>
        </td>
      )}
    </tr>
  );
};

export default TransactionsTableRow;
