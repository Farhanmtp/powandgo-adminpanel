import React, { FC } from 'react';
import AppBreadcrumb from '@/components/Base/AppBreadcrumb';
import AppPageHeader from '@/components/Base/AppPageHeader';
import AppPageTitle from '@/components/Base/AppPageTitle';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import options from '@/app/api/auth/[...nextauth]/options';
import PlugTypeForm from '@/components/Forms/PlugTypeForm';
import EditPlugType from '@/components/setupManagement/plugType/EditPlugType';

export const metadata: Metadata = {
  title: 'powandgo - Edit Plug Type',
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
    title: 'Manage Plug Type',
    isActive: false,
    href: '/dashboard/setup/plug-type',
  },
  {
    title: 'Edit Plug Type',
    isActive: true,
    href: '#',
  },
];

interface EditPlugTypeProps {
  params: { plugId: string };
}

const AddPlugType: FC<EditPlugTypeProps> = async ({ params }) => {
  const data = await getServerSession(options);

  return (
    <div className="flex flex-col gap-[40px]">
      <AppPageHeader>
        <AppBreadcrumb breadcrumbs={breadcrumbs} />
      </AppPageHeader>
      <AppPageTitle title="Edit Plug Type" />
      {}
      <EditPlugType user={data?.user} plugId={Number(params.plugId)} />
    </div>
  );
};

export default AddPlugType;
