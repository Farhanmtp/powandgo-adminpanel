'use client';

import React, { FC } from 'react';

interface AppTableHeaderProps {
  headers: string[];
}

const AppTableHeader: FC<AppTableHeaderProps> = ({ headers }) => {
  return (
    <thead className="bg-tertiary h-[64px]">
      <tr className="header-row">
        {headers.map((header, i) => {
          return (
            <th key={i} className=" text-secondary">
              {header}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default AppTableHeader;
