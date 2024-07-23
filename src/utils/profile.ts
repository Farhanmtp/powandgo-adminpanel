const userRequiredFields: { [key: string]: string } = {
  companyName: 'Company Info',
  dateOfIncorporation: 'Date of Incorporation',
  vat: 'VAT',
  fiscalCode: 'Fiscal Code',
  contactNumber: 'Contact Number',
  legalAddress: 'Legal Address',
  city: 'City',
  postalCode: 'Postal Code',
  country: 'Country',
  designation: 'Designation',
  firstName: 'First Name',
  lastName: 'Last Name',
  contactPersonEmail: 'Contact Person Email',
};

export const checkProfileComplete = ({ user, toCheck }: any) => {
  if (user?.use?.toLowerCase() === 'admin') {
    return { isProfileComplete: true, missingFields: [] };
  }
  if (!user) return { isProfileComplete: false, missingFields: [] };

  const missingAccountInfo = [];

  if (toCheck.includes('account_info')) {
    for (const fieldName of Object.keys(userRequiredFields)) {
      if (!user[fieldName]) {
        missingAccountInfo.push({
          name: fieldName,
          displayName: userRequiredFields[fieldName],
        });
      }
    }
  }

  if (toCheck.includes('payment')) {
    if (!user.payment?.length || !user.payment[0]?.tokenId) {
      missingAccountInfo.push({
        name: 'payment',
        displayName: 'Payment Details',
      });
    }
  }

  if (toCheck.includes('bank')) {
    if (!user.bank || !user.bank?.iban) {
      missingAccountInfo.push({
        name: 'bank',
        displayName: 'Bank Account',
      });
    }
  }

  console.error('missingAccountInfo', missingAccountInfo);

  return {
    isProfileComplete: missingAccountInfo.length ? false : true,
    missingAccountInfo,
  };
};

export const reloadSession = () => {
  const event = new Event('visibilitychange');
  document.dispatchEvent(event);
};
