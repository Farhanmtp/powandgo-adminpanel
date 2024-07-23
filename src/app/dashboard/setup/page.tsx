import SetupOverview from '@/components/Dashboard/SetupOverview';
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Powandgo - Setup',
};

const Setup = () => {
  return (
    <div>
      <SetupOverview />
    </div>
  );
};

export default Setup;
