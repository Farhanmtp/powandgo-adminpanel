'use client';

import React, { useState, FC, useEffect } from 'react';
import AppSearch from '../Base/AppSearch';
import AppTableHeader from '../Base/AppTableHeader';
import AppButton from '../Base/AppButton';
import { useRouter } from 'next/navigation';
import type { Option } from '../Base/AppListBoxOption';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import BookingsTableRow from './BookingTableRow';
import BookingsFilter from './BookingFilter';
import { getBookingsByAdmin, getBookingsOfProvider } from '@/services/booking';
import AppDateRange from '../Base/AppDateRange';
import useCurrencyInfo from '@/hooks/useCurrencyInfo';

interface BookingTableProps {
  user: any;
}

const BookingTable: FC<BookingTableProps> = ({ user }) => {
  const dispatch = useAppDispatch();
  const bookingList = useAppSelector(
    (state: RootState) => state?.booking.bookingList
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

  const headers = [
    'Booking Id',
    'First Name',
    'Last Name',
    'Email',
    'EVC Name',
    'Plug Type',
    'Booking Type',
    'Booking Time',
    'Booking Status',
    `Total Amount (${currencySymbol})`,
  ];

  const filterAndSearch = (bookingList: any) => {
    let bookings = bookingList;

    // Search
    if (searchValue) {
      bookings = bookingList.filter((booking: any) => {
        let searchVal = searchValue.toLowerCase();
        const firstNameMatch = booking.consumer.firstName
          ?.toLowerCase()
          .includes(searchVal);
        const lastNameMatch = booking.consumer.lastName
          ?.toLowerCase()
          .includes(searchVal);
        const evcNameMatch = booking.evc.name
          ?.toLowerCase()
          .includes(searchVal);
        const plugTypeMatch = booking.plug.type
          ?.toLowerCase()
          .includes(searchVal);
        return firstNameMatch || lastNameMatch || evcNameMatch || plugTypeMatch;
      });
    }

    bookings = bookings.filter((cur: any) => {
      if (filters.length === 0) {
        return true;
      }
      let bookingStage = cur?.stage?.toLowerCase() || '';
      let shouldShow = false;
      filters.forEach((stageFilter) => {
        if (
          (stageFilter.id === 1 && !bookingStage) ||
          (stageFilter.id === 2 && bookingStage === 'charging') ||
          (stageFilter.id === 3 && bookingStage === 'pending confirm') ||
          (stageFilter.id === 4 && bookingStage === 'completed') ||
          (stageFilter.id === 5 &&
            bookingStage === 'charged and pending payment') ||
          (stageFilter.id === 6 && bookingStage === 'cancelled')
        ) {
          shouldShow = true;
        }
      });
      return shouldShow;
    });

    // Date Range

    if (dateRange?.[0] && dateRange[0].startDate && dateRange[0].endDate) {
      bookings = bookings.filter((cur: any) => {
        const createdDate = new Date(new Date(cur.startTime).toDateString());

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

    return bookings;
  };

  let sortedBookings = bookingList ? filterAndSearch(bookingList) : null;

  useEffect(() => {
    if (isAdmin) {
      dispatch(getBookingsByAdmin());
    } else {
      dispatch(getBookingsOfProvider());
    }
    return () => {};
  }, []);

  return (
    <div className="flex flex-col gap-[40px]">
      {/* Search & Filters */}
      <div className="flex flex-row justify-between items-center flex-wrap gap-[20px]">
        <AppSearch
          searchValue={searchValue}
          searchHandler={searchHandler}
          placeholder="User Name / EVC name / Plug Type"
        />
        <div className="flex flex-row gap-[8px] flex-wrap">
          <AppDateRange
            dateRange={dateRange}
            setDateRange={setDateRange}
            title="Booking Date"
          />
          <BookingsFilter
            selected={filters}
            selectHandler={selectHandler}
            multiple={true}
            className="sm:w-[220px]"
          />
        </div>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <AppTableHeader headers={headers} />
          <tbody>
            {sortedBookings?.map((booking: any) => {
              return (
                <BookingsTableRow
                  isAdmin={isAdmin}
                  key={booking.id}
                  booking={booking}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingTable;
