import React, { FC } from 'react';
import AppPageHeader from '@/components/Base/AppPageHeader';
import AppBreadcrumb from '@/components/Base/AppBreadcrumb';
import AppPageTitle from '@/components/Base/AppPageTitle';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import options from '@/app/api/auth/[...nextauth]/options';
import VATForm from '@/components/Forms/VATForm';

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
    href: '/dashboard/setup/vat/manage-vat',
  },
  {
    title: 'Edit VAT',
    isActive: true,
    href: '#',
  },
];

interface EditVATProps {
  params: { vatId: string };
}

const EditVAT: FC<EditVATProps> = async ({ params }) => {
  const data = await getServerSession(options);

  return (
    <div className="flex flex-col gap-[40px]">
      <AppPageHeader>
        <AppBreadcrumb breadcrumbs={breadcrumbs} />
      </AppPageHeader>
      <AppPageTitle title="Edit VAT" />
      <VATForm vatId={+params.vatId} />
    </div>
  );
};

export default EditVAT;
