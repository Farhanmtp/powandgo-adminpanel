import React, { FC } from 'react';
import AppBreadcrumb from '@/components/Base/AppBreadcrumb';
import AppPageHeader from '@/components/Base/AppPageHeader';
import AppPageTitle from '@/components/Base/AppPageTitle';
import { Metadata } from 'next';
import SetupVehicleInfoForm from '@/components/Forms/SetupVehicleInfoForm';

export const metadata: Metadata = {
  title: 'Powandgo - Edit Vehicle Info',
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
    isActive: false,
    href: '/dashboard/setup/manage-vehicle-info',
  },
  {
    title: 'Edit Vehicle Info',
    isActive: true,
    href: '#',
  },
];
interface EditVehicleInfoProps {
  params: { vehicleInfoId: string };
}

const EditVehicleInfo: FC<EditVehicleInfoProps> = async ({ params }) => {
  return (
    <div className="flex flex-col gap-[40px]">
      <AppPageHeader>
        <AppBreadcrumb breadcrumbs={breadcrumbs} />
      </AppPageHeader>
      <AppPageTitle title="Edit Vehicle Info" />
      <SetupVehicleInfoForm vehicleInfoId={Number(params.vehicleInfoId)} />
    </div>
  );
};

export default EditVehicleInfo;
