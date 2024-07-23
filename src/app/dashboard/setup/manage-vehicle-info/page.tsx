import React from 'react';
import AppPageHeader from '@/components/Base/AppPageHeader';
import AppBreadcrumb from '@/components/Base/AppBreadcrumb';
import AppPageTitle from '@/components/Base/AppPageTitle';
import { Metadata } from 'next';
import VehicleInfoTable from '@/components/ManageVehicleInfo/VehicleInfoTable';
import { getServerSession } from 'next-auth';
import options from '@/app/api/auth/[...nextauth]/options';

export const metadata: Metadata = {
  title: 'Powandgo - Manage Vehicle Info',
};

const breadcrumbs = [
  {
    title: 'Home',
    isActive: false,
    href: '/dashboard',
  },
  {
    title: 'Setup',
    isActive: false,
    href: '/dashboard/setup',
  },
  {
    title: 'Manage Vehicle Info',
    isActive: true,
    href: '#',
  },
];

const ManageVehicleInfo = async () => {
  const data = await getServerSession(options);

  return (
    <div className="flex flex-col gap-[40px]">
      <AppPageHeader>
        <AppBreadcrumb breadcrumbs={breadcrumbs} />
      </AppPageHeader>
      <AppPageTitle title="Manage Vehicle Info" />
      <VehicleInfoTable user={data?.user} />
    </div>
  );
};

export default ManageVehicleInfo;
