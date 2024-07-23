import React, { ReactNode } from 'react';
import { MouseEventHandler } from 'react';

type ButtonProps = {
  children: ReactNode;
  className?: string;
  primary?: boolean;
  secondary?: boolean;
  tertiary?: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
};

const AppButton: React.FC<ButtonProps> = ({
  children,
  className = '',
  primary,
  secondary,
  tertiary,
  onClick,
  disabled = false,
  type = 'button',
}) => {
  const buttonClasses = `
    rounded-[20px] px-3 py-1 outline-none
    ${primary ? 'bg-blue-500 text-[#070C27] primaryBtn' : ''}
    ${secondary ? 'bg-tertiary text-secondary' : ''}
    ${tertiary ? 'bg-[#1E2237] text-white' : ''}
    ${disabled ? 'bg-[#1E2237] cursor-auto' : ''}
    ${className}
  `;

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
};

export default AppButton;
