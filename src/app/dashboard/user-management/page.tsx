import React from 'react';
import { getServerSession } from 'next-auth';
import options from '@/app/api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';
import AppPageTitle from '@/components/Base/AppPageTitle';
import UserTable from '@/components/UserManagement/UserTable';
import AppBreadcrumb from '@/components/Base/AppBreadcrumb';
import AppPageHeader from '@/components/Base/AppPageHeader';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'powandgo - Manage Users',
};

const breadcrumbs = [
  {
    title: 'Home',
    isActive: false,
    href: '/dashboard',
  },
  {
    title: 'User Management',
    isActive: true,
    href: '/dashboard/user-management',
  },
];

const UserManagement = async () => {
  const data = await getServerSession(options);

  if (data?.user.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col gap-[40px]">
      <AppPageHeader>
        <AppBreadcrumb breadcrumbs={breadcrumbs} />
      </AppPageHeader>
      <AppPageTitle title="User Management" />
      <UserTable />
    </div>
  );
};

export default UserManagement;
