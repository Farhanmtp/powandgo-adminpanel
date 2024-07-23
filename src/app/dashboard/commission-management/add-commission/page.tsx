import React from 'react';
import { getServerSession } from 'next-auth';
import options from '@/app/api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';
import AppPageHeader from '@/components/Base/AppPageHeader';
import AppBreadcrumb from '@/components/Base/AppBreadcrumb';
import AppPageTitle from '@/components/Base/AppPageTitle';
import { Metadata } from 'next';
import CommissionForm from '@/components/Forms/CommissionForm';

export const metadata: Metadata = {
  title: 'powandgo - Add Commission',
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
    href: '/dashboard/commission-management/manage-commission',
  },
  {
    title: 'Add Commission',
    isActive: true,
    href: '/dashboard/commission-management/add-commission',
  },
];

const AddCommission = async () => {
  const data = await getServerSession(options);

  if (data?.user.role !== 'admin') {
    redirect('/dashboard');
  }
  return (
    <div className="flex flex-col gap-[40px]">
      <AppPageHeader>
        <AppBreadcrumb breadcrumbs={breadcrumbs} />
      </AppPageHeader>
      <AppPageTitle title="Add Commission" />
      <CommissionForm />
    </div>
  );
};

export default AddCommission;
