import React, { ChangeEvent } from 'react';

interface AppRadioInputProps {
  options: Array<{ value: string | number; label: string }>;
  name: string;
  selectedValue: string | number | null;
  onChange: (value: string) => void;
  error?: string;
  title?: string;
  disable?: boolean;
}

const AppRadioInput: React.FC<AppRadioInputProps> = ({
  options,
  name,
  selectedValue,
  onChange,
  error,
  title,
  disable = false,
}) => {
  return (
    <div className="felx flex-col">
      {title && (
        <p
          className={`text-base not-italic font-normal leading-[150%] ${
            disable ? 'text-gray-500' : 'text-secondary'
          }`}
        >
          {title}
        </p>
      )}
      <div className="flex flex-row gap-5">
        {options.map((option) => (
          <label key={option.value} className="flex items-center">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={option.value === selectedValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onChange(e.target.value)
              }
              className="mr-1"
              disabled={disable && option.value !== selectedValue}
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default AppRadioInput;
