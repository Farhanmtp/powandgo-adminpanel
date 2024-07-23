import React, { FC } from 'react';
import AppButton from './AppButton';

interface AppModalActionProps {
  closeHandler?: () => void;
  closeHandlerText?: string;
  proceedHandler?: () => void;
  proceedHandlerText?: string;
  className?: string;
}

const AppModalAction: FC<AppModalActionProps> = ({
  closeHandler,
  proceedHandler,
  closeHandlerText = 'Cancel',
  proceedHandlerText = 'Yes',
  className = '',
}) => {
  return (
    <div
      className={`flex flex-row gap-[10px] items-center justify-center flex-wrap my-2 ${className}`}
    >
      {proceedHandler && (
        <AppButton
          primary
          onClick={proceedHandler}
          className="min-w-[70px] outline-none"
        >
          {proceedHandlerText}
        </AppButton>
      )}
      {closeHandler && (
        <AppButton secondary onClick={closeHandler} className="outline-none">
          {closeHandlerText}
        </AppButton>
      )}
    </div>
  );
};

export default AppModalAction;
