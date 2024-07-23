import React, { FC } from 'react';
import AppImage from './AppImage';

interface AppPlugImageProps {
  name: string;
  plugImg: string;
}

const AppPlugImage: FC<AppPlugImageProps> = ({ name, plugImg }) => {
  return (
    <div className="bg-gray-200 rounded h-[70px] w-[70px] flex flex-col items-center justify-center">
      <p className="text-xs text-black">{name}</p>
      <AppImage
        src={`/plugs-type/${plugImg}`}
        alt="Plug Image"
        width={40}
        height={40}
      />
    </div>
  );
};

export default AppPlugImage;
