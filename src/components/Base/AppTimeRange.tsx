import React from 'react';
import AppTimeDropdown from './AppTimeDropdown';

const AppTimeRange = ({
  time,
  openTimeHandler,
  closeTimeHandler,
  disable,
}: any) => {
  return (
    <div className="flex flex-row gap-[50px]">
      <AppTimeDropdown
        className="sm:w-[127px] custom-scrollbar"
        title="From *"
        timeHandler={(hour, min) => {
          openTimeHandler([hour, min]);
        }}
        defaultHour={time?.openingTime[0]}
        defaultMin={time?.openingTime[1]}
        disable={disable}
      />

      <AppTimeDropdown
        className="sm:w-[127px] custom-scrollbar"
        title="To *"
        timeHandler={(hour, min) => {
          closeTimeHandler([hour, min]);
        }}
        defaultHour={time?.closingTime[0]}
        defaultMin={time?.closingTime[1]}
        disable={disable}
      />
    </div>
  );
};

export default AppTimeRange;
