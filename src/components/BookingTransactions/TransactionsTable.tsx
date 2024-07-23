'use client';

import React, { useState, FC, useEffect } from 'react';
import AppSearch from '../Base/AppSearch';
import AppTableHeader from '../Base/AppTableHeader';
import type { Option } from '../Base/AppListBoxOption';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import TransactionsFilter from './TransactionsFilter';
import TransactionsTableRow from './TransactionsTableRow';
import {
  getAllInvoice,
  getProviderInvoice,
} from '@/services/bookingTransactions';
import AppDateRange from '../Base/AppDateRange';
import useCurrencyInfo from '@/hooks/useCurrencyInfo';

interface TransactionsTableProps {
  user: any;
}

const TransactionsTable: FC<TransactionsTableProps> = ({ user }) => {
  const dispatch = useAppDispatch();

  const bookingTransactionsList = useAppSelector(
    (state: RootState) => state?.bookingTransactions.bookingTransactionsList
  );

  const { currencySymbol } = useCurrencyInfo();

  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState<Option[] | []>([]);
  const [transactionDate, setTransactionDate] = useState({
    startDate: '',
    endDate: '',
  });
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: 'selection',
      color: '#c6ff36',
    },
  ]);
  const headersCommercial = [
    'Invoice ID/No.',
    'Booking Type',
    'Booking Status',
    'Booking Date Time',
    'KW Charged (kWh)',
    `Total amount (${currencySymbol})`,
    'Action',
  ];

  const headersAdmin = [
    'Invoice ID/No.',
    'First Name',
    'Last Name',
    'User Email',
    'Booking Type',
    'Booking Status',
    'Booking Date Time',
    'KW Charged (kWh)',
    `Total amount (${currencySymbol})`,
  ];

  const selectHandler = (value: Option | Option[]) => {
    setFilters(value as Option[]);
  };

  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  let isAdmin = user?.role === 'admin';

  const filterAndSearch = (transactionsData: any) => {
    let transactions = transactionsData;

    // Search
    if (searchValue) {
      transactions = transactionsData.filter((transaction: any) => {
        let searchVal = searchValue.toLowerCase();
        const firstNameMatch = transaction.consumer.firstName
          ?.toLowerCase()
          .includes(searchVal);
        const lastNameMatch = transaction.consumer.lastName
          ?.toLowerCase()
          .includes(searchVal);
        return firstNameMatch || lastNameMatch;
      });
    }

    // Status
    let statusFilterSelected = filters.filter((option: Option) => {
      return option.type === 'status';
    });
    transactions = transactions.filter((cur: any) => {
      if (statusFilterSelected.length === 0) {
        return true;
      }
      let shouldShow = false;
      statusFilterSelected.forEach((statusFilter) => {
        if (
          (statusFilter.name === 'Cancelled' &&
            cur?.booking?.stage?.toLowerCase() === 'cancelled') ||
          (statusFilter.name === 'Charge & Paid' &&
            cur?.booking?.stage?.toLowerCase() === 'completed')
        ) {
          shouldShow = true;
        }
      });
      return shouldShow;
    });

    // Type
    let typeFilterSelected = filters.filter((option: Option) => {
      return option.type === 'type';
    });

    transactions = transactions.filter((cur: any) => {
      if (typeFilterSelected.length === 0) {
        return true;
      }
      let shouldShow = false;
      typeFilterSelected.forEach((typeFilter) => {
        if (
          (typeFilter.name === 'Reservation' &&
            cur?.booking?.type?.toLowerCase() === 'reservation') ||
          (typeFilter.name === 'Booking' &&
            cur?.booking?.type?.toLowerCase() === 'booking')
        ) {
          shouldShow = true;
        }
      });
      return shouldShow;
    });

    // Date Range

    if (dateRange?.[0] && dateRange[0].startDate && dateRange[0].endDate) {
      transactions = transactions.filter((cur: any) => {
        const createdDate = new Date(
          new Date(cur.booking.startTime).toDateString()
        );

        if (dateRange[0].startDate === null || dateRange[0].endDate === null) {
          return false;
        }

        const startDate = new Date(
          (dateRange[0].startDate as Date).toDateString()
        );
        const endDate = new Date((dateRange[0].endDate as Date).toDateString());

        if (createdDate >= startDate && createdDate <= endDate) {
          return true;
        } else {
          return false;
        }
      });
    }
    return transactions;
  };

  let transactions = bookingTransactionsList
    ? filterAndSearch(bookingTransactionsList)
    : null;

  const getTransactionsByUserHandler = () => {
    if (user?.role === 'admin') {
      dispatch(getAllInvoice());
    } else if (user?.role === 'user') {
      dispatch(getProviderInvoice());
    }
  };

  useEffect(() => {
    getTransactionsByUserHandler();
    return () => {};
  }, []);

  const transactionDateHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTransactionDate((cur) => {
      return {
        ...cur,
        [event.target.name]: event.target.value,
      };
    });
  };

  return (
    <div className="flex flex-col gap-[40px]">
      {/* Search & Filters */}
      <div className="flex flex-row justify-between items-center flex-wrap gap-[20px]">
        <div>
          {isAdmin && (
            <AppSearch
              searchValue={searchValue}
              searchHandler={searchHandler}
              placeholder="First Name / Last Name"
            />
          )}
        </div>

        {/* <UserFilter /> */}
        <div className="flex flex-row gap-[8px] flex-wrap">
          <AppDateRange
            dateRange={dateRange}
            setDateRange={setDateRange}
            title="Transaction Period"
          />
          <TransactionsFilter
            selected={filters}
            selectHandler={selectHandler}
            multiple={true}
            className="sm:w-[190px]"
            transactionDateHandler={transactionDateHandler}
            transactionDate={transactionDate}
          />
        </div>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <AppTableHeader
            headers={isAdmin ? headersAdmin : headersCommercial}
          />
          <tbody>
            {transactions?.map((transaction: any) => {
              return (
                <TransactionsTableRow
                  isAdmin={isAdmin}
                  key={transaction.id}
                  transaction={transaction}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsTable;
