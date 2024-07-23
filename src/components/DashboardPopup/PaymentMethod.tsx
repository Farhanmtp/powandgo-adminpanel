'use client';

/*


REFACTOR - Convert this into multiple files



*/

import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { FC, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import AppButton from '../Base/AppButton';
import { useAppDispatch } from '@/redux/hooks';
import { addPayment, deletePayment, updatePayment } from '@/services/payment';
import { startLoading, stopLoading } from '@/redux/slices/commonSlice';
import { showNotification } from '@/redux/slices/commonSlice';
import { useSession } from 'next-auth/react';
import { reloadSession } from '@/utils/profile';
import AppImage from '../Base/AppImage';
import AppModal from '../Base/AppModal';
import AppModalBody from '../Base/AppModalBody';

const cardElementOptions = {
  style: {
    base: {
      color: '#FFFFFF',
      fontSize: '16px',
      '::placeholder': {
        color: '#FFFFFF',
      },
    },
    invalid: {
      color: '#EF4444',
    },
  },
};

interface StripeCardElementProps {
  hideModal: () => void;
  updateModal?: boolean;
  paymentId?: number;
}

const StripeCardElement: FC<StripeCardElementProps> = ({
  hideModal,
  updateModal,
  paymentId,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useAppDispatch();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cardElement = elements?.getElement('card');

    if (stripe && cardElement) {
      try {
        const { paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });

        if (paymentMethod?.id) {
          dispatch(startLoading());
          let payload = {
            tokenId: paymentMethod.id,
          };

          const action =
            updateModal && paymentId
              ? updatePayment(paymentId, paymentMethod.id)
              : addPayment(payload);

          dispatch(action)
            .then(() => {
              dispatch(
                showNotification({
                  type: 'successful',
                  message: `Payment Method ${
                    updateModal ? 'Updated' : 'Added'
                  } Successfully`,
                })
              );
              reloadSession();
            })
            .catch((error) => {
              dispatch(
                showNotification({
                  type: 'error',
                  message:
                    error?.response?.data?.message ||
                    `Failed to ${
                      updateModal ? 'Update' : 'Add'
                    } Payment Method`,
                })
              );
            })
            .finally(() => {
              hideModal();
              dispatch(stopLoading());
            });
        } else {
          throw new Error('Not able to generate Payment Id');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-8 color-white text-white"
    >
      <CardElement options={cardElementOptions} />
      <div className="flex flex-row gap-[20px] flex-wrap items-center">
        <AppButton onClick={hideModal} className="px-6 py-3" secondary>
          Cancel
        </AppButton>
        <AppButton
          onClick={() => {}}
          type="submit"
          className="px-6 py-3"
          primary
        >
          Submit
        </AppButton>
      </div>
    </form>
  );
};

interface PaymentFormProps {
  hideModal: () => void;
}

const PaymentForm: FC<PaymentFormProps> = ({ hideModal }) => {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
  );
  const dispatch = useAppDispatch();

  const { data } = useSession();
  let payment = data?.user?.detail?.payment || [];

  const deletePaymentHandler = () => {
    dispatch(startLoading());
    dispatch(deletePayment(payment[0].id))
      .then(() => {
        dispatch(
          showNotification({
            type: 'successful',
            message: 'Payment Method Deleted Successfully',
          })
        );
        reloadSession();
      })
      .catch((error) => {
        dispatch(
          showNotification({
            type: 'error',
            message:
              error?.response?.data?.message ||
              'Failed to delete Payment Method',
          })
        );
      })
      .finally(() => {
        hideModal();
        dispatch(stopLoading());
      });
  };

  const [updateModal, setUpdateModal] = useState(false);

  let title = <h2 className="mb-[20px] text-xl">Payment Method</h2>;

  return (
    <div className="w-[300px] md:max-w-[400px] lg:w-[700px] png-modal max-w-[100%] paymentMethod">
      {payment.length ? (
        <AppModalBody hideModal={hideModal}>
          <>
            {title}
            <div className="flex flex-row text-xl min-h-[80px] justify-center gap-2 items-center">
              <p>**** **** **** {payment?.[0]?.last4}</p>
              <div
                className="cursor-pointer"
                onClick={() => {
                  setUpdateModal(true);
                }}
              >
                <AppImage
                  height={24}
                  width={24}
                  src="/edit-active.svg"
                  alt="edit"
                />
              </div>
            </div>
          </>
        </AppModalBody>
      ) : (
        <>
          {title}
          <Elements stripe={stripePromise}>
            <StripeCardElement hideModal={hideModal} />
          </Elements>
        </>
      )}
      {updateModal && (
        <AppModal
          isOpen={updateModal}
          modalHandler={() => setUpdateModal(false)}
          className="!bg-primary w-[300px] md:max-w-[450px] lg:w-[700px] png-modal max-w-[100%]"
        >
          <div className="flex flex-col gap-8">
            <h2 className="text-xl">Update Payment Method</h2>
            <Elements stripe={stripePromise}>
              <StripeCardElement
                hideModal={() => setUpdateModal(false)}
                updateModal={updateModal}
                paymentId={payment?.[0]?.id}
              />
            </Elements>
          </div>
        </AppModal>
      )}
    </div>
  );
};

export default PaymentForm;
