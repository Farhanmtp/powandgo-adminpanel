import React from 'react';
import AppBreadcrumb from '@/components/Base/AppBreadcrumb';
import AppPageHeader from '@/components/Base/AppPageHeader';
import AppPageTitle from '@/components/Base/AppPageTitle';
import { Metadata } from 'next';
import PaymentTable from '@/components/Payments/PaymentTable';
import { getServerSession } from 'next-auth';
import options from '@/app/api/auth/[...nextauth]/options';

export const metadata: Metadata = {
  title: 'powandgo - Manage Payments',
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
];

const ManagePayments = async () => {
  const data = await getServerSession(options);

  return (
    <div className="flex flex-col gap-[40px]">
      <AppPageHeader>
        <AppBreadcrumb breadcrumbs={breadcrumbs} />
      </AppPageHeader>
      <AppPageTitle title="Payments" />
      <PaymentTable user={data?.user} />
    </div>
  );
};

export default ManagePayments;
