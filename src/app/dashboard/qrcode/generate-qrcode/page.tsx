import React from 'react';
import GenerateQR from '@/components/GenerateQR/GenerateQR';
import { getServerSession } from 'next-auth';
import options from '@/app/api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';
import AppPageHeader from '@/components/Base/AppPageHeader';
import AppBreadcrumb from '@/components/Base/AppBreadcrumb';
import AppPageTitle from '@/components/Base/AppPageTitle';

const breadcrumbs = [
  {
    title: 'Home',
    isActive: false,
    href: '/dashboard',
  },
  {
    title: 'QR Code',
    isActive: false,
    href: '#',
  },
  {
    title: 'Generate QR Code',
    isActive: true,
    href: '/dashboard/qrcode/generate-qrcode',
  },
];

const QRCode = async () => {
  const data = await getServerSession(options);

  if (data?.user.role !== 'admin') {
    redirect('/dashboard');
  }
  return (
    <div className="flex flex-col gap-[40px]">
      <AppPageHeader>
        <AppBreadcrumb breadcrumbs={breadcrumbs} />
      </AppPageHeader>
      <AppPageTitle title="Generate QR Code" />
      <GenerateQR />
    </div>
  );
};

export default QRCode;
