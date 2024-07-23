import React, { FC } from 'react';
import AppModal from '../Base/AppModal';
import CompanyInfo from './CompanyInfo';
import UpdateEmailForm from '../Forms/UpdateEmailForm';
import UpdatePasswordForm from '../Forms/UpdatePasswordForm';
import BankAccount from './BankAccount';
import PreferenceForm from '../Forms/PreferenceForm';
import PaymentMethod from './PaymentMethod';
import VATForm from '../Forms/VATForm';

interface Modal {
  show: boolean;
  name: string;
}

interface DashboardPopupProps {
  hideModal: () => void;
  modal: Modal;
  userId: number;
}

const DashboardPopup: FC<DashboardPopupProps> = ({
  hideModal,
  modal,
  userId,
}) => {
  const componentMapping: Record<string, React.ReactNode> = {
    companyInfo: <CompanyInfo userId={userId} hideModal={hideModal} />,
    updateEmail: <UpdateEmailForm hideModal={hideModal} />,
    updatePassword: <UpdatePasswordForm hideModal={hideModal} />,
    bankAccount: <BankAccount hideModal={hideModal} />,
    preference: <PreferenceForm hideModal={hideModal} />,
    paymentMethod: <PaymentMethod hideModal={hideModal} />,
    addVAT: <VATForm hideModal={hideModal} />,
  };

  const componentToRender = componentMapping[modal.name] || <></>;
  return (
    <>
      <AppModal
        isOpen={modal.show}
        modalHandler={hideModal}
        className="!bg-primary max-h-[80vh] !overflow-y-auto"
      >
        {componentToRender}
      </AppModal>
    </>
  );
};

export default DashboardPopup;
