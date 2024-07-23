import React, { FC } from 'react';
import AppImage from './AppImage';

interface AppModalBodyProps {
  hideModal?: () => void;
  children: React.ReactNode;
}

const AppModalBody: FC<AppModalBodyProps> = ({ hideModal, children }) => {
  return (
    <div className="relative">
      {hideModal && (
        <div
          className="cursor-pointer w-fit absolute top-0 right-0"
          onClick={hideModal}
        >
          <AppImage
            src={'/close-cross.svg'}
            width={24}
            height={24}
            alt="Close"
          />
        </div>
      )}

      {children}
    </div>
  );
};

export default AppModalBody;
