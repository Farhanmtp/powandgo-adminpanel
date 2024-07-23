'use client';

import AppTableHeader from '../Base/AppTableHeader';
import AppSearch from '../Base/AppSearch';
import MyCommissionsRow from './MyCommissionsRow';
import { getAdminCommissions } from '@/services/commission';
import { useState, useEffect } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { useAppDispatch } from '@/redux/hooks';
import {
  getAdminIncomeReceipts,
  getProviderIncomeReceipts,
} from '@/services/payments';
import AppButton from '../Base/AppButton';
import Papa from 'papaparse';

interface ManageMyCommissionsTableProps {
  user: any;
}

const headersAdmin = [
  'Provider type',
  'Commission type',
  'No. of Bookings',
  'Total bill',
  'Commision Rate %',
  'Commission with VAT',
  'Commission w/o VAT',
];

const ManageMyCommissionsTable: React.FC<ManageMyCommissionsTableProps> = ({
  user,
}) => {
  const dispatch = useAppDispatch();

  const [searchValue, setSearchValue] = useState('');

  const incomeReceipts = useAppSelector(
    (state: RootState) => state?.booking.incomeReceipts
  );

  let isAdmin = user?.role === 'admin';

  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  let sortedIncomeReceipts = incomeReceipts;

  const adminCommissions = getAdminCommissions();

  useEffect(() => {
    if (isAdmin) {
      dispatch(getAdminIncomeReceipts());
    } else {
      dispatch(getProviderIncomeReceipts());
    }
    return () => {};
  }, []);

  const downloadCommissions = () => {
    let data = incomeReceipts?.map((cur: any) => {
      return {
        'Provider Type': cur?.provider?.use,
        'Commission type': cur.commissionType,
        'No. of Bookings': cur?.booking?.length,
        'Total bill': cur?.totalAmount,
        'Commision Rate %': cur.commissionRate,
        'Commission with VAT': cur.commission + cur.vat,
        'Commission w/o VAT': cur.commission,
      };
    });
    const csv = Papa.unparse({
      fields: headersAdmin,
      data: data,
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      // feature detection
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'data.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col gap-[40px]">
      {/* Search & Filters */}
      <div className="flex flex-row justify-end items-center flex-wrap gap-[20px]">
        {/* <AppSearch searchValue={searchValue} searchHandler={searchHandler} /> */}
        <AppButton onClick={downloadCommissions} className="px-6 py-3" primary>
          <div>Download</div>
        </AppButton>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <AppTableHeader headers={headersAdmin} />
          <tbody>
            {sortedIncomeReceipts?.map((incomeReceipt: any) => {
              return (
                <MyCommissionsRow
                  key={incomeReceipt.id}
                  incomeReceipt={incomeReceipt}
                  isAdmin={isAdmin}
                  user={user}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageMyCommissionsTable;
