import React, { useState, useEffect } from 'react';
import AppImage from './AppImage';

interface AppToastProps {
  message: string;
  type: string;
  onClose: () => void;
  duration?: number;
}

const AppToast: React.FC<AppToastProps> = ({
  message,
  type,
  duration = 4000,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastClasses = () => {
    switch (type) {
      case 'info':
        return 'bg-blue-500 text-white';
      case 'successful':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-800 text-white';
    }
  };

  const getIconPath = () => {
    switch (type) {
      case 'info':
        return '/checked.svg';
      case 'successful':
        return '/checked.svg';
      case 'error':
        return '/checked.svg';
      default:
        return '';
    }
  };

  return (
    <div
      className={`z-[10000] max-w-[550px] flex flex-row justify-between items-center gap-1 fixed top-5 right-5 p-4 rounded-md ${getToastClasses()} ${
        visible ? 'opacity-100' : 'opacity-0'
      } transition-opacity duration-300`}
    >
      {/* To do */}
      {/* <AppImage
        src={getIconPath()}
        alt={`Icon for ${type}`}
        height={20}
        width={20}
      /> */}
      <p className="whitespace-pre-line	">{message}</p>
    </div>
  );
};

export default AppToast;
