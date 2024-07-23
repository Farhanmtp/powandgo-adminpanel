import React, { FC } from 'react';
import AppBreadcrumb from '@/components/Base/AppBreadcrumb';
import AppPageHeader from '@/components/Base/AppPageHeader';
import AppPageTitle from '@/components/Base/AppPageTitle';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import options from '@/app/api/auth/[...nextauth]/options';
import { checkProfileComplete } from '@/utils/profile';
import ProfileIncomplete from '@/components/Dashboard/ProfileIncomplete';
import EditEvcData from '@/components/EditEvc/EditVehicle';

export const metadata: Metadata = {
  title: 'powandgo - Edit EVC',
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
    title: 'Edit Vehicle',
    isActive: true,
    href: '/dashboard/evc-management/edit-evc',
  },
];

interface EditEvcProps {
  params: { evcId: string };
}

const EditEvc: FC<EditEvcProps> = async ({ params }) => {
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
      <AppPageTitle title="Edit EVC" />

      {isProfileComplete ? (
        <EditEvcData evcId={Number(params.evcId)} />
      ) : (
        <ProfileIncomplete
          missingList={['Company Info', 'Bank Account']}
          missingAccountInfo={missingAccountInfo}
        />
      )}
    </div>
  );
};

export default EditEvc;
