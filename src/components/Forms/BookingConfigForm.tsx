'use client';

import React, { FC, useEffect } from 'react';
import AppButton from '../Base/AppButton';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AppInputField from '../Base/AppInputField';
import { postBookingConfig } from '@/services/bookingconfig';
import { useAppDispatch } from '@/redux/hooks';
import { showNotification } from '@/redux/slices/commonSlice';
import { startLoading, stopLoading } from '@/redux/slices/commonSlice';

interface BookingConfigFormProps {
  bookingConfig: any;
}

const validationSchema = Yup.object().shape({
  bookingConfig: Yup.object().shape({
    rules: Yup.array()
      .of(
        Yup.object().shape({
          cancelTime: Yup.number().required('Cancellation time is required'),
          cancelFee: Yup.number()
            .required('Cancellation fee is required')
            .max(100, 'Cancellation fee cannot be greater than 100%'),
        })
      )
      .required('Booking rules are required'),
    delayTime: Yup.number().required('Delay time is required'),
  }),
  reservationConfig: Yup.object().shape({
    rules: Yup.array()
      .of(
        Yup.object().shape({
          cancelTime: Yup.number().required('Cancellation time is required'),
          cancelFee: Yup.number()
            .required('Cancellation fee is required')
            .max(100, 'Cancellation fee cannot be greater than 100%'),
        })
      )
      .required('Reservation rules are required'),
    delayTime: Yup.number().required('Delay time is required'),
  }),
});

const BookingConfigForm: FC<BookingConfigFormProps> = ({ bookingConfig }) => {
  const dispatch = useAppDispatch();

  let initalValues = {
    bookingConfig: {
      bookingId: 1,
      rules: [
        {
          ruleId: 1,
          cancelTime: '',
          cancelFee: '',
        },
        {
          ruleId: 2,
          cancelTime: '',
          cancelFee: '',
        },
      ],
      delayTime: '',
    },
    reservationConfig: {
      bookingId: 2,
      rules: [
        {
          ruleId: 3,
          cancelTime: '',
          cancelFee: '',
        },
        {
          ruleId: 4,
          cancelTime: '',
          cancelFee: '',
        },
      ],
      delayTime: '',
    },
  };

  const formik = useFormik({
    initialValues: initalValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(startLoading());
      dispatch(postBookingConfig(values))
        .then(() => {
          dispatch(
            showNotification({
              type: 'successful',
              message: 'Booking Configurations Saved',
            })
          );
        })
        .catch(() => {
          dispatch(
            showNotification({
              type: 'error',
              message: 'Failed to Update Booking Configurations',
            })
          );
        })
        .finally(() => {
          dispatch(stopLoading());
        });
    },
  });

  useEffect(() => {
    if (bookingConfig?.length) {
      formik.setValues({
        bookingConfig: {
          bookingId: 1,
          rules: [
            {
              ruleId: 1,
              cancelTime: bookingConfig[0].rule[0].cancelTime,
              cancelFee: bookingConfig[0].rule[0].cancelFee,
            },
            {
              ruleId: 2,
              cancelTime: bookingConfig[0].rule[1].cancelTime,
              cancelFee: bookingConfig[0].rule[1].cancelFee,
            },
          ],
          delayTime: bookingConfig[0].delayTime,
        },
        reservationConfig: {
          bookingId: 2,
          rules: [
            {
              ruleId: 3,
              cancelTime: bookingConfig[1].rule[0].cancelTime,
              cancelFee: bookingConfig[1].rule[0].cancelFee,
            },
            {
              ruleId: 4,
              cancelTime: bookingConfig[1].rule[1].cancelTime,
              cancelFee: bookingConfig[1].rule[1].cancelFee,
            },
          ],
          delayTime: bookingConfig[1].delayTime,
        },
      });
    }
  }, [bookingConfig]);

  let subtitle = 'text-[21px] mb-4';

  let formRow = 'flex flex-row flex-wrap gap-10';

  let sectionChild = 'flex flex-col gap-[5px] flex-wrap';

  return (
    <div className="flex flex-col gap-[40px]">
      {/* Booking */}
      <div className="flex flex-col gap-[15px]">
        <h2 className={subtitle}>Booking Configuration</h2>
        <div className={sectionChild}>
          <h3 className="text-[18px]">Rule #1</h3>
          <div className={formRow}>
            <AppInputField
              title="Cancellation Time *"
              value={formik.values.bookingConfig.rules[0].cancelTime}
              inputHandler={formik.handleChange}
              inputProps={{
                name: 'bookingConfig.rules[0].cancelTime',
                type: 'number',
              }}
              error={
                formik.touched?.bookingConfig?.rules?.[0].cancelTime &&
                (formik.errors.bookingConfig as any)?.rules?.[0]?.cancelTime
                  ? String(
                      (formik.errors.bookingConfig as any)?.rules?.[0]
                        ?.cancelTime
                    )
                  : ''
              }
              className="!w-[220px]"
              endingText="minutes"
            />

            <AppInputField
              title="Cancellation Fee *"
              value={formik.values.bookingConfig.rules[0].cancelFee}
              inputHandler={formik.handleChange}
              inputProps={{
                name: 'bookingConfig.rules[0].cancelFee',
                type: 'number',
                min: '0',
                max: '100',
              }}
              error={
                formik.touched?.bookingConfig?.rules?.[0].cancelFee &&
                (formik.errors.bookingConfig as any)?.rules?.[0]?.cancelFee
                  ? String(
                      (formik.errors.bookingConfig as any)?.rules?.[0]
                        ?.cancelFee
                    )
                  : ''
              }
              className="!w-[220px]"
              endingText="%"
            />
          </div>
        </div>

        <div className={sectionChild}>
          <h3 className="text-[18px]">Rule #2</h3>
          <div className={formRow}>
            <AppInputField
              title="Cancellation Time *"
              value={formik.values.bookingConfig.rules[1].cancelTime}
              inputHandler={formik.handleChange}
              inputProps={{
                name: 'bookingConfig.rules[1].cancelTime',
                type: 'number',
              }}
              error={
                formik.touched?.bookingConfig?.rules?.[1].cancelTime &&
                (formik.errors.bookingConfig as any)?.rules?.[1]?.cancelTime
                  ? String(
                      (formik.errors.bookingConfig as any)?.rules?.[1]
                        ?.cancelTime
                    )
                  : ''
              }
              className="!w-[220px]"
              endingText="minutes"
            />

            <AppInputField
              title="Cancellation Fee *"
              value={formik.values.bookingConfig.rules[1].cancelFee}
              inputHandler={formik.handleChange}
              inputProps={{
                name: 'bookingConfig.rules[1].cancelFee',
                type: 'number',
                min: '0',
                max: '100',
              }}
              error={
                formik.touched?.bookingConfig?.rules?.[1].cancelFee &&
                (formik.errors.bookingConfig as any)?.rules?.[1]?.cancelFee
                  ? String(
                      (formik.errors.bookingConfig as any)?.rules?.[1]
                        ?.cancelFee
                    )
                  : ''
              }
              className="!w-[220px]"
              endingText="%"
            />
          </div>
        </div>

        <div className={sectionChild}>
          <h3 className="text-[18px]">Configure Delay Time for Bookings</h3>
          <div className={formRow}>
            <AppInputField
              title="Delay Time *"
              value={formik.values.bookingConfig.delayTime}
              inputHandler={formik.handleChange}
              inputProps={{
                name: 'bookingConfig.delayTime',
                type: 'number',
                min: '0',
                max: '100',
              }}
              error={
                formik.touched?.bookingConfig?.delayTime &&
                (formik.errors.bookingConfig as any)?.delayTime
                  ? String((formik.errors.bookingConfig as any)?.delayTime)
                  : ''
              }
              className="!w-[220px]"
              endingText="minutes"
            />
          </div>
        </div>
      </div>

      {/* Reservation */}
      <div className="flex flex-col gap-[15px]">
        <h2 className={subtitle}>Reservation Configuration</h2>
        <div className={sectionChild}>
          <h3 className="text-[18px]">Rule #1</h3>
          <div className={formRow}>
            <AppInputField
              title="Cancellation Time *"
              value={formik.values.reservationConfig.rules[0].cancelTime}
              inputHandler={formik.handleChange}
              inputProps={{
                name: 'reservationConfig.rules[0].cancelTime',
                type: 'number',
              }}
              error={
                formik.touched?.reservationConfig?.rules?.[0].cancelTime &&
                (formik.errors.reservationConfig as any)?.rules?.[0]?.cancelTime
                  ? String(
                      (formik.errors.reservationConfig as any)?.rules?.[0]
                        ?.cancelTime
                    )
                  : ''
              }
              className="!w-[220px]"
              endingText="minutes"
            />

            <AppInputField
              title="Cancellation Fee *"
              value={formik.values.reservationConfig.rules[0].cancelFee}
              inputHandler={formik.handleChange}
              inputProps={{
                name: 'reservationConfig.rules[0].cancelFee',
                type: 'number',
                min: '0',
                max: '100',
              }}
              error={
                formik.touched?.reservationConfig?.rules?.[0].cancelFee &&
                (formik.errors.reservationConfig as any)?.rules?.[0]?.cancelFee
                  ? String(
                      (formik.errors.reservationConfig as any)?.rules?.[0]
                        ?.cancelFee
                    )
                  : ''
              }
              className="!w-[220px]"
              endingText="%"
            />
          </div>
        </div>

        <div className={sectionChild}>
          <h3 className="text-[18px]">Rule #2</h3>
          <div className={formRow}>
            <AppInputField
              title="Cancellation Time *"
              value={formik.values.reservationConfig.rules[1].cancelTime}
              inputHandler={formik.handleChange}
              inputProps={{
                name: 'reservationConfig.rules[1].cancelTime',
                type: 'number',
              }}
              error={
                formik.touched?.reservationConfig?.rules?.[1].cancelTime &&
                (formik.errors.reservationConfig as any)?.rules?.[1]?.cancelTime
                  ? String(
                      (formik.errors.reservationConfig as any)?.rules?.[1]
                        ?.cancelTime
                    )
                  : ''
              }
              className="!w-[220px]"
              endingText="minutes"
            />

            <AppInputField
              title="Cancellation Fee *"
              value={formik.values.reservationConfig.rules[1].cancelFee}
              inputHandler={formik.handleChange}
              inputProps={{
                name: 'reservationConfig.rules[1].cancelFee',
                type: 'number',
                min: '0',
                max: '100',
              }}
              error={
                formik.touched?.reservationConfig?.rules?.[1].cancelFee &&
                (formik.errors.reservationConfig as any)?.rules?.[1]?.cancelFee
                  ? String(
                      (formik.errors.reservationConfig as any)?.rules?.[1]
                        ?.cancelFee
                    )
                  : ''
              }
              className="!w-[220px]"
              endingText="%"
            />
          </div>
        </div>

        <div className={sectionChild}>
          <h3 className="text-[18px]">Configure Delay Time for Reservation</h3>
          <div className={formRow}>
            <AppInputField
              title="Delay Time *"
              value={formik.values.reservationConfig.delayTime}
              inputHandler={formik.handleChange}
              inputProps={{
                name: 'reservationConfig.delayTime',
                type: 'number',
                min: '0',
                max: '100',
              }}
              error={
                formik.touched?.reservationConfig?.delayTime &&
                (formik.errors.reservationConfig as any)?.delayTime
                  ? String((formik.errors.reservationConfig as any)?.delayTime)
                  : ''
              }
              className="!w-[220px]"
              endingText="minutes"
            />
          </div>
        </div>
      </div>

      <AppButton
        onClick={formik.submitForm}
        primary
        className="h-[45px] py-[4px] px-[24px] max-w-fit"
      >
        <div className="flex flex-row gap-[10px] items-center">
          <p>Submit</p>
        </div>
      </AppButton>
    </div>
  );
};

export default BookingConfigForm;
