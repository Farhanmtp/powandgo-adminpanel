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
import PlugTypeForm from '@/components/Forms/PlugTypeForm';

export const metadata: Metadata = {
  title: 'powandgo - Add Plug Type',
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
    title: 'Manage Plug Type',
    isActive: false,
    href: '/dashboard/setup/plug-type',
  },
  {
    title: 'Add Plug Type',
    isActive: true,
    href: '#',
  },
];

const AddPlugType = async () => {
  const data = await getServerSession(options);

  return (
    <div className="flex flex-col gap-[40px]">
      <AppPageHeader>
        <AppBreadcrumb breadcrumbs={breadcrumbs} />
      </AppPageHeader>
      <AppPageTitle title="Add Plug Type" />
      <PlugTypeForm />
    </div>
  );
};

export default AddPlugType;
