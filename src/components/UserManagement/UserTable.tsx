'use client';

import React, { useState, useEffect } from 'react';
import AppSearch from '../Base/AppSearch';
import AppTableHeader from '../Base/AppTableHeader';
import UserTableRow from './UserTableRow';
import { getAppUsers } from '@/services/user';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import UserFilter from './UserFilter';
import type { Option } from '../Base/AppListBoxOption';
import AppDateRange from '../Base/AppDateRange';

const headers = [
  'First Name',
  'Last Name',
  'Email',
  'Provider Type',
  'Registration Date',
  'Action',
];

const UserTable = () => {
  const dispatch = useAppDispatch();
  const appUsers = useAppSelector((state: RootState) => state.user.userList);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState<Option[] | []>([]);
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: 'selection',
      color: '#c6ff36',
    },
  ]);

  const selectHandler = (value: Option | Option[]) => {
    setFilters(value as Option[]);
  };

  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  useEffect(() => {
    dispatch(getAppUsers());

    return () => {};
  }, []);

  const filterAndSearch = (usersData: any) => {
    let users = usersData;

    // Search
    if (searchValue) {
      users = usersData.filter((user: any) => {
        let searchVal = searchValue.toLowerCase();
        const firstNameMatches = user?.firstName
          ?.toLowerCase()
          .includes(searchVal);
        const lastNameMatches = user?.lastName
          ?.toLowerCase()
          .includes(searchVal);
        const emailMatches = user.email?.toLowerCase().includes(searchVal);
        return firstNameMatches || lastNameMatches || emailMatches;
      });
    }

    // Provider Type
    let providerFilterSelected = filters.filter((option: Option) => {
      return option.type === 'providerType';
    });
    users = users.filter((user: any) => {
      if (providerFilterSelected.length === 0) {
        return true;
      }
      let shouldShow = false;
      providerFilterSelected.forEach((providerFilter) => {
        if (
          (providerFilter.id === 1 &&
            user?.use?.toLowerCase() === 'commercial') ||
          (providerFilter.id === 2 &&
            user?.use?.toLowerCase() === 'residential')
        ) {
          shouldShow = true;
        }
      });
      return shouldShow;
    });

    // Active Status

    let activeFilterSelected = filters.filter((option: Option) => {
      return option.type === 'activeStatus';
    });
    users = users.filter((user: any) => {
      if (activeFilterSelected.length === 0) {
        return true;
      }
      let shouldShow = false;
      activeFilterSelected.forEach((activeFilter) => {
        if (
          (activeFilter.id === 3 && user?.isActive) ||
          (activeFilter.id === 4 && !user?.isActive)
        ) {
          shouldShow = true;
        }
      });
      return shouldShow;
    });

    // Registeration Date Range

    if (dateRange?.[0] && dateRange[0].startDate && dateRange[0].endDate) {
      users = users.filter((user: any) => {
        const createdDate = new Date(new Date(user.createdAt).toDateString());

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

    return users;
  };

  let users = appUsers ? filterAndSearch(appUsers) : null;

  return (
    <div className="flex flex-col gap-[40px]">
      {/* Search & Filters */}
      <div className="flex flex-row justify-between items-center flex-wrap gap-[20px]">
        <AppSearch
          searchValue={searchValue}
          searchHandler={searchHandler}
          placeholder="First Name / Last Name / Email"
        />
        <div className="flex flex-row gap-[8px] flex-wrap">
          <AppDateRange
            dateRange={dateRange}
            setDateRange={setDateRange}
            title="Registration Date"
          />
          <UserFilter
            selected={filters}
            selectHandler={selectHandler}
            multiple={true}
            className="sm:w-[190px]"
          />
        </div>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <AppTableHeader headers={headers} />
          <tbody>
            {users.map((user: any) => {
              return <UserTableRow key={user.id} user={user} />;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
