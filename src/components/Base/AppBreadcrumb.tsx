'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface BreadCrumbItem {
  title: string;
  isActive: boolean;
  href: string;
}

interface AppBreadcrumbProps {
  breadcrumbs: BreadCrumbItem[];
}

const AppBreadcrumb: React.FC<AppBreadcrumbProps> = ({ breadcrumbs }) => {
  const router = useRouter();

  const routeHandler = (item: BreadCrumbItem) => {
    router.push(item.href);
  };
  return (
    <div className="flex flex-row gap-[5px]">
      {breadcrumbs.map((item, index) => {
        return (
          <div
            key={index}
            className="text-xs md:text-base font-normal leading-[normal] capitalize flex flex-row gap-[5px] items-center"
          >
            <p
              className={`
            cursor-pointer
            ${item.isActive ? 'text-secondary' : ''}`}
              onClick={() => routeHandler(item)}
            >
              {item.title}
            </p>
            {index !== breadcrumbs.length - 1 && (
              <p className="text-sm md:text-xl">&gt;</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AppBreadcrumb;
