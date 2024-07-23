'use client';

import { FC, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import type { Option } from '../Base/AppListBoxOption';
import AppListBoxOption from '../Base/AppListBoxOption';

const filterOptions: Option[] = [
  { id: 1, name: 'Cancelled', type: 'status' },
  { id: 2, name: 'Charge & Paid', type: 'status' },
  { id: 3, name: 'Booking', type: 'type' },
  { id: 4, name: 'Reservation', type: 'type' },
  { id: 5, name: 'Filter', type: 'datetime' },
];

interface TransactionsFilterProps {
  selected: Option | Option[];
  multiple: boolean;
  selectHandler: (value: Option | Option[]) => void;
  className?: string;
  transactionDateHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  transactionDate: { startDate: string; endDate: string };
}

const TransactionsFilter: FC<TransactionsFilterProps> = ({
  selected,
  multiple,
  selectHandler,
  className = '',
  transactionDateHandler,
  transactionDate,
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
            <Listbox.Options className="absolute z-10 px-[8px] pb-[8px] mt-[6px] w-full overflow-auto backdrop-blur-[20px] rounded-[16px] bg-gradient-to-b from-[#1B204A70] to-[#3C42701F] outline-none">
              <p className="underline underline-offset-2 ml-2 mt-2 text-secondary">
                Status
              </p>
              <AppListBoxOption option={filterOptions[0]} />
              <AppListBoxOption option={filterOptions[1]} />
              <p className="underline underline-offset-2 ml-2 mt-2 text-secondary">
                Type
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

export default TransactionsFilter;
