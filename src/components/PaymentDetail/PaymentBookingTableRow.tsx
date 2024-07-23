'use client';

import React, { FC } from 'react';
import { getHumanReadableDateTime } from '@/utils/dateTime';
import useCurrencyInfo from '@/hooks/useCurrencyInfo';

interface BookingTableRowProps {
  booking: any;
}

const PaymentBookingTableRow: FC<BookingTableRowProps> = ({ booking }) => {
  return (
    <tr>
      <td>
        <div className="cell-container">
          <p>{booking.id}</p>
        </div>
      </td>
      <td>
        <div className="cell-container">
          <p>{booking.consumer?.email}</p>
        </div>
      </td>

      <td>
        <div className="cell-container">
          <p>{booking.evc?.name}</p>
        </div>
      </td>

      <td>
        <div className="cell-container">
          <p>{booking.plug?.type}</p>
        </div>
      </td>

      <td>
        <div className="cell-container">
          <p>{booking.type}</p>
        </div>
      </td>

      <td>
        <div className="cell-container">
          <p>{getHumanReadableDateTime(booking.startTime)}</p>
        </div>
      </td>

      <td>
        <div className="cell-container">
          <p>€{booking.finalTotalCost}</p>
        </div>
      </td>
    </tr>
  );
};

export default PaymentBookingTableRow;
