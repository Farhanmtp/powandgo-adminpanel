'use client';

import React, { FC } from 'react';
import { getHumanReadableDate } from '@/utils/dateTime';
import useCurrencyInfo from '@/hooks/useCurrencyInfo';
import { useRouter } from 'next/navigation';
import AppImage from '../Base/AppImage';
import { limitDecimal } from '@/utils/general';

interface PaymentTableRowProps {
  payment: any;
  isAdmin: boolean;
}

const PaymentTableRow: FC<PaymentTableRowProps> = ({ payment, isAdmin }) => {
  const { currencySymbol } = useCurrencyInfo();
  const router = useRouter();

  let evcNames = payment.booking
    ?.map((cur: any) => {
      return cur?.evc?.name || null;
    })
    .join(', ');

  let numberOfBookings = payment?.booking?.length || 0;

  const viewPaymentDetail = () => {
    router.push(`/dashboard/payments/${payment.id}`);
  };

  return (
    <tr>
      <td>
        <div className="cell-container">
          <p>{payment.receiptNumber}</p>
        </div>
      </td>

      <td className="w-[300px]">
        <div className="cell-container max-w-[300px] overflow-auto">
          <p>{evcNames}</p>
        </div>
      </td>

      <td>
        <div className="cell-container">
          <p>{numberOfBookings}</p>
        </div>
      </td>

      <td>
        <div className="cell-container">
          <p>{payment.paymentMonth}</p>
        </div>
      </td>

      <td>
        <div className="cell-container">
          <p>{payment.paymentStatus}</p>
        </div>
      </td>

      <td>
        <div className="cell-container">
          <p>{getHumanReadableDate(payment.transferDate)}</p>
        </div>
      </td>

      <td>
        <div className="cell-container">
          <p>{`${limitDecimal(payment.amountPaid)} ${currencySymbol}`}</p>
        </div>
      </td>
      <td className="w-[50px]">
        <div className="cell-container flex flex-col justify-center items-center">
          <div onClick={viewPaymentDetail} className="w-fit">
            <AppImage
              src="/eye-open.svg"
              alt="view"
              className="cursor-pointer"
              width={20}
              height={20}
            />
          </div>
        </div>
      </td>
    </tr>
  );
};

export default PaymentTableRow;
