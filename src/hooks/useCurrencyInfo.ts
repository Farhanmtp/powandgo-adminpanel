'use client';

import { useSession } from 'next-auth/react';
import { getCurrencySymbol } from '@/utils/currency';

const useCurrencyInfo = () => {
  const { data } = useSession();

  let user = data?.user.detail;

  let currencyInfo = {
    currency: user?.currency || '',
    currencySymbol: user?.currency ? getCurrencySymbol(user.currency) : '',
  };

  return currencyInfo;
};

export default useCurrencyInfo;
