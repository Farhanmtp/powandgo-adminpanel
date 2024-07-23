import React from 'react';
import AppPageHeader from '@/components/Base/AppPageHeader';
import AppBreadcrumb from '@/components/Base/AppBreadcrumb';
import AppPageTitle from '@/components/Base/AppPageTitle';
import { Metadata } from 'next';
import SetupVehicleInfoForm from '@/components/Forms/SetupVehicleInfoForm';

export const metadata: Metadata = {
  title: 'Powandgo - Add Vehicle Info',
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
    title: 'Add Vehicle Info',
    isActive: true,
    href: '#',
  },
];

const AddVehicleInfo = () => {
  return (
    <div className="flex flex-col gap-[40px]">
      <AppPageHeader>
        <AppBreadcrumb breadcrumbs={breadcrumbs} />
      </AppPageHeader>
      <AppPageTitle title="Add Vehicle Info" />
      <SetupVehicleInfoForm />
    </div>
  );
};

export default AddVehicleInfo;
