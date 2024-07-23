import { Fragment, useState, FC } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import AppImage from './AppImage';

export interface Option {
  id: number;
  name: string;
  detail?: any;
  img?: string;
}

interface AppAutoCompleteProps {
  options: Option[];
  selected: null | Option[];
  selectHandler: (value: Option[]) => void;
  title?: string;
  className?: string;
  placeholder?: string;
  disable?: boolean;
  error?: string;
}

const AppAutoComplete: FC<AppAutoCompleteProps> = ({
  title,
  disable,
  options,
  className,
  selectHandler,
  selected,
  error,
}) => {
  const [query, setQuery] = useState<string>('');

  const filteredOptions: Option[] =
    query === ''
      ? options
      : options?.filter((option) =>
          option.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  return (
    <div className={`w-[300px] ${className}`}>
      <Combobox
        value={selected?.map((option) => option.id)}
        onChange={(selectedOptions) =>
          selectHandler(
            options.filter((option) => selectedOptions.includes(option.id))
          )
        }
        multiple
        disabled={disable}
      >
        <div className="relative">
          <div className="flex flex-col items-start flex-wrap gap-[0px] w-full  border-b">
            <div>
              {title && (
                <p
                  className={`${disable ? 'text-gray-500' : 'text-secondary'}`}
                >
                  {title}
                </p>
              )}
            </div>
            <div className="w-full flex flex-row gap-1 cursor-default bg-transparent text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300">
              <div className="flex flex-row gap-1 items-center overflow-auto flex-grow  sm:text-sm">
                <div className="outline-none w-fit mr-[4px] whitespace-nowrap">
                  {selected?.map((cur) => cur.name).join(', ')}
                </div>
                <Combobox.Input
                  className="min-w-[100px] outline-none border-none py-1 pl-[1px] pr-8 text-base leading-5  text-white bg-transparent focus:ring-0"
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>

              <Combobox.Button className="min-w-[30px] flex justify-center mb-1 items-center">
                <AppImage
                  src="/dropdown.svg"
                  width={24}
                  height={24}
                  alt="Dropdown Icon"
                />
              </Combobox.Button>
            </div>
          </div>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="max-h-[300px] absolute z-10 px-[8px] mt-[6px] w-full overflow-auto backdrop-blur-[20px] rounded-[0px_0px_16px_16px] bg-gradient-to-b from-[#1B204A70] to-[#3C42701F] outline-none">
              {filteredOptions?.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none px-4 py-2 text-white">
                  Nothing found
                </div>
              ) : (
                filteredOptions?.map((option) => (
                  <Combobox.Option
                    key={option.id}
                    className={({ active }) =>
                      `relative cursor-pointer select-none text-white ${
                        active ? '' : ''
                      }`
                    }
                    value={option.id}
                  >
                    {({ selected, active }) => (
                      <div className="px-[16px] py-[10px] flex flex-row items-center gap-[10px]">
                        <AppImage
                          src={selected ? '/checked.svg' : '/un-checked.svg'}
                          width={20}
                          height={20}
                          alt={selected ? 'Checked Icon' : 'Unchecked Icon'}
                        />
                        <span
                          className={`block ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {option.name}
                        </span>
                      </div>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
      {error && <p className="text-sm text-red-500 mt-[1px]">{error}</p>}
    </div>
  );
};

export default AppAutoComplete;
