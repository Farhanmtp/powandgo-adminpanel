import React from 'react';
import AppPageHeader from '@/components/Base/AppPageHeader';
import AppBreadcrumb from '@/components/Base/AppBreadcrumb';
import AppPageTitle from '@/components/Base/AppPageTitle';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import options from '@/app/api/auth/[...nextauth]/options';
import VATForm from '@/components/Forms/VATForm';

export const metadata: Metadata = {
  title: 'Powandgo - Add VAT',
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
    isActive: false,
    href: '/dashboard/setup/vat/manage-vat',
  },
  {
    title: 'Add VAT',
    isActive: true,
    href: '#',
  },
];

const AddVat = async () => {
  const data = await getServerSession(options);

  return (
    <div className="flex flex-col gap-[40px]">
      <AppPageHeader>
        <AppBreadcrumb breadcrumbs={breadcrumbs} />
      </AppPageHeader>
      <AppPageTitle title="Add VAT" />
      <VATForm />
    </div>
  );
};

export default AddVat;
