import React from 'react';
import { Metadata } from 'next';
import AppPageHeader from '@/components/Base/AppPageHeader';
import AppBreadcrumb from '@/components/Base/AppBreadcrumb';
import AppPageTitle from '@/components/Base/AppPageTitle';
import { getServerSession } from 'next-auth';
import options from '@/app/api/auth/[...nextauth]/options';
import BookingTable from '@/components/ManageBookings/BookingTable';

export const metadata: Metadata = {
  title: 'powandgo - Manage Bookings',
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
    title: 'Manage Bookings',
    isActive: true,
    href: '/dashboard/booking-management/manage-bookings',
  },
];

const ManageBookings = async () => {
  const data = await getServerSession(options);

  return (
    <div className="flex flex-col gap-[40px]">
      <AppPageHeader>
        <AppBreadcrumb breadcrumbs={breadcrumbs} />
      </AppPageHeader>
      <AppPageTitle title="Manage Bookings" />
      <BookingTable user={data?.user} />
    </div>
  );
};

export default ManageBookings;
