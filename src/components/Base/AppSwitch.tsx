import { FC, useState } from 'react';
import { Switch } from '@headlessui/react';

interface AppSwitchProps {
  switchHandler: (value: boolean) => void;
  enabled: boolean;
}

const AppSwitch: FC<AppSwitchProps> = ({ switchHandler, enabled }) => {
  return (
    <div className="flex items-center" style={{ zIndex: 1 }}>
      <Switch
        checked={enabled}
        onChange={switchHandler}
        className={`${enabled ? '' : ''}
          relative inline-flex bg-[#FFFFFF4D] w-[42.25px] h-[24px] shrink-0 cursor-pointer rounded-[81.25px] border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span
          aria-hidden="true"
          className={`${
            enabled
              ? 'translate-x-[17px] bg-secondary'
              : 'bg-[#929292] translate-x-[1px]'
          }
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
    </div>
  );
};

export default AppSwitch;
