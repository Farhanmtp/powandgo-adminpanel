'use client';
import React from 'react';
import { FallingLines } from 'react-loader-spinner';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';

const BackdropLoader = () => {
  const loading = useAppSelector((state: RootState) => state?.common.loading);

  if (!loading) return;

  return (
    <div className="fixed flex justify-center items-center top-0 left-0 w-full h-full bg-black opacity-60 z-50">
      <div>
        <FallingLines color="#c6ff36" width="100" visible={true} />
      </div>
    </div>
  );
};

export default BackdropLoader;
