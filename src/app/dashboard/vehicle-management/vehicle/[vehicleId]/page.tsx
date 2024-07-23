import React, { FC } from 'react';
import AppBreadcrumb from '@/components/Base/AppBreadcrumb';
import AppPageHeader from '@/components/Base/AppPageHeader';
import AppPageTitle from '@/components/Base/AppPageTitle';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import options from '@/app/api/auth/[...nextauth]/options';
import { checkProfileComplete } from '@/utils/profile';
import ProfileIncomplete from '@/components/Dashboard/ProfileIncomplete';
import EditVehicleData from '@/components/EditVehicle/EditVehicle';

export const metadata: Metadata = {
  title: 'powandgo - Vehicle',
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
    title: 'Vehicle',
    isActive: true,
    href: '#',
  },
];

interface VehicleProps {
  params: { vehicleId: string };
}

const Vehicle: FC<VehicleProps> = async ({ params }) => {
  const data = await getServerSession(options);

  let { isProfileComplete, missingAccountInfo } = checkProfileComplete({
    user: data?.user.detail,
    toCheck: ['account_info', 'bank'],
  });

  return (
    <div className="flex flex-col gap-[40px]">
      <AppPageHeader>
        <AppBreadcrumb breadcrumbs={breadcrumbs} />
      </AppPageHeader>
      <AppPageTitle title="Vehicle" />

      {isProfileComplete ? (
        <EditVehicleData
          vehicleId={Number(params.vehicleId)}
          user={data?.user}
        />
      ) : (
        <ProfileIncomplete
          missingAccountInfo={missingAccountInfo}
          missingList={['Company Info', 'Payment Method']}
        />
      )}
    </div>
  );
};

export default Vehicle;
