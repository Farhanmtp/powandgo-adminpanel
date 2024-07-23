'use client';

import React, { useState, useEffect } from 'react';
import AppSearch from '../Base/AppSearch';
import AppTableHeader from '../Base/AppTableHeader';
import ManageEvcTableRow from './ManageEvcTableRow';
import { getEvcByUser, getEvcByAdmin } from '@/services/evc';
import { RootState } from '@/redux/store';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import AppButton from '../Base/AppButton';
import AppPlaceholder from '../Base/AppPlaceholder';
import { Option } from '../Base/AppFilter';
import { checkIfPowandgo, checkAnyPlugBusy } from '@/utils/evc';
import ManageEvcFilter from './ManageEvcFilter';
import { useRouter } from 'next/navigation';
import useCurrencyInfo from '@/hooks/useCurrencyInfo';

const headersCommercial = [
  'EVC Name',
  'EVC Rating',
  'EVC Location',
  'No of Plugs',
  'Category',
  'EVC Status',
  'Action',
];

interface ManageEvcTableProps {
  isProfileComplete: boolean;
  user: any;
}

const ManageEvcTable: React.FC<ManageEvcTableProps> = ({
  isProfileComplete,
  user,
}) => {
  const dispatch = useAppDispatch();
  const usersEvc = useAppSelector((state: RootState) => state?.evc?.usersEvc);
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState<Option[] | []>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { currencySymbol } = useCurrencyInfo();

  const headersAdmin = [
    'EVC Name',
    'EVC Rating',
    'EVC Location',
    'User Name',
    'User Email',
    'Plug',
    `Price (${currencySymbol})`,
    'Power (kWh)',
    'Category',
    'EVC Status',
    'Action',
  ];

  let isAdmin = user?.role === 'admin';

  const selectHandler = (value: Option | Option[]) => {
    setFilters(value as Option[]);
  };

  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  const applyFilter = (filterIds: number[], evcs: any) => {
    const filteredEvcs: any = [];

    filterIds?.forEach((filterId) => {
      evcs?.forEach((evc: any) => {
        let shouldInclude = true;

        switch (filterId) {
          case 1:
            shouldInclude = shouldInclude && evc.isActive;
            break;
          case 2:
            shouldInclude = shouldInclude && !evc.isActive && !evc.isBusy;
            break;
          case 3:
            shouldInclude = shouldInclude && evc?.isBusy;
            break;
          default:
            // Handle unknown filters
            break;
        }

        if (
          shouldInclude &&
          !filteredEvcs.some((filteredEvc: any) => filteredEvc.id === evc.id)
        ) {
          filteredEvcs.push(evc);
        }
      });
    });

    return filteredEvcs;
  };

  const filterAndSearch = (usersEvc: any) => {
    let evcs = usersEvc;

    // Search functionality
    if (searchValue) {
      evcs = evcs.filter((evc: any) => {
        const nameMatches = evc.name
          ?.toLowerCase()
          .includes(searchValue?.toLowerCase());
        return nameMatches;
      });
    }

    let filterIds = filters?.map((filter) => filter.id);

    let statusFilterIds = filterIds.filter((id) => id !== 4);
    if (statusFilterIds.length) {
      evcs = applyFilter(
        filterIds.filter((id) => id !== 4),
        evcs
      );
    }

    if (filters.length && filterIds?.includes(4)) {
      evcs = evcs?.filter((evc: any) => checkIfPowandgo({ plugs: evc?.plugs }));
    }

    evcs = evcs.filter((evc: any) => typeof evc.scheduler === 'string');

    return evcs;
  };

  let evcs = usersEvc ? filterAndSearch(usersEvc) : null;

  const getEvcByUserHandler = () => {
    if (user?.role === 'admin') {
      dispatch(getEvcByAdmin());
    } else if (user?.role === 'user') {
      dispatch(getEvcByUser());
    }
  };

  useEffect(() => {
    getEvcByUserHandler();
    return () => {};
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = evcs
    ? evcs.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  return (
    <div className="flex flex-col gap-[40px]">
      {/* Search & Filters */}
      <div className="flex flex-row justify-between items-center flex-wrap gap-[20px]">
        <AppSearch searchValue={searchValue} searchHandler={searchHandler} />
        <div className="flex flex-row gap-[8px] flex-wrap">
          <ManageEvcFilter
            selected={filters}
            selectHandler={selectHandler}
            multiple={true}
            className="sm:w-[190px]"
          />
          {!isAdmin && (
            <AppButton
              primary
              className="w-[165px] h-12 px-[30px] py-1"
              onClick={() => {
                router.push('/dashboard/evc-management/add-evc');
              }}
            >
              <p>Add EVC</p>
            </AppButton>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <AppTableHeader
            headers={isAdmin ? headersAdmin : headersCommercial}
          />
          <tbody>
            {currentItems?.map((evc: any) => {
              return (
                <ManageEvcTableRow
                  key={evc.id}
                  evc={evc}
                  isAdmin={isAdmin}
                  user={user}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-end items-center gap-[8px] mt-[20px]">
        <AppButton
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </AppButton>
        <span>{currentPage}</span>
        <AppButton
          onClick={() => paginate(currentPage + 1)}
          disabled={currentItems.length == 0}
        >
          Next
        </AppButton>
      </div>
    </div>
  );
};

export default ManageEvcTable;
