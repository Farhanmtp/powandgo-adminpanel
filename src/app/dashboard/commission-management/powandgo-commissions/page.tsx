import options from '@/app/api/auth/[...nextauth]/options';
import AppBreadcrumb from '@/components/Base/AppBreadcrumb';
import AppPageHeader from '@/components/Base/AppPageHeader';
import AppPageTitle from '@/components/Base/AppPageTitle';
import ManageMyCommissionsTable from '@/components/MyCommissions.tsx/ManageMyCommissions';
import { getServerSession } from 'next-auth';
import React from 'react';

const breadcrumbs = [
  {
    title: 'Home',
    isActive: false,
    href: '/dashboard',
  },
  {
    title: 'Commissions',
    isActive: true,
    href: '/dashboard/commissions',
  },
];

const PowandgoCommissions = async () => {
  const data = await getServerSession(options);

  return (
    <div className="flex flex-col gap-[40px]">
      <AppPageHeader>
        <AppBreadcrumb breadcrumbs={breadcrumbs} />
      </AppPageHeader>
      <AppPageTitle title="Commissions" />
      <ManageMyCommissionsTable user={data?.user} />
    </div>
  );
};

export default PowandgoCommissions;
