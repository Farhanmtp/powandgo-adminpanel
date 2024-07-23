import { FC, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import AppImage from './AppImage';

export interface Option {
  value?: string;
  id: number | string;
  name: string;
  detail?: any;
  img?: string;
}

interface AppSelectProps {
  options: Option[];
  selected: null | Option | Option[];
  multiple: boolean;
  selectHandler: (value: Option | Option[]) => void;
  title?: string;
  className?: string;
  placeholder?: string;
  disable?: boolean;
  error?: string;
  optionsClass?: string;
}

const AppSelect: FC<AppSelectProps> = ({
  options,
  selected,
  multiple,
  selectHandler,
  title,
  className = '',
  placeholder = '',
  disable = false,
  error = '',
  optionsClass = '',
}) => {
  const selectedIds = Array.isArray(selected)
    ? selected.map((option) => option.id)
    : selected?.id;

  const handleSelect = (selectedId: number | string | (number | string)[]) => {
    if (Array.isArray(selectedId)) {
      const selectedOptions = options.filter((option) =>
        selectedId.includes(option.id)
      );
      selectHandler(selectedOptions);
    } else {
      const selectedOption = options.find((option) => option.id === selectedId);
      if (selectedOption) {
        selectHandler(selectedOption);
      } else {
        console.error('Selected option not found.');
      }
    }
  };

  return (
    <div className={className}>
      <Listbox
        value={selectedIds}
        onChange={handleSelect}
        multiple={multiple}
        disabled={disable}
      >
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer border-b first-letter: outline-none">
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
                    {Array.isArray(selected)
                      ? selected.map((option) => option.name).join(', ') || (
                          <span className="text-gray-500">{placeholder}</span>
                        )
                      : selected?.name || (
                          <span className="text-gray-500">{placeholder}</span>
                        )}
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
            <Listbox.Options
              className={`max-h-[500px] absolute z-10 px-[8px] mt-[6px] w-full overflow-auto backdrop-blur-[20px] rounded-[0px_0px_16px_16px] bg-gradient-to-b from-[#1B204A70] to-[#3C42701F] outline-none ${optionsClass}`}
            >
              {options?.map((option, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    `relative cursor-default select-none text-white ${
                      active ? '' : ''
                    }`
                  }
                  value={option.id}
                >
                  {({ selected }) => (
                    <>
                      <div className="px-[16px] py-[10px] flex flex-row items-center gap-[10px]">
                        <AppImage
                          src={selected ? '/checked.svg' : '/un-checked.svg'}
                          width={20}
                          height={20}
                          alt={selected ? 'Checked Icon' : 'Unchecked Icon'}
                        />
                        <p
                          className={`break-all ${
                            selected ? 'text-secondary' : ''
                          }`}
                        >
                          {option?.name}
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
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default AppSelect;
