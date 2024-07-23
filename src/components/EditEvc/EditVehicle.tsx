'use client';

import { useState, useEffect, FC } from 'react';
import EvcForm from '../Forms/EvcForm';
import { getSpecificEvc } from '@/services/evc';

interface EditEvcProps {
  evcId: number;
}

const EditEvc: FC<EditEvcProps> = ({ evcId }) => {
  const [evcData, setEvcData] = useState(null);

  useEffect(() => {
    getSpecificEvc(evcId).then((data) => {
      setEvcData(data.data);
    });
    return () => {};
  }, []);

  return <div>{evcData && <EvcForm editMode={true} evcData={evcData} />}</div>;
};

export default EditEvc;
