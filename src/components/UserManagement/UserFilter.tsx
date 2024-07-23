'use client';

import { FC, Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import type { Option } from '../Base/AppListBoxOption';
import AppListBoxOption from '../Base/AppListBoxOption';

const filterOptions: Option[] = [
  { id: 1, name: 'Commercial', type: 'providerType' },
  { id: 2, name: 'Residential', type: 'providerType' },
  { id: 3, name: 'Active', type: 'activeStatus' },
  { id: 4, name: 'Disable', type: 'activeStatus' },
];

interface UserFilterProps {
  selected: Option | Option[];
  multiple: boolean;
  selectHandler: (value: Option | Option[]) => void;
  className?: string;
}

const UserFilter: FC<UserFilterProps> = ({
  selected,
  multiple,
  selectHandler,
  className = '',
}) => {
  return (
    <div className={className}>
      <Listbox value={selected} onChange={selectHandler} multiple={multiple}>
        <div className="relative">
          <Listbox.Button className="rounded-[20px] h-12 px-[30px] py-1 relative w-full cursor-pointer bg-tertiary text-secondary">
            <p>Filters</p>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 px-[8px] mt-[6px] w-full overflow-auto backdrop-blur-[20px] rounded-[16px] bg-gradient-to-b from-[#1B204A70] to-[#3C42701F] outline-none">
              <p className="underline underline-offset-2 ml-2 mt-2 text-secondary">
                Provider Type
              </p>
              <AppListBoxOption option={filterOptions[0]} />
              <AppListBoxOption option={filterOptions[1]} />
              <p className="underline underline-offset-2 ml-2 mt-2 text-secondary">
                Status
              </p>
              <AppListBoxOption option={filterOptions[2]} />
              <AppListBoxOption option={filterOptions[3]} />
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default UserFilter;
