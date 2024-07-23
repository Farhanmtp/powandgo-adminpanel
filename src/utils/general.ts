//  General Util functions i.e Date, Time, Formula Conversions

export function capitalizeFirstLetter(str: string) {
  if (str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const limitDecimal = (str: string) => {
  if (str.length === 0) {
    return str;
  }
  return parseFloat(str).toFixed(2);
};
