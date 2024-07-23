'use client';

import React, { FC } from 'react';
import { useSession } from 'next-auth/react';
import AddIbanForm from '../Forms/AddIbanForm';
import IbanInfo from './IbanInfo';

interface BankAccountProps {
  hideModal: () => void;
}

const BankAccount: FC<BankAccountProps> = ({ hideModal }) => {
  const { data } = useSession();

  let iban = data?.user?.detail?.bank?.iban || '';

  return (
    <>
      {iban ? (
        <IbanInfo user={data?.user?.detail} hideModal={hideModal} />
      ) : (
        <AddIbanForm hideModal={hideModal} />
      )}
    </>
  );
};

export default BankAccount;
