import React from 'react';
import AppBreadcrumb from '@/components/Base/AppBreadcrumb';
import AppPageHeader from '@/components/Base/AppPageHeader';
import AppPageTitle from '@/components/Base/AppPageTitle';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import options from '@/app/api/auth/[...nextauth]/options';
import { checkProfileComplete } from '@/utils/profile';
import ProfileIncomplete from '@/components/Dashboard/ProfileIncomplete';
import { redirect } from 'next/navigation';
import VehicleForm from '@/components/Forms/VehicleForm';

export const metadata: Metadata = {
  title: 'powandgo - Add Vehicle',
  description: 'Launching Soon',
};

const breadcrumbs = [
  {
    title: 'Home',
    isActive: false,
    href: '/dashboard',
  },
  {
    title: 'Vehicle Management',
    isActive: false,
    href: '/dashboard/vehicle-management/manage-vehicles',
  },
  {
    title: 'Add Vehicle',
    isActive: true,
    href: '/dashboard/vehicle-management/add-vehicles',
  },
];

const AddVehicle = async () => {
  const data = await getServerSession(options);

  let { isProfileComplete, missingAccountInfo } = checkProfileComplete({
    user: data?.user.detail,
    toCheck: ['account_info', 'payment'],
  });

  if (data?.user.role === 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col gap-[40px]">
      <AppPageHeader>
        <AppBreadcrumb breadcrumbs={breadcrumbs} />
      </AppPageHeader>
      <AppPageTitle title="Add Vehicle" />

      {isProfileComplete ? (
        <VehicleForm />
      ) : (
        <ProfileIncomplete
          missingAccountInfo={missingAccountInfo}
          missingList={['Company Info', 'Payment Method']}
        />
      )}
    </div>
  );
};

export default AddVehicle;
