import React from 'react';
import DashboardCard from './DashboardCard';
import { getServerSession } from 'next-auth';
import options from '@/app/api/auth/[...nextauth]/options';
import AppPageHeader from '../Base/AppPageHeader';

let dashboardCards = [
  {
    title: 'Plug Type',
    icon: 'plugpower.svg',
    href: 'setup/plug-type',
    access: ['admin'],
  },
  {
    title: 'Vehicle Info',
    icon: 'vehiclemodel.svg',
    href: 'setup/manage-vehicle-info',
    access: ['admin'],
  },
  {
    title: 'VAT',
    icon: 'commission.svg',
    href: 'setup/vat/manage-vat',
    access: ['admin'],
  },
];

const SetupOverview: React.FC = async () => {
  const data = await getServerSession(options);
  let role = data?.user.role;

  return (
    <div className="flex flex-col gap-[37px]">
      <AppPageHeader>
        <h1 className="text-xl md:text-2xl font-normal leading-[normal] capitalize">
          Setup
        </h1>
      </AppPageHeader>
      <div className="flex flex-row flex-wrap gap-[40px] justify-center md:justify-start w-full">
        {dashboardCards
          .filter((card) => {
            if (role === 'user') {
              return card.access.includes('user');
            }

            if (role === 'admin') {
              return card.access.includes('admin');
            }

            return false;
          })
          .map((card, i) => {
            return (
              <div key={i}>
                <DashboardCard
                  title={card.title}
                  icon={card.icon}
                  href={card.href}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default SetupOverview;
