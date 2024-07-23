'use client';

import React, { FC } from 'react';
import AppMenuItem from './AppMenuItem';
import useWindowSize from '@/hooks/useWindowSize';
import { useState } from 'react';
import AppImage from './AppImage';
import DashboardPopup from '../DashboardPopup/DashboardPopup';

interface AppSidebarProps {
  role: string;
  userId: number;
}

const AppSidebar: FC<AppSidebarProps> = ({ role, userId }) => {
  const { width } = useWindowSize();

  let isMobile = width <= 767;
  const [isOpen, setIsOpen] = useState(false);

  const toggleHandler = () => {
    setIsOpen((cur) => !cur);
  };

  const [modal, setModal] = useState({
    show: false,
    name: '',
  });

  function showModal(modalName: string) {
    setModal({
      show: true,
      name: modalName,
    });
  }

  function hideModal() {
    setModal({
      show: false,
      name: '',
    });
  }

  const menuItems = [
    {
      itemName: 'Dashboard',
      itemIcon: 'dashboard.svg',
      href: '/dashboard',
      access: ['admin', 'user'],
    },
    {
      itemName: 'User management',
      itemIcon: 'user.svg',
      href: '/dashboard/user-management',
      access: ['admin'],
    },
    {
      itemName: 'EVC Management',
      itemIcon: 'evc.svg',
      href: '',
      subItems: [
        {
          itemName: 'Manage EVC',
          href: '/dashboard/evc-management/manage-evc',
          access: ['admin', 'user'],
        },
        {
          itemName: 'Add EVC',
          href: '/dashboard/evc-management/add-evc',
          access: ['user'],
        },
      ],
      access: ['admin', 'user'],
    },
    {
      itemName: 'Vehicle Management',
      itemIcon: 'vehicle.svg',
      href: '/dashboard/vehicle-management',
      subItems: [
        {
          itemName: 'Manage Vehicles',
          href: '/dashboard/vehicle-management/manage-vehicles',
          access: ['admin', 'user'],
        },
        {
          itemName: 'Add Vehicle',
          href: '/dashboard/vehicle-management/add-vehicles',
          access: ['user'],
        },
      ],
      access: ['admin', 'user'],
    },
    {
      itemName: 'Booking Management',
      itemIcon: 'booking.svg',
      href: '/dashboard/booking-management',
      subItems: [
        {
          itemName: 'Booking Configuration',
          href: '/dashboard/booking-management/booking-configuration',
          access: ['admin'],
        },
        {
          itemName: 'Booking Transactions',
          href: '/dashboard/booking-management/booking-transactions',
          access: ['admin', 'user'],
        },
        {
          itemName: 'Manage Bookings',
          href: '/dashboard/booking-management/manage-bookings',
          access: ['admin', 'user'],
        },
      ],
      access: ['admin', 'user'],
    },
    {
      itemName: 'Commission Management',
      itemIcon: 'commission.svg',
      href: '/dashboard/commission-management',
      access: ['admin'],
      subItems: [
        {
          itemName: 'Manage Commission',
          href: '/dashboard/commission-management/manage-commission',
          access: ['admin'],
        },
        {
          itemName: 'Add Commission',
          href: '/dashboard/commission-management/add-commission',
          access: ['admin'],
        },
        {
          itemName: 'powandgo Commissions',
          href: '/dashboard/commission-management/powandgo-commissions',
          access: ['admin'],
        },
      ],
    },
    {
      itemName: 'Account Settings',
      itemIcon: 'account.svg',
      href: '/dashboard/account-settings',
      subItems: [
        {
          itemName: 'Company Info',
          clickHandler: () => showModal('companyInfo'),
          href: '/',
          access: ['user'],
        },
        {
          itemName: 'Change Email',
          clickHandler: () => showModal('updateEmail'),
          href: '/',
          access: ['user'],
        },
        {
          itemName: 'Payment Method',
          clickHandler: () => {
            showModal('paymentMethod');
          },
          href: '/',
          access: ['user'],
        },
        {
          itemName: 'Bank Account',
          clickHandler: () => {
            showModal('bankAccount');
          },
          href: '/',
          access: ['user'],
        },
        {
          itemName: 'Preferences',
          clickHandler: () => {
            showModal('preference');
          },
          href: '/',
          access: ['user'],
        },
        {
          itemName: 'Change Password',
          clickHandler: () => showModal('updatePassword'),
          href: '/',
          access: ['user'],
        },
      ],
      access: ['user'],
    },
    {
      itemName: 'Setup',
      itemIcon: 'setup.svg',
      href: '/dashboard/setup',
      subItems: [
        // {
        //   itemName: 'Add Plug Type',
        //   href: '/dashboard/setup/plug-type/add-plug-type',
        //   access: ['admin'],
        // },
        {
          itemName: 'Manage Plug Type',
          href: '/dashboard/setup/plug-type',
          access: ['admin'],
        },
        // {
        //   itemName: 'Vehicle Info',
        //   href: '/dashboard/setup/vehicle-info',
        //   access: ['admin'],
        // },
        // {
        //   itemName: 'Add Vehicle Info',
        //   href: '/dashboard/setup/add-vehicle-info',
        //   access: ['admin'],
        // },
        {
          itemName: 'Manage Vehicle Info',
          href: '/dashboard/setup/manage-vehicle-info',
          access: ['admin'],
        },
        // {
        //   itemName: 'Add VAT',
        //   // clickHandler: () => showModal('addVAT'),
        //   href: '/dashboard/setup/vat/add-vat',
        //   access: ['admin'],
        // },
        {
          itemName: 'Manage VAT',
          href: '/dashboard/setup/vat/manage-vat',
          access: ['admin'],
        },
      ],
      access: ['admin'],
    },
    {
      itemName: 'Generate QR Code',
      itemIcon: 'qr-code.svg',
      href: '/dashboard/qrcode/generate-qrcode',
      access: ['admin'],
    },
    {
      itemName: 'Payments',
      itemIcon: 'dashboard.svg',
      href: '/dashboard/payments/manage-payments',
      access: ['admin', 'user'],
    },
  ];

  return (
    <div className="relative w-fit">
      {(!isMobile || (isMobile && isOpen)) && (
        <div className="z-10 overflow-y fixed top-0 left-0 w-[288px] p-[20px] min-h-[100vh] bg-gradient-to-b from-[#1B204A70] to-[#3C42701F] backdrop-blur-[20px]">
          <div className="ml-[20px] mb-[43px] mt-[8px]">
            <AppImage
              src="/site/logo.svg"
              width={124}
              height={30}
              alt="site-logo"
            />
          </div>
          <div className="flex flex-col items-center justify-start gap-[16px] overflow-x-hidden overflow-y-visible h-[calc(100vh-150px)]">
            {menuItems
              ?.filter((card) => {
                if (role === 'user') {
                  return card.access.includes('user');
                }
                if (role === 'admin') {
                  return card.access.includes('admin');
                }
                return false;
              })
              .map((item, index) => {
                let filteredSubItems = item?.subItems?.filter((sub) => {
                  if (role === 'user') {
                    return sub.access.includes('user');
                  }
                  if (role === 'admin') {
                    return sub.access.includes('admin');
                  }
                  return false;
                });

                return (
                  <AppMenuItem
                    key={index}
                    itemName={item.itemName}
                    itemIcon={item.itemIcon}
                    href={item.href}
                    subItems={filteredSubItems}
                  />
                );
              })}
          </div>
          {isMobile && (
            <div
              onClick={toggleHandler}
              className="cursor-pointer mt-[10px] absolute right-[20px] top-[15px] md:display-none"
            >
              <AppImage
                src="/close-cross.svg"
                width={34}
                height={34}
                alt="Close"
              />
            </div>
          )}
        </div>
      )}
      {isMobile && (
        <div onClick={toggleHandler} className="mb-5 cursor-pointer">
          <AppImage
            src="/menu-hamburger.svg"
            width={34}
            height={34}
            alt="Open"
          />
        </div>
      )}
      <style jsx>{`
        .VIpgJd-ZVi9od-aZ2wEe-wOHMyf {
          visibility: hidden !important;
        }
      `}</style>
      <DashboardPopup hideModal={hideModal} modal={modal} userId={userId} />
    </div>
  );
};

export default AppSidebar;
