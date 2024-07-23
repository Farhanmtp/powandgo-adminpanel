import React, { FC } from 'react';
import { getServerSession } from 'next-auth';
import options from '@/app/api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';
import AppPageHeader from '@/components/Base/AppPageHeader';
import AppBreadcrumb from '@/components/Base/AppBreadcrumb';
import AppPageTitle from '@/components/Base/AppPageTitle';
import { Metadata } from 'next';
import CommissionForm from '@/components/Forms/CommissionForm';

export const metadata: Metadata = {
  title: 'powandgo - Edit Commission',
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
    title: 'Edit Commission',
    isActive: true,
    href: '#',
  },
];

interface AddCommissionProps {
  params: { commissionId: string };
}

const AddCommission: FC<AddCommissionProps> = async ({ params }) => {
  const data = await getServerSession(options);

  if (data?.user.role !== 'admin') {
    redirect('/dashboard');
  }
  return (
    <div className="flex flex-col gap-[40px]">
      <AppPageHeader>
        <AppBreadcrumb breadcrumbs={breadcrumbs} />
      </AppPageHeader>
      <AppPageTitle title="Edit Commission" />
      <CommissionForm commissionId={Number(params.commissionId)} />
    </div>
  );
};

export default AddCommission;
