import React, { FC } from 'react';

interface AppAddressFieldProps {
  title?: string;
}

const AppAddressField: FC<AppAddressFieldProps> = ({ title }) => {
  return (
    <div className="flex flex-col w-fit">
      {title && (
        <p className="text-base not-italic font-normal leading-[150%] text-secondary">
          {title}
        </p>
      )}
    </div>
  );
};

export default AppAddressField;
