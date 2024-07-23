import React, { FC, useState } from 'react';
import AppImage from './AppImage';

interface InputFieldProps {
  disabled?: boolean;
  placeholder?: string;
  value: string | number;
  inputHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
  title?: string;
  inputProps?: any;
  error?: string;
  endingText?: string;
  containerClass?: string;
}

const AppInputField: FC<InputFieldProps> = ({
  disabled = false,
  placeholder = '',
  value,
  type = 'text',
  className = '',
  title,
  inputHandler,
  inputProps = {},
  error = '',
  endingText = '',
  containerClass = '',
}) => {
  const [passwordShow, setPasswordShow] = useState(false);

  // Show Hide Password
  const showPasswordHandler = () => {
    setPasswordShow((cur) => !cur);
  };

  let inputType = type;

  if (type === 'password' && passwordShow) {
    inputType = 'text';
  }

  return (
    <div className={`sm:w-[300px] ${containerClass}`}>
      <div
        className={`flex flex-col justify-between sm:w-[300px] h-[56px] border-b ${className}
`}
      >
        {title && (
          <p
            className={`text-base not-italic font-normal leading-[150%] ${
              disabled ? 'text-gray-500' : 'text-secondary'
            }`}
          >
            {title}
          </p>
        )}
        <div className="relative flex flex-row gap-1">
          <input
            type={inputType}
            className={`bg-transparent  max-w-none min-w-0 pb-[4px] w-full outline-none ${
              disabled ? 'cursor-not-allowed' : 'cursor-pointer'
            }
      `}
            disabled={disabled}
            placeholder={placeholder}
            // defaultValue={value}
            value={value}
            onChange={inputHandler}
            {...inputProps}
          />
          {type === 'password' && (
            <div
              className="absolute right-[7px] bottom-[7px] cursor-pointer"
              onClick={showPasswordHandler}
            >
              <AppImage
                src={passwordShow ? '/eye-close.svg' : '/eye-open.svg'}
                alt="password-show-hide"
                width={24}
                height={24}
              />
            </div>
          )}
          {endingText && <p className="text-gray-500">{endingText}</p>}
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default AppInputField;
