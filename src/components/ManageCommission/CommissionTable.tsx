'use client';

import React, { useState, FC, useEffect } from 'react';
import AppSearch from '../Base/AppSearch';
import AppTableHeader from '../Base/AppTableHeader';
import AppButton from '../Base/AppButton';
import { useRouter } from 'next/navigation';
import type { Option } from '../Base/AppListBoxOption';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import CommissionTableRow from './CommissionTableRow';
import CommissionFilter from './CommissionFilter';
import { getAllCommission } from '@/services/commission';

const headersAdmin = [
  'Commission Type',
  'Provider Type',
  'EVC Name',
  'Commission Rate (%)',
  'Created Date',
  'Status',
  'Action',
];

interface CommissionTableProps {
  user: any;
}

const CommissionTable: FC<CommissionTableProps> = ({ user }) => {
  const dispatch = useAppDispatch();
  const commissionList = useAppSelector(
    (state: RootState) => state?.commission.commissionList
  );
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();
  const [filters, setFilters] = useState<Option[] | []>([]);

  const selectHandler = (value: Option | Option[]) => {
    setFilters(value as Option[]);
  };

  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  let isAdmin = user?.role === 'admin';

  const filterAndSearch = (commissionList: any) => {
    let commissions = commissionList;

    // Search
    if (searchValue) {
      commissions = commissionList.filter((commission: any) => {
        let searchVal = searchValue.toLowerCase();
        let evcNames = commission.evcs.map((evc: any) => evc.name);
        return evcNames.some((name: string) =>
          name.toLowerCase().includes(searchVal)
        );
      });
    }

    // Commission Type
    let commissionTypeFiltersSelected = filters.filter((option: Option) => {
      return option.type === 'commissionType';
    });
    commissions = commissions.filter((cur: any) => {
      if (commissionTypeFiltersSelected.length === 0) {
        return true;
      }
      let shouldShow = false;
      commissionTypeFiltersSelected.forEach((typeFilter) => {
        if (
          (typeFilter.id === 1 && !cur.isCustom) ||
          (typeFilter.id === 2 && cur.isCustom)
        ) {
          shouldShow = true;
        }
      });
      return shouldShow;
    });

    // Category
    let providerTypeFiltersSelected = filters.filter((option: Option) => {
      return option.type === 'providerType';
    });

    commissions = commissions.filter((cur: any) => {
      if (providerTypeFiltersSelected.length === 0) {
        return true;
      }
      let shouldShow = false;
      providerTypeFiltersSelected.forEach((typeFilter) => {
        if (
          (typeFilter.id === 3 &&
            cur.providerType.toLowerCase() === 'commercial') ||
          (typeFilter.id === 4 &&
            cur.providerType.toLowerCase() === 'residential')
        ) {
          shouldShow = true;
        }
      });
      return shouldShow;
    });

    return commissions;
  };

  let commissions = commissionList ? filterAndSearch(commissionList) : null;

  // Custom sorting function
  const sortByIsCustom = (a: any, b: any) => {
    if (!a.isCustom && b.isCustom) {
      return -1;
    } else if (a.isCustom && !b.isCustom) {
      return 1;
    } else {
      // For elements with the same isCustom value, maintain their original order
      return 0;
    }
  };

  let sortedCommissions = commissions.sort(sortByIsCustom);

  const getCommissionHandler = () => {
    dispatch(getAllCommission());
  };

  useEffect(() => {
    getCommissionHandler();
    return () => {};
  }, []);

  return (
    <div className="flex flex-col gap-[40px]">
      {/* Search & Filters */}
      <div className="flex flex-row justify-between items-center flex-wrap gap-[20px]">
        <AppSearch
          searchValue={searchValue}
          searchHandler={searchHandler}
          placeholder="EVC Name"
        />
        {/* <UserFilter /> */}
        <div className="flex flex-row gap-[8px] flex-wrap">
          <CommissionFilter
            selected={filters}
            selectHandler={selectHandler}
            multiple={true}
            className="sm:w-[190px]"
          />
          <AppButton
            primary
            className="h-12 px-[30px] py-1"
            onClick={() => {
              router.push('/dashboard/commission-management/add-commission');
            }}
          >
            <p>Add Commission</p>
          </AppButton>
        </div>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <AppTableHeader headers={headersAdmin} />
          <tbody>
            {sortedCommissions?.map((commission: any) => {
              return (
                <CommissionTableRow
                  isAdmin={isAdmin}
                  key={commission.id}
                  commission={commission}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommissionTable;
