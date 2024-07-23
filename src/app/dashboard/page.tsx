import React from 'react';
import DashboardOverview from '@/components/Dashboard/DashboardOverview';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'powandgo - Dashboard',
  description: 'Launching Soon',
};

const page = () => {
  return (
    <div>
      <DashboardOverview />
    </div>
  );
};

export default page;
