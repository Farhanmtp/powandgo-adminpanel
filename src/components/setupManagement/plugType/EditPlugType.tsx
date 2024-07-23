'use client';

import { useState, useEffect, FC } from 'react';
import PlugTypeForm from '@/components/Forms/PlugTypeForm';
import { getSpecificPlugType } from '@/services/plugType';

interface EditPlugTypeProps {
  plugId: number;
  user: any;
}

const EditPlugType: FC<EditPlugTypeProps> = ({ plugId, user }) => {
  const [plugTypeData, setPlugTypeData] = useState(null);

  useEffect(() => {
    getSpecificPlugType(plugId).then((data) => {
      setPlugTypeData(data.data);
    });
    return () => {};
  }, []);

  return (
    <div>
      {plugTypeData && (
        <PlugTypeForm user={user} editMode={true} plugTypeData={plugTypeData} />
      )}
    </div>
  );
};

export default EditPlugType;
