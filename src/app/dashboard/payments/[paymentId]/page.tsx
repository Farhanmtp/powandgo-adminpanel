import React, { FC } from 'react';
import AppBreadcrumb from '@/components/Base/AppBreadcrumb';
import AppPageHeader from '@/components/Base/AppPageHeader';
import AppPageTitle from '@/components/Base/AppPageTitle';
import { Metadata } from 'next';
import ProviderPaymentDetail from '@/components/PaymentDetail/ProviderPaymentDetail';

export const metadata: Metadata = {
  title: 'powandgo - Payment Detail',
};

const breadcrumbs = [
  {
    title: 'Home',
    isActive: false,
    href: '/dashboard',
  },
  {
    title: 'Payments',
    isActive: true,
    href: '/dashboard/payments/manage-payments',
  },
  {
    title: 'Payment Detail',
    isActive: true,
    href: '#',
  },
];

interface PaymentDetailProps {
  params: { paymentId: string };
}

const PaymentDetail: FC<PaymentDetailProps> = async ({ params }) => {
  return (
    <div className="flex flex-col gap-[40px]">
      <AppPageHeader>
        <AppBreadcrumb breadcrumbs={breadcrumbs} />
      </AppPageHeader>
      <AppPageTitle title="Payment Detail" />
      <ProviderPaymentDetail paymentId={Number(params.paymentId)} />
    </div>
  );
};

export default PaymentDetail;
