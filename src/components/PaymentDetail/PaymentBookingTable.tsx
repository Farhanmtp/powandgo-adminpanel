'use client';

import React, { FC } from 'react';
import AppTableHeader from '../Base/AppTableHeader';
import PaymentBookingTableRow from './PaymentBookingTableRow';

interface BookingTableProps {
  bookingList: any;
}

const headers = [
  'Booking ID',
  'Consumer Email',
  'EVC Name',
  'Plug Type',
  'Booking Type',
  'Booking Time',
  `Total Amount`,
];

const PaymentBookingTable: FC<BookingTableProps> = ({ bookingList }) => {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <AppTableHeader headers={headers} />
          <tbody>
            {bookingList?.map((booking: any) => {
              return (
                <PaymentBookingTableRow key={booking.id} booking={booking} />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentBookingTable;
