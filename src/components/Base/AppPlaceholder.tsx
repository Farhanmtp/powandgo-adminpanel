import React, { FC } from 'react';
import AppImage from './AppImage';

interface PlaceholderProps {
  children?: React.ReactNode;
}

const AppPlaceholder: FC<PlaceholderProps> = ({ children }) => {
  return (
    <div className="w-fit max-w-[500px] flex flex-col gap-2 border rounded-xl mx-auto p-4">
      {children}
    </div>
  );
};

export default AppPlaceholder;
