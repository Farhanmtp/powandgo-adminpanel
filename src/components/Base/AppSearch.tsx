import React, { ChangeEventHandler, FC } from 'react';
import AppImage from './AppImage';

interface ButtonProps {
  className?: string;
  searchHandler: ChangeEventHandler<HTMLInputElement>;
  searchValue: string;
  placeholder?: string;
}

const AppSearch: FC<ButtonProps> = ({
  className,
  searchHandler,
  searchValue,
  placeholder,
}) => {
  return (
    <div
      className={`flex flex-row items-center justify-between border-b h-[55px] gap-[10px] p-[4px] w-[350px] ${className}`}
    >
      <div className="flex-1 max-w-none min-w-[20px] flex flex-col">
        <p className="text-secondary text-base font-normal leading-[normal]">
          Search
        </p>
        <input
          type="text"
          placeholder={placeholder || 'Type here'}
          name="search"
          className="color-white bg-transparent outline-none placeholder-gray-500 text-[15px] min-w-[50px]"
          onChange={searchHandler}
          value={searchValue}
        />
      </div>
      <button className="w-fit h-full px-[2px]">
        <AppImage src="/search.svg" alt="Search Icon" width={24} height={24} />
      </button>
    </div>
  );
};

export default AppSearch;
