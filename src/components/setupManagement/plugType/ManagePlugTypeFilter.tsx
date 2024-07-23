'use client';

import { FC, Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import AppImage from '@/components/Base/AppImage';

const filterOptions: Option[] = [
  { id: 1, name: 'Active', type: 'status' },
  { id: 2, name: 'Disabled', type: 'status' },
  { id: 3, name: 'Car', type: 'vehicleType' },
  { id: 4, name: 'Bicycle', type: 'vehicleType' },
];

export interface Option {
  id: number;
  name: string;
  type?: string;
}

interface ManagePlugTypeFilterProps {
  selected?: Option | Option[];
  multiple: boolean;
  selectHandler: (value: Option | Option[]) => void;
  className?: string;
}

interface ListBoxOptionProps {
  option: Option;
}

const ListBoxOption: FC<ListBoxOptionProps> = ({ option }) => {
  return (
    <div>
      <Listbox.Option
        className={({ active }) =>
          `relative cursor-default select-none text-white ${active ? '' : ''}`
        }
        value={option}
      >
        {({ selected }) => (
          <>
            <div className="px-[16px] py-[10px] flex flex-row items-center gap-[10px]">
              <AppImage
                src={selected ? '/checked.svg' : '/un-checked.svg'}
                width={20}
                height={20}
                alt="Unchecked Icon"
              />
              <p className={`break-all ${selected ? 'text-secondary' : ''}`}>
                {option.name}
              </p>
            </div>
          </>
        )}
      </Listbox.Option>
    </div>
  );
};

const ManagePlugTypeFilter: FC<ManagePlugTypeFilterProps> = ({
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
              <ListBoxOption option={filterOptions[0]} />
              <ListBoxOption option={filterOptions[1]} />
              <p className="underline underline-offset-2 ml-2 mt-2 text-secondary">
                Vehicle Type
              </p>
              <ListBoxOption option={filterOptions[2]} />
              <ListBoxOption option={filterOptions[3]} />
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default ManagePlugTypeFilter;
