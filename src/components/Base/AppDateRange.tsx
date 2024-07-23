import React, { useState, FC } from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRange } from 'react-date-range';
import { Popover, Transition } from '@headlessui/react';

interface AppDateRangeProps {
  setDateRange: (itemSelection: any) => void;
  dateRange: any;
  title: string;
}

const AppDateRange: FC<AppDateRangeProps> = ({
  setDateRange,
  dateRange,
  title,
}) => {
  const clearDateFilter = () => {
    setDateRange([
      { startDate: '', endDate: '', key: 'selection', color: '#c6ff36' },
    ]);
  };
  const isDateFilterSelected = dateRange[0].startDate && dateRange[0].endDate;

  return (
    <div className="flex items-center" style={{ zIndex: 2 }}>
      <Popover className="relative">
        <Popover.Button className="rounded-[20px] h-12 px-[30px] py-1 bg-tertiary text-secondary outline-none">
          {title}
        </Popover.Button>
        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Popover.Panel className="absolute top-[10px] right-3 z-100">
            <DateRange
              editableDateInputs={false}
              onChange={(item: any) => setDateRange([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={dateRange}
              className="rounded-lg"
              maxDate={new Date()}
              shownDate={new Date()}
              startDatePlaceholder="From"
              endDatePlaceholder="To"
            />
            {isDateFilterSelected && (
              <button
                className="absolute top-0 right-0 flex items-center justify-center w-12 h-6 bg-white rounded-md border-2 border-indigo-400 text-indigo-400 hover:bg-white hover:text-indigo-600 focus:bg-white focus:text-indigo-600 mt-11 mr-2"
                onClick={clearDateFilter}
              >
                Clear
              </button>
            )}
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  );
};

export default AppDateRange;
