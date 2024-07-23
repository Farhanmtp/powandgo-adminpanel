import React, { FC } from 'react';

interface AppTextAreaProps {
  value: string;
  handleChange: (value: string) => void;
  textAreaProps: any;
  title?: string;
  placeholder?: string;
  className?: string;
}

const AppTextArea: FC<AppTextAreaProps> = ({
  value = '',
  handleChange,
  textAreaProps,
  title,
  placeholder = '',
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      {title && (
        <p
          className={`text-base not-italic font-normal leading-[150%] text-secondary`}
        >
          {title}
        </p>
      )}
      <textarea
        className="w-full p-2 bg-transparent border-b focus:outline-none"
        value={value}
        onChange={(e) => {
          handleChange(e.target.value);
        }}
        {...textAreaProps}
        placeholder={placeholder}
      />
    </div>
  );
};

export default AppTextArea;
