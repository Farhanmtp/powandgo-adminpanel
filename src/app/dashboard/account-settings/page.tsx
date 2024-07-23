import React from 'react';
import { getServerSession } from 'next-auth';
import options from '@/app/api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';

const AccountSettings = async () => {
  const data = await getServerSession(options);

  if (data?.user.role !== 'admin') {
    redirect('/dashboard');
  }

  return <div>page</div>;
};

export default AccountSettings;
