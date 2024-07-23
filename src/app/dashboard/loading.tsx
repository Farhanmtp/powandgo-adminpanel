'use client';
import React from 'react';
import { FallingLines } from 'react-loader-spinner';

const loading = () => {
  return (
    <div className="flex-1 flex justify-center items-center">
      <FallingLines color="#c6ff36" width="100" visible={true} />
    </div>
  );
};

export default loading;
