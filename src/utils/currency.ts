export const getCurrencySymbol = (currency: string) => {
  switch (currency.toLowerCase()) {
    case 'eur':
      return '€';
    case 'gbp':
      return '£';
    default:
      return '';
  }
};
