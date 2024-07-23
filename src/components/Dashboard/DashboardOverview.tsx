import React from 'react';
import DashboardCard from './DashboardCard';
import { getServerSession } from 'next-auth';
import options from '@/app/api/auth/[...nextauth]/options';
import AppPageHeader from '../Base/AppPageHeader';

let dashboardCards = [
  {
    title: 'User Management',
    icon: 'user.svg',
    href: 'dashboard/user-management',
    access: ['admin'],
  },
  {
    title: 'EVC Management',
    icon: 'evc.svg',
    href: 'dashboard/evc-management/manage-evc',
    access: ['admin', 'user'],
  },
  {
    title: 'Vehicle Management',
    icon: 'vehicle.svg',
    href: 'dashboard/vehicle-management/manage-vehicles',
    access: ['admin', 'user'],
  },
  {
    title: 'Booking Management',
    icon: 'booking.svg',
    href: 'dashboard/booking-management',
    access: ['admin', 'user'],
  },
  {
    title: 'Commission Management',
    icon: 'commission.svg',
    href: 'dashboard/commission-management/manage-commission',
    access: ['admin'],
  },
  {
    title: 'Account Settings',
    icon: 'account.svg',
    href: 'dashboard/account-settings',
    access: [''],
  },
  {
    title: 'Setup',
    icon: 'setup.svg',
    href: 'dashboard/setup',
    access: ['admin'],
  },
];

const DashboardOverview: React.FC = async () => {
  const data = await getServerSession(options);
  let role = data?.user.role;

  return (
    <div className="flex flex-col gap-[37px]">
      <AppPageHeader>
        <h1 className="text-xl md:text-2xl font-normal leading-[normal] capitalize">
          Welcome {data?.user.name}
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

export default DashboardOverview;
