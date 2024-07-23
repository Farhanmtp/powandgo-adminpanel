export const getHumanReadableDateTime = (date: string) => {
  let currentDate = new Date(date);
  var humanReadableDate = currentDate.toLocaleString();
  return humanReadableDate;
};

export const getHumanReadableDate = (date: string) => {
  let currentDate = new Date(date);
  var humanReadableDate = currentDate.toLocaleDateString();
  return humanReadableDate;
};
