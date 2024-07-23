'use client';

import React, { useState, FC, useEffect } from 'react';
import AppSearch from '../Base/AppSearch';
import AppTableHeader from '../Base/AppTableHeader';
import AppButton from '../Base/AppButton';
import { useRouter } from 'next/navigation';
import type { Option } from '../Base/AppListBoxOption';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import ManageVatFilter from './ManageVatFilter';
import ManageVatTableRow from './ManageVatTableRow';
import { getVAT } from '@/services/vat';

const headersAdmin = [
  'Country Name',
  'Country Code',
  'VAT Rate (%)',
  'Created Date',
  'Action',
];

interface ManageVatTableProps {}

const ManageVatTable: FC<ManageVatTableProps> = () => {
  const dispatch = useAppDispatch();
  const vatList = useAppSelector((state: RootState) => state?.vat.vatList);
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();
  const [filters, setFilters] = useState<Option[] | []>([]);

  const selectHandler = (value: Option | Option[]) => {
    setFilters(value as Option[]);
  };

  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const filterAndSearch = (vatList: any) => {
    let vats = vatList;

    // Search
    if (searchValue) {
      vats = vatList.filter((vat: any) => {
        let searchVal = searchValue.toLowerCase();
        const countryNameMatch = vat.countryName
          ?.toLowerCase()
          .includes(searchVal);
        return countryNameMatch;
      });
    }

    vats = vats.filter((cur: any) => {
      if (filters.length === 0) {
        return true;
      }
      let shouldShow = false;
      filters.forEach((statusFilter) => {
        if (
          (statusFilter.id === 1 && cur.isActive) ||
          (statusFilter.id === 2 && !cur.isActive)
        ) {
          shouldShow = true;
        }
      });
      return shouldShow;
    });

    return vats;
  };

  let sortedVat = vatList ? filterAndSearch(vatList) : null;

  useEffect(() => {
    dispatch(getVAT());
    return () => {};
  }, []);

  return (
    <div className="flex flex-col gap-[40px]">
      {/* Search & Filters */}
      <div className="flex flex-row justify-between items-center flex-wrap gap-[20px]">
        <AppSearch
          searchValue={searchValue}
          searchHandler={searchHandler}
          placeholder="Country Name"
        />
        {/* <UserFilter /> */}
        <div className="flex flex-row gap-[8px] flex-wrap">
          <ManageVatFilter
            selected={filters}
            selectHandler={selectHandler}
            multiple={true}
            className="sm:w-[150px]"
          />
          <AppButton
            primary
            className="h-12 px-[30px] py-1"
            onClick={() => {
              router.push('/dashboard/setup/vat/add-vat');
            }}
          >
            <p>Add VAT</p>
          </AppButton>
        </div>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <AppTableHeader headers={headersAdmin} />
          <tbody>
            {sortedVat?.map((vat: any) => {
              return <ManageVatTableRow key={vat.id} vat={vat} />;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageVatTable;
