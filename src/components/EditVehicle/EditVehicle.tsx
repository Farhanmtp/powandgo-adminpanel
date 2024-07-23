'use client';

import { useState, useEffect, FC } from 'react';
import VehicleForm from '../Forms/VehicleForm';
import { getSpecificGarage } from '@/services/garage';

interface EditVehicleProps {
  vehicleId: number;
  user: any;
}

const EditVehicle: FC<EditVehicleProps> = ({ vehicleId, user }) => {
  const [vehicleData, setVehicleData] = useState(null);

  useEffect(() => {
    getSpecificGarage(vehicleId).then((data) => {
      setVehicleData(data.data);
    });
    return () => {};
  }, []);

  return (
    <div>
      {vehicleData && (
        <VehicleForm user={user} editMode={true} vehicleData={vehicleData} />
      )}
    </div>
  );
};

export default EditVehicle;
