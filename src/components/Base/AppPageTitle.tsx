import React, { FC } from 'react';

interface AppPageTitleProps {
  title: string;
  className?: string;
}

const AppPageTitle: FC<AppPageTitleProps> = ({ title, className }) => {
  return (
    <div className="min-h-[48px] w-full">
      <h1
        className={`text-2xl font-normal leading-[normal] capitalize ${className}`}
      >
        {title}
      </h1>
    </div>
  );
};

export default AppPageTitle;
