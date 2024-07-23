'use client';

import { FC, Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import AppImage from './AppImage';

export interface Option {
  id: number;
  name: string;
}

interface AppTimeDropdownProps {
  title?: string;
  className?: string;
  timeHandler: (hour: any, min: any) => void;
  defaultMin?: Option;
  defaultHour?: Option;
  disable: boolean;
}

export let hours = [
  { id: 1, name: '01' },
  { id: 2, name: '02' },
  { id: 3, name: '03' },
  { id: 4, name: '04' },
  { id: 5, name: '05' },
  { id: 6, name: '06' },
  { id: 7, name: '07' },
  { id: 8, name: '08' },
  { id: 9, name: '09' },
  { id: 10, name: '10' },
  { id: 11, name: '11' },
  { id: 12, name: '12' },
  { id: 13, name: '13' },
  { id: 14, name: '14' },
  { id: 15, name: '15' },
  { id: 16, name: '16' },
  { id: 17, name: '17' },
  { id: 18, name: '18' },
  { id: 19, name: '19' },
  { id: 20, name: '20' },
  { id: 21, name: '21' },
  { id: 22, name: '22' },
  { id: 23, name: '23' },
  { id: 24, name: '00' },
];

export let minutes = [
  { id: 0, name: '00' },
  { id: 15, name: '15' },
  { id: 30, name: '30' },
  { id: 45, name: '45' },
];

const AppTimeDropdown: FC<AppTimeDropdownProps> = ({
  title,
  className = '',
  timeHandler,
  defaultHour,
  defaultMin,
  disable,
}) => {
  const [selectedHour, setSelectedHour] = useState(defaultHour || hours[0]);
  const [selectedMin, setSelectedMin] = useState(defaultMin || minutes[0]);

  const hourSelectHandler = (value: Option) => {
    setSelectedHour(value);
    timeHandler(value, selectedMin);
  };

  const minSelectHandler = (value: Option) => {
    setSelectedMin(value);
    timeHandler(selectedHour, value);
  };

  return (
    <div className={className}>
      <Listbox multiple={false} disabled={disable}>
        <div className="relative">
          <Listbox.Button className="relative min-w-[130px] w-full cursor-pointer border-b first-letter: ">
            <div className="w-full flex flex-row items-center justify-between flex-wrap mb-[4px]">
              <div className="flex flex-col items-start flex-wrap gap-[2px] w-full">
                {title && (
                  <p
                    className={`${
                      disable ? 'text-gray-500' : 'text-secondary'
                    }`}
                  >
                    {title}
                  </p>
                )}
                <div className="flex flex-row gap-1 justify-between w-full">
                  <p className="max-w-[90%] overflow-x-auto">
                    {selectedHour.name} : {selectedMin.name}
                  </p>
                  <AppImage
                    src="/dropdown.svg"
                    width={24}
                    height={24}
                    alt="Dropdown Icon"
                  />
                </div>
              </div>
            </div>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 px-[8px] mt-[6px] w-full backdrop-blur-[20px] rounded-[0px_0px_16px_16px] bg-gradient-to-b from-[#1B204A70] to-[#3C42701F] outline-none">
              <div className="text-secondary flex flex-row gap-2 pl-[6px] pr-[17px] justify-between mb-1">
                <p className="">hr</p>
                <p className="">min</p>
              </div>
              <div className="flex flex-row gap-5">
                <div className="max-h-[160px] overflow-y-auto cursor-pointer flex flex-col gap-2">
                  {hours.map((hour, i) => {
                    return (
                      <p
                        key={i}
                        className={`${
                          hour.id === selectedHour.id ? 'text-secondary' : ''
                        } min-w-[40px] py-[4px] pl-[4px]
                        `}
                        onClick={() => hourSelectHandler(hour)}
                      >
                        {hour.name}
                      </p>
                    );
                  })}
                </div>
                <div className="max-h-[160px] overflow-y-auto cursor-pointer flex flex-col gap-2">
                  {minutes.map((min, i) => {
                    return (
                      <p
                        key={i}
                        onClick={() => minSelectHandler(min)}
                        className={`${
                          min.id === selectedMin.id ? 'text-secondary' : ''
                        } min-w-[40px] py-[4px]`}
                      >
                        {min.name}
                      </p>
                    );
                  })}
                </div>
              </div>
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default AppTimeDropdown;
