import React from 'react';
import { getServerSession } from 'next-auth';
import options from '@/app/api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';
import AppPageTitle from '@/components/Base/AppPageTitle';
import AppBreadcrumb from '@/components/Base/AppBreadcrumb';
import AppPageHeader from '@/components/Base/AppPageHeader';
import BookingConfig from '@/components/BookingConfig/BookingConfig';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'powandgo - Booking Configuration',
  description: 'Launching Soon',
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
    href: '/dashboard/booking-management',
  },
  {
    title: 'Booking Configuration',
    isActive: true,
    href: '/dashboard/booking-management/booking-configuration',
  },
];

const BookingConfiguration = async () => {
  const data = await getServerSession(options);

  if (data?.user.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col gap-[40px]">
      <AppPageHeader>
        <AppBreadcrumb breadcrumbs={breadcrumbs} />
      </AppPageHeader>
      <AppPageTitle title="Booking Configuration" />
      <BookingConfig />
    </div>
  );
};

export default BookingConfiguration;
