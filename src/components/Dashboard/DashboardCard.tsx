'use client';

import React, { useState } from 'react';
import AppImage from '../Base/AppImage';
import { useRouter } from 'next/navigation';

interface DashboardCardProps {
  title: string;
  icon: string;
  href: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, icon, href }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = () => {
    setIsHovered((cur) => !cur);
  };

  const router = useRouter();
  const routeHandler = () => {
    router.push(href);
  };

  const imageSrc = `/dashboard-cards/${
    isHovered ? 'active' : 'in-active'
  }/${icon}`;

  return (
    <div
      onMouseEnter={handleHover}
      onMouseLeave={handleHover}
      onClick={routeHandler}
      className="cursor-pointer w-[200px] h-[140px] rounded-[12px] px-2 py-[25px] flex items-center justify-center bg-gradient-to-b from-[#1B204A70] to-[#3C42701F] hover:bg-none hover:bg-[#C6FF36] hover:text-[#070C27]"
    >
      <div className="flex flex-col items-center justify-center gap-[10px]">
        <div className="w-[100px] h-[60px] flex items-center justify-center">
          <AppImage src={imageSrc} width={50} height={50} alt="icon" />
        </div>

        <h2 className="text-center text-sm font-normal leading-[30px] capitalize">
          {title}
        </h2>
      </div>
    </div>
  );
};

export default DashboardCard;
