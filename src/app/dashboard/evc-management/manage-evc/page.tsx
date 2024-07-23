import React from 'react';
import AppBreadcrumb from '@/components/Base/AppBreadcrumb';
import AppPageHeader from '@/components/Base/AppPageHeader';
import AppPageTitle from '@/components/Base/AppPageTitle';
import ManageEvcTable from '@/components/ManageEvc/ManageEvcTable';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import options from '@/app/api/auth/[...nextauth]/options';
import { checkProfileComplete } from '@/utils/profile';
import ProfileIncomplete from '@/components/Dashboard/ProfileIncomplete';

export const metadata: Metadata = {
  title: 'powandgo - Manage EVC',
  description: 'Launching Soon',
};

const breadcrumbs = [
  {
    title: 'Home',
    isActive: false,
    href: '/dashboard',
  },
  {
    title: 'EVC Management',
    isActive: false,
    href: '/dashboard/evc-management/manage-evc',
  },
  {
    title: 'Manage EVC',
    isActive: true,
    href: '/dashboard/evc-management/manage-evc',
  },
];

const ManageEvc = async () => {
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
      <AppPageTitle title="Manage EVC" />
      {isProfileComplete ? (
        <ManageEvcTable
          isProfileComplete={isProfileComplete}
          user={data?.user}
        />
      ) : (
        <ProfileIncomplete
          missingList={['Company Info', 'Bank Account']}
          missingAccountInfo={missingAccountInfo}
        />
      )}
    </div>
  );
};

export default ManageEvc;
