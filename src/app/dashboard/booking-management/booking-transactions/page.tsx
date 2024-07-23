import React from 'react';
import { Metadata } from 'next';
import AppPageHeader from '@/components/Base/AppPageHeader';
import AppBreadcrumb from '@/components/Base/AppBreadcrumb';
import AppPageTitle from '@/components/Base/AppPageTitle';
import TransactionsTable from '@/components/BookingTransactions/TransactionsTable';
import { getServerSession } from 'next-auth';
import options from '@/app/api/auth/[...nextauth]/options';

export const metadata: Metadata = {
  title: 'powandgo - Booking Transactions',
};

const breadcrumbs = [
  {
    title: 'Home',
    isActive: false,
    href: '/dashboard',
  },
  {
    title: 'Booking Management',
    isActive: false,
    href: '#',
  },
  {
    title: 'Booking Transactions',
    isActive: true,
    href: '/dashboard/booking-management/booking-transactions',
  },
];

const BookingTransactions = async () => {
  const data = await getServerSession(options);

  return (
    <div className="flex flex-col gap-[40px]">
      <AppPageHeader>
        <AppBreadcrumb breadcrumbs={breadcrumbs} />
      </AppPageHeader>
      <AppPageTitle title="Booking Transactions" />
      <TransactionsTable user={data?.user} />
    </div>
  );
};

export default BookingTransactions;
