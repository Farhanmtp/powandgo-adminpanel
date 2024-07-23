import React, { FC } from 'react';
import useCurrencyInfo from '@/hooks/useCurrencyInfo';
import { limitDecimal } from '@/utils/general';

interface MyCommissionRowProps {
  incomeReceipt: any;
  isAdmin: boolean;
  user: any;
}

const MyCommissionRow: FC<MyCommissionRowProps> = ({ incomeReceipt }) => {
  const { currencySymbol } = useCurrencyInfo();

  return (
    <>
      <tr>
        <td>
          <div className="cell-container">{incomeReceipt?.provider?.use}</div>
        </td>

        <td>
          <div className="cell-container">{incomeReceipt.commissionType}</div>
        </td>

        <td>
          <div className="cell-container">
            {incomeReceipt?.booking?.length || ''}
          </div>
        </td>

        <td>
          <div className="cell-container">
            {`${incomeReceipt?.totalAmount} ${currencySymbol}`}
          </div>
        </td>

        <td>
          <div className="cell-container">{incomeReceipt?.commissionRate}</div>
        </td>

        <td>
          <div className="cell-container">
            <p className="capitalize">
              {`${limitDecimal(
                incomeReceipt?.commission + incomeReceipt?.vat
              )} ${currencySymbol}`}
            </p>
          </div>
        </td>

        <td>
          <div className="cell-container">
            <p className="capitalize">
              {`${limitDecimal(incomeReceipt?.commission)} ${currencySymbol}`}
            </p>
          </div>
        </td>
      </tr>
    </>
  );
};

export default MyCommissionRow;
