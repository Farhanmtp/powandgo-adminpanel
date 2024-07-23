'use client';
import { getProviderPaymentById } from '@/services/payments';
import { getHumanReadableDate } from '@/utils/dateTime';
import React, { FC, useEffect, useState } from 'react';
import PaymentBookingTable from './PaymentBookingTable';
import { limitDecimal } from '@/utils/general';

interface ProviderPaymentProps {
  paymentId: number;
}

const ProviderPaymentDetail: FC<ProviderPaymentProps> = ({ paymentId }) => {
  const [payment, setPayment] = useState<any>({});

  useEffect(() => {
    getProviderPaymentById(paymentId).then((res) => {
      setPayment(res.data);
    });

    return () => {};
  }, []);

  return (
    <div>
      {Object.keys(payment).length ? (
        <div className="flex flex-col gap-3">
          <h1 className="text-secondary text-xl">
            Invoice Number:{' '}
            <span className="text-white">{payment.receiptNumber}</span>
          </h1>
          <p className="text-secondary text-xl">
            Period:
            <span className="text-white">
              {' '}
              {payment.transferDate
                ? getHumanReadableDate(payment.transferDate)
                : ''}
            </span>
          </p>

          <h3 className="text-xl text-secondary">Booking Details:</h3>

          <div>
            {payment.booking && (
              <PaymentBookingTable bookingList={payment.booking} />
            )}
          </div>

          <div className="flex flex-col items-end mt-2">
            <div className="min-w-[200px] flex flex-col gap-3">
              <p className="text-secondary text-left">
                Total:{' '}
                <span className="text-white">€{payment.totalAmount}</span>
              </p>

              <p className="text-secondary">
                VAT: <span className="text-white">€{payment.vat}</span>
              </p>

              <p className="text-secondary">
                Fees:{' '}
                <span className="text-white">
                  €{limitDecimal(payment.commission)}
                </span>
              </p>

              <p className="text-secondary">
                Amount Paid:{' '}
                <span className="text-white">
                  €{limitDecimal(payment.amountPaid)}
                </span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default ProviderPaymentDetail;
