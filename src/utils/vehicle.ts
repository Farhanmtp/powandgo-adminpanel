import { vehicleModelData, plugTypes } from '@/constants/AppConstants';

export const getBrandObjectByName = (brandName: string) => {
  return vehicleModelData.find((brand) => {
    return brand.name.toLowerCase() === brandName.trim().toLowerCase();
  });
};

export const getModelObjectByName = (brandName: string, modelName: string) => {
  let brand = getBrandObjectByName(brandName);
  if (!brand) return null;

  return brand.model.find((model) => {
    return model.name.toLowerCase() === modelName.trim().toLowerCase();
  });
};

export const getPlugObjectByName = (plugType: string) => {
  return plugTypes.find((plug) => {
    return plug.name.toLowerCase() === plugType.trim().toLowerCase();
  });
};

export const checkIfBookingActive = (bookings: any) => {
  return bookings.find((booking: any) => {
    return (
      booking.stage !== 'Complete' &&
      booking.stage !== 'Completed' &&
      booking.stage !== 'Cancelled' &&
      booking.stage !== 'Failed'
    );
  });
};

export const checkIfChargingActive = (chargings: any) => {
  return chargings.find((charging: any) => {
    return (
      charging.stage !== 'Complete' &&
      charging.stage !== 'Completed' &&
      charging.stage !== 'Cancelled' &&
      charging.stage !== 'Failed'
    );
  });
};
