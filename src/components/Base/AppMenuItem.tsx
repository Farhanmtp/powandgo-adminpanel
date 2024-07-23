'use client';

import React, { ReactNode, useState } from 'react';
import AppImage from './AppImage';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface SubMenuItem {
  itemName: string;
  href?: string;
  clickHandler?: () => void;
  access?: string[];
}

interface AppMenuItemProps {
  itemName: string;
  itemIcon: string;
  href: string;
  subItems?: SubMenuItem[];
}

const AppMenuItem: React.FC<AppMenuItemProps> = ({
  itemName,
  itemIcon,
  subItems,
  href,
}) => {
  const pathName = usePathname();
  const isActive =
    pathName === href || subItems?.some((sub) => sub.href === pathName);
  const activeContainer = isActive ? 'bg-white bg-opacity-5' : '';
  const activeText = isActive ? 'text-secondary' : '';

  const [showSubItems, setShowSubItems] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    if (subItems) {
      setShowSubItems((cur) => !cur);
    } else {
      router.push(href);
    }
  };

  let itemIconAddress = isActive
    ? `/menu-items/active/${itemIcon}`
    : `/menu-items/in-active/${itemIcon}`;

  return (
    <div className={`w-[257px] flex flex-col items-end gap-[12px]`}>
      <div
        className={`flex flex-row justify-between rounded cursor-pointer pl-3 pr-2.5 py-2 w-full h-[44px] ${activeContainer}`}
        onClick={toggleDropdown}
      >
        <div className="flex flex-row items-center gap-[10px]">
          <AppImage src={itemIconAddress} width={28} height={28} alt="icon" />
          <span
            className={`text-sm font-normal leading-[normal] capitalize ${activeText}`}
          >
            {itemName}
          </span>
        </div>
        {subItems && (
          <div>
            <AppImage
              src="/arrow-down.svg"
              width={24}
              height={24}
              alt="dropdown"
            />
          </div>
        )}
      </div>

      {subItems && showSubItems && (
        <div className="w-[227px] flex flex-col gap-[4px] pl-[12px]  border-l-[rgba(255,255,255,0.60)] border-l border-solid">
          {subItems?.map((item, i) => {
            return (
              <div
                key={i}
                className={`px-3 py-2.5 rounded cursor-pointer ${
                  pathName === item.href
                    ? 'bg-white bg-opacity-5 text-white'
                    : 'text-[rgba(255,255,255,0.70)]'
                }`}
                onClick={() => {
                  if (item.clickHandler) {
                    item.clickHandler();
                    return;
                  }
                  if (item.href) {
                    router.push(item.href);
                    return;
                  }
                }}
              >
                <p className="text-current text-sm not-italic font-normal leading-[normal]">
                  {item.itemName}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AppMenuItem;
