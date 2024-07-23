import React from 'react';
import AppPageTitle from '@/components/Base/AppPageTitle';
import AppBreadcrumb from '@/components/Base/AppBreadcrumb';
import AppPageHeader from '@/components/Base/AppPageHeader';
import VehiclesTable from '@/components/ManageVehicles/VehiclesTable';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import options from '@/app/api/auth/[...nextauth]/options';
import { checkProfileComplete } from '@/utils/profile';
import ProfileIncomplete from '@/components/Dashboard/ProfileIncomplete';
import { getAllGarage, getUserGarage } from '@/services/garage';

export const metadata: Metadata = {
  title: 'powandgo - Manage Vehicles',
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
    title: 'Manage Vehicles',
    isActive: true,
    href: '/dashboard/vehicle-management/manage-vehicles',
  },
];

const ManageVehicles = async () => {
  const data = await getServerSession(options);

  let { isProfileComplete, missingAccountInfo } = checkProfileComplete({
    user: data?.user.detail,
    toCheck: ['account_info', 'payment'],
  });

  return (
    <div className="flex flex-col gap-[40px]">
      <AppPageHeader>
        <AppBreadcrumb breadcrumbs={breadcrumbs} />
      </AppPageHeader>
      <AppPageTitle title="Manage Vehicles" />
      {isProfileComplete ? (
        <VehiclesTable user={data?.user} />
      ) : (
        <ProfileIncomplete
          missingAccountInfo={missingAccountInfo}
          missingList={['Company Info', 'Payment Method']}
        />
      )}
    </div>
  );
};

export default ManageVehicles;
