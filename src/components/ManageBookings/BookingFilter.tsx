'use client';

import { FC, Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import type { Option } from '../Base/AppListBoxOption';
import AppListBoxOption from '../Base/AppListBoxOption';

const filterOptions: Option[] = [
  { id: 1, name: 'Booked/Reserved', type: 'bookingStatus' },
  { id: 2, name: 'Charging', type: 'bookingStatus' },
  { id: 3, name: 'Pending Confirm', type: 'bookingStatus' },
  { id: 4, name: 'Charged & Paid', type: 'bookingStatus' },
  { id: 5, name: 'Charged & Pending Payment', type: 'bookingStatus' },
  { id: 6, name: 'Cancelled', type: 'bookingStatus' },
];

interface BookingFilterProps {
  selected: Option | Option[];
  multiple: boolean;
  selectHandler: (value: Option | Option[]) => void;
  className?: string;
}

const BookingFilter: FC<BookingFilterProps> = ({
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
                Booking Status
              </p>
              {filterOptions.map((cur, i) => {
                return (
                  <div key={i}>
                    <AppListBoxOption option={cur} />
                  </div>
                );
              })}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default BookingFilter;
