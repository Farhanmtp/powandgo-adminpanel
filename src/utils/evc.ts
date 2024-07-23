export const canDisableEvc = ({ plugs }: any) => {
  return plugs?.every((plug: any) => !plug?.Booking?.length);
};

export const checkAnyPlugBusy = ({ plugs }: any) => {
  return plugs?.some((plug: any) => plug?.Booking?.length > 0);
};

export const checkIfPowandgo = ({ plugs }: any) => {
  return plugs?.some((plug: any) => plug.isPowandgo);
};

export const getLowestPriceOfPlugs = ({ plugs }: any) => {
  if (plugs?.length === 0) {
    return null; // Handle the case where there are no plugs in the data.
  }

  const lowestPricePlug = plugs.reduce((minPlug: any, plug: any) => {
    return plug.price < minPlug.price ? plug : minPlug;
  }, plugs[0]);

  return lowestPricePlug.price;
};

export const getHighestPowerOfPlugs = ({ plugs }: any) => {
  if (plugs.length === 0) {
    return null; // Handle the case where there are no plugs in the data.
  }

  let highestPower = plugs[0].power;

  for (const plug of plugs) {
    if (plug.power > highestPower) {
      highestPower = plug.power;
    }
  }

  return highestPower;
};
