import React from 'react';
import AppPageTitle from '@/components/Base/AppPageTitle';
import AppBreadcrumb from '@/components/Base/AppBreadcrumb';
import AppPageHeader from '@/components/Base/AppPageHeader';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import options from '@/app/api/auth/[...nextauth]/options';
import CommissionTable from '@/components/ManageCommission/CommissionTable';

export const metadata: Metadata = {
  title: 'powandgo - Manage Commission',
};

const breadcrumbs = [
  {
    title: 'Home',
    isActive: false,
    href: '/dashboard',
  },
  {
    title: 'Commission Management',
    isActive: false,
    href: '#',
  },
  {
    title: 'Manage Commission',
    isActive: true,
    href: '/dashboard/commission-management/manage-commission',
  },
];

const ManageCommission = async () => {
  const data = await getServerSession(options);

  return (
    <div className="flex flex-col gap-[40px]">
      <AppPageHeader>
        <AppBreadcrumb breadcrumbs={breadcrumbs} />
      </AppPageHeader>
      <AppPageTitle title="Manage Commission" />
      <CommissionTable user={data?.user} />
    </div>
  );
};

export default ManageCommission;
