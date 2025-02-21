'use client';

import { FC, Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import type { Option } from '../Base/AppListBoxOption';
import AppListBoxOption from '../Base/AppListBoxOption';

const filterOptions: Option[] = [
  { id: 1, name: 'Active', type: 'status' },
  { id: 2, name: 'Disabled', type: 'status' },
  { id: 3, name: 'Meter Display', type: 'category' },
];

interface VehicleFilterProps {
  selected: Option | Option[];
  multiple: boolean;
  selectHandler: (value: Option | Option[]) => void;
  className?: string;
}

const VehicleFilter: FC<VehicleFilterProps> = ({
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
                Status
              </p>
              <AppListBoxOption option={filterOptions[0]} />
              <AppListBoxOption option={filterOptions[1]} />
              <p className="underline underline-offset-2 ml-2 mt-2 text-secondary">
                Category
              </p>
              <AppListBoxOption option={filterOptions[2]} />
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default VehicleFilter;
