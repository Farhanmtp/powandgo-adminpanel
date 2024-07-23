import React from 'react';
import AppBreadcrumb from '@/components/Base/AppBreadcrumb';
import AppPageHeader from '@/components/Base/AppPageHeader';
import AppPageTitle from '@/components/Base/AppPageTitle';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import options from '@/app/api/auth/[...nextauth]/options';
import { checkProfileComplete } from '@/utils/profile';
import ManagePlugTypeTable from '@/components/setupManagement/plugType/ManagePlugTypeTable';
export const metadata: Metadata = {
  title: 'Powandgo - Setup Plug Type',
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
    isActive: true,
    href: '/dashboard/setup/plug-type',
  },
];

const PlugType = async () => {
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
      <AppPageTitle title="Manage Plug Type" />

      <ManagePlugTypeTable
        isProfileComplete={isProfileComplete}
        user={data?.user}
      />
    </div>
  );
};

export default PlugType;
