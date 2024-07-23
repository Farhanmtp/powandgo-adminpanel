'use client';

import { useState, useEffect, FC } from 'react';
import EditUserForm from '../Forms/EditUserForm';
import { getSpecificUser } from '@/services/user';

interface EditUserProps {
  userId: number;
}

const EditUser: FC<EditUserProps> = ({ userId }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    getSpecificUser(userId).then((data) => {
      setUserData(data.data);
    });
    return () => {};
  }, []);

  return <div>{userData && <EditUserForm user={userData} />}</div>;
};

export default EditUser;
