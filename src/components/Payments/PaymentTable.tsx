'use client';

import React, { useState, FC, useEffect } from 'react';
import AppSearch from '../Base/AppSearch';
import AppTableHeader from '../Base/AppTableHeader';
import { useRouter } from 'next/navigation';
import type { Option } from '../Base/AppListBoxOption';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import useCurrencyInfo from '@/hooks/useCurrencyInfo';
import PaymentTableRow from './PaymentTableRow';
import {
  getProviderIncomeReceipts,
  getAdminIncomeReceipts,
} from '@/services/payments';
import AppButton from '../Base/AppButton';
import Papa from 'papaparse';
import { getHumanReadableDate } from '@/utils/dateTime';
import PaymentFilter from './PaymentFilter';
import AppDateRange from '../Base/AppDateRange';
import { date } from 'yup';
import { start } from 'repl';

const headers = [
  'Invoice ID',
  'EVC Name',
  'No. of Bookings',
  'Payment Month',
  'Payment Status',
  'Transfer Date',
  `Total Amount`,
  'Action',
];

interface PaymentTableProps {
  user: any;
}

const PaymentTable: FC<PaymentTableProps> = ({ user }) => {
  const dispatch = useAppDispatch();
  const incomeReceipts = useAppSelector(
    (state: RootState) => state?.booking.incomeReceipts
  );
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();
  const [filters, setFilters] = useState<Option[] | []>([]);
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: 'selection',
      color: '#c6ff36',
    },
  ]);

  const { currencySymbol } = useCurrencyInfo();

  const selectHandler = (value: Option | Option[]) => {
    setFilters(value as Option[]);
  };

  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  let isAdmin = user?.role === 'admin';

  const filterAndSearch = (incomeReceiptsList: any) => {
    let incomeReceipts = incomeReceiptsList;

    // Search
    if (searchValue) {
      incomeReceipts = incomeReceipts.filter((income: any) => {
        let searchVal = searchValue.toLowerCase();

        let evcNameMatch = income.booking?.some((cur: any) => {
          return cur?.evc?.name?.toLowerCase().includes(searchVal) || null;
        });

        return evcNameMatch;
      });
    }

    // Date Range

    if (dateRange?.[0] && dateRange[0].startDate && dateRange[0].endDate) {
      incomeReceipts = incomeReceipts.filter((cur: any) => {
        const createdDate = new Date(new Date(cur.transferDate).toDateString());

        if (dateRange[0].startDate === null || dateRange[0].endDate === null) {
          return false;
        }

        const startDate = new Date(
          (dateRange[0].startDate as Date).toDateString()
        );
        console.log('Start Date is ', startDate);
        const endDate = new Date((dateRange[0].endDate as Date).toDateString());
        console.log('End Date is ', endDate);

        if (createdDate >= startDate && createdDate <= endDate) {
          return true;
        } else {
          return false;
        }
      });
    }

    // Category
    let providerTypeFiltersSelected = filters.filter((option: Option) => {
      return option.type === 'providerType';
    });

    incomeReceipts = incomeReceipts.filter((cur: any) => {
      if (providerTypeFiltersSelected.length === 0) {
        return true;
      }
      let shouldShow = false;
      providerTypeFiltersSelected.forEach((typeFilter) => {
        if (
          (typeFilter.id === 1 &&
            cur.provider.use.toLowerCase() === 'commercial') ||
          (typeFilter.id === 2 &&
            cur.provider.use.toLowerCase() === 'residential')
        ) {
          shouldShow = true;
        }
      });
      return shouldShow;
    });

    return incomeReceipts;
  };

  let sortedIncomeReceipts = incomeReceipts
    ? filterAndSearch(incomeReceipts)
    : null;

  useEffect(() => {
    if (isAdmin) {
      dispatch(getAdminIncomeReceipts());
    } else {
      dispatch(getProviderIncomeReceipts());
    }
    return () => {};
  }, []);

  const downloadCommissions = () => {
    const headers = [
      'Invoice ID',
      'EVC Name',
      'No. of Bookings',
      'Payment Month',
      'Payment Status',
      'Transfer Date',
      `Total Amount`,
    ];
    let data = incomeReceipts?.map((payment: any) => {
      let evcNames = payment.booking
        ?.map((cur: any) => {
          return cur?.evc?.name || null;
        })
        .join(', ');

      let numberOfBookings = payment?.booking?.length || 0;

      return {
        'Invoice ID': payment.receiptNumber,
        'EVC Name': evcNames,
        'No. of Bookings': numberOfBookings,
        'Payment Month': payment.paymentMonth,
        'Payment Status': payment.paymentStatus,
        'Transfer Date': getHumanReadableDate(payment.transferDate),
        'Total Amount': payment.amountPaid,
      };
    });

    const csv = Papa.unparse({
      fields: headers,
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
      <div className="flex flex-row justify-between items-center flex-wrap gap-[20px]">
        <AppSearch
          searchValue={searchValue}
          searchHandler={searchHandler}
          placeholder="EVC Name"
        />
        <div className="flex flex-row gap-[8px] flex-wrap">
          <AppDateRange
            dateRange={dateRange}
            setDateRange={setDateRange}
            title="Transfer Date"
          />

          {isAdmin && (
            <PaymentFilter
              selected={filters}
              selectHandler={selectHandler}
              multiple={true}
              className="sm:w-[190px]"
            />
          )}

          {sortedIncomeReceipts.length ? (
            <AppButton
              onClick={downloadCommissions}
              className="px-6 py-3"
              primary
            >
              <div>Download</div>
            </AppButton>
          ) : (
            <></>
          )}
        </div>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <AppTableHeader headers={headers} />
          <tbody>
            {sortedIncomeReceipts?.map((payment: any) => {
              return (
                <PaymentTableRow
                  isAdmin={isAdmin}
                  key={payment.id}
                  payment={payment}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentTable;
