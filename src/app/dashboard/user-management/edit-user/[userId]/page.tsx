import React, { FC } from 'react';
import AppBreadcrumb from '@/components/Base/AppBreadcrumb';
import AppPageHeader from '@/components/Base/AppPageHeader';
import AppPageTitle from '@/components/Base/AppPageTitle';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import options from '@/app/api/auth/[...nextauth]/options';
import EditUserData from '@/components/EditUser/EditUser';

export const metadata: Metadata = {
  title: 'powandgo - Edit User',
};

const breadcrumbs = [
  {
    title: 'Home',
    isActive: false,
    href: '/dashboard',
  },
  {
    title: 'User Management',
    isActive: false,
    href: '/dashboard/user-management',
  },
  {
    title: 'Edit User',
    isActive: true,
    href: '#',
  },
];

interface EditUserProps {
  params: { userId: string };
}

const EditUser: FC<EditUserProps> = async ({ params }) => {
  const data = await getServerSession(options);

  return (
    <div className="flex flex-col gap-[40px]">
      <AppPageHeader>
        <AppBreadcrumb breadcrumbs={breadcrumbs} />
      </AppPageHeader>
      <AppPageTitle title="Edit User" />

      <EditUserData userId={Number(params.userId)} />
    </div>
  );
};

export default EditUser;
