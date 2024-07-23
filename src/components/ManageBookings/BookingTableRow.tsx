'use client';

import React, { FC } from 'react';
import {
  getHumanReadableDate,
  getHumanReadableDateTime,
} from '@/utils/dateTime';
import useCurrencyInfo from '@/hooks/useCurrencyInfo';

interface BookingTableRowProps {
  booking: any;
  isAdmin: boolean;
}

const BookingTableRow: FC<BookingTableRowProps> = ({ booking, isAdmin }) => {
  const { currencySymbol } = useCurrencyInfo();

  let {
    esParkingCost,
    esChargingCost,
    esPowerKW,
    esPlatformFee,
    esVAT,
    finalPlatformFee,
    finalParkingCost,
    finalChargingCost,
    finalPowerKW,
    finalVAT,
  } = booking;

  let estimatedArr = [
    esParkingCost,
    esChargingCost,
    esPowerKW,
    esPlatformFee,
    esVAT,
  ];
  let finalArr = [
    finalPlatformFee,
    finalParkingCost,
    finalChargingCost,
    finalPowerKW,
    finalVAT,
  ];

  let totalAmount =
    booking.stage.toLowerCase() === 'completed'
      ? finalArr.reduce((a, b) => a + b, 0)
      : booking.preAuthPayment;

  const transformStage = () => {
    let stage = booking?.stage?.toLowerCase() || '';
    if (!stage) {
      return booking.type.toLowerCase() === 'booking' ? 'Booked' : 'Reserved';
    } else if (stage == 'completed') {
      return 'Charged and Paid';
    } else return booking.stage;
  };

  let bookingStage = transformStage();

  return (
    <tr>
      <td>
        <div className="cell-container">
          <p>{booking.id}</p>
        </div>
      </td>
      <td>
        <div className="cell-container">
          <p>{booking.consumer?.firstName}</p>
        </div>
      </td>
      <td>
        <div className="cell-container max-w-[350px] overflow-auto">
          <p>{booking.consumer?.lastName}</p>
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
          <p>{bookingStage}</p>
        </div>
      </td>

      <td>
        <div className="cell-container">
          <p>{`${parseFloat(totalAmount).toFixed(2)} ${currencySymbol}`}</p>
        </div>
      </td>
    </tr>
  );
};

export default BookingTableRow;
