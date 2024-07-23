'use client';

import { useState, useEffect, FC } from 'react';
import { getSpecificUser } from '@/services/user';
import CompanyInfoForm from '../Forms/CompanyInfoForm';

interface CompanyInfoProps {
  userId: number;
  hideModal: () => void;
}

const CompanyInfo: FC<CompanyInfoProps> = ({ userId, hideModal }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    getSpecificUser(userId).then((data) => {
      setUserData(data.data);
    });
    return () => {};
  }, []);

  return (
    <div>
      {userData && <CompanyInfoForm user={userData} hideModal={hideModal} />}
    </div>
  );
};

export default CompanyInfo;
