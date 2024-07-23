import React from 'react';
import AppPageHeader from '@/components/Base/AppPageHeader';
import AppBreadcrumb from '@/components/Base/AppBreadcrumb';
import AppPageTitle from '@/components/Base/AppPageTitle';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import options from '@/app/api/auth/[...nextauth]/options';
import ManageVatTable from '@/components/ManageVAT/ManageVatTable';

export const metadata: Metadata = {
  title: 'Powandgo - Manage VAT',
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
    title: 'Manage VAT',
    isActive: true,
    href: '#',
  },
];

const ManageVAT = async () => {
  const data = await getServerSession(options);

  return (
    <div className="flex flex-col gap-[40px]">
      <AppPageHeader>
        <AppBreadcrumb breadcrumbs={breadcrumbs} />
      </AppPageHeader>
      <AppPageTitle title="Manage VAT" />
      <ManageVatTable />
    </div>
  );
};

export default ManageVAT;
