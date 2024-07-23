'use client';

import { FC, Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import AppImage from './AppImage';

export interface Option {
  id: number;
  name: string;
}

interface AppFilterProps {
  options: Option[];
  selected: Option | Option[];
  multiple: boolean;
  selectHandler: (value: Option | Option[]) => void;
  className?: string;
}

const AppFilter: FC<AppFilterProps> = ({
  options,
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
            <Listbox.Options className="absolute z-10 px-[8px] mt-[6px] w-full overflow-auto backdrop-blur-[20px] rounded-[0px_0px_16px_16px] bg-gradient-to-b from-[#1B204A70] to-[#3C42701F] outline-none">
              {/* Children */}
              {options?.map((person, personIdx) => (
                <Listbox.Option
                  key={personIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none text-white ${
                      active ? '' : ''
                    }`
                  }
                  value={person}
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
                        <p
                          className={`break-all ${
                            selected ? 'text-secondary' : ''
                          }`}
                        >
                          {person.name}
                        </p>
                      </div>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default AppFilter;
