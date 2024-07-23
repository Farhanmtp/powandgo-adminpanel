import { FC } from 'react';
import { Listbox } from '@headlessui/react';
import AppImage from './AppImage';

export interface Option {
  id: number;
  name: string;
  type?: string;
  value?: string | Date | boolean;
}

interface ListBoxOptionProps {
  option: Option;
}

const AppListBoxOption: FC<ListBoxOptionProps> = ({ option }) => {
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

export default AppListBoxOption;
