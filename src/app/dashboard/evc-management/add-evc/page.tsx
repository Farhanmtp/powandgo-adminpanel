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
import EvcForm from '@/components/Forms/EvcForm';

export const metadata: Metadata = {
  title: 'powandgo - Add EVC',
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
    title: 'Add EVC',
    isActive: true,
    href: '/dashboard/evc-management/add-evc',
  },
];

const AddEvc = async () => {
  const data = await getServerSession(options);

  let { isProfileComplete, missingAccountInfo } = checkProfileComplete({
    user: data?.user.detail,
    toCheck: ['account_info', 'bank'],
  });

  if (data?.user.role === 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col gap-[40px]">
      <AppPageHeader>
        <AppBreadcrumb breadcrumbs={breadcrumbs} />
      </AppPageHeader>
      <AppPageTitle title="Add EVC" />

      {isProfileComplete ? (
        <EvcForm />
      ) : (
        <ProfileIncomplete
          missingList={['Company Info', 'Bank Account']}
          missingAccountInfo={missingAccountInfo}
        />
      )}
    </div>
  );
};

export default AddEvc;
