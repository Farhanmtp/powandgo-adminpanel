'use client';

import AppButton from '@/components/Base/AppButton';
import AppSearch from '@/components/Base/AppSearch';
import AppTableHeader from '@/components/Base/AppTableHeader';
import useCurrencyInfo from '@/hooks/useCurrencyInfo';
import { getPlugTypes } from '@/services/plugType';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import ManagePlugTypeTableRow from './ManagePlugTypeTableRow';
import ManagePlugTypeFilter from './ManagePlugTypeFilter';
import { Option } from '@/components/Base/AppListBoxOption';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import PlugType from '@/app/dashboard/setup/plug-type/page';

const headersCommercial = [
  'Plug Type',
  'Plug Power',
  'Plug Suggested Price',
  'Created Date',
];

interface ManagePlugTypeTableProps {
  isProfileComplete: boolean;
  user: any;
}

interface PlugType {
  id: number;
  type: string;
  name: string;
  power: number;
  price: number;
  createdDate?: string;
  isActive?: boolean;
}

const ManagePlugTypeTable: React.FC<ManagePlugTypeTableProps> = ({ user }) => {
  const [plugTypes, setPlugTypes] = useState<PlugType[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState<Option[] | []>([]);
  const plugTypeList = useAppSelector(
    (state: RootState) => state?.plugType.plugTypeList
  );

  const headersAdmin = [
    'Plug Type',
    'Vehicle Type',
    'Plug Power',
    'Plug Suggested Price',
    'Created Date',
    'Action',
  ];

  let isAdmin = user?.role === 'admin';

  const router = useRouter();

  const fetchPlugTypes = async () => {
    try {
      const response = await getPlugTypes();
      setPlugTypes(response.data);
    } catch (error) {
      console.error('Error fetching Plug Types:', error);
    }
  };

  useEffect(() => {
    fetchPlugTypes();
  }, []);

  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const selectHandler = (value: Option | Option[]) => {
    setFilters(value as Option[]);
  };

  const filterAndSearch = (plugTypesData: any) => {
    let allPlugTypes = plugTypes;

    // Search
    if (searchValue) {
      allPlugTypes = plugTypes.filter((plugType: any) => {
        let searchVal = searchValue.toLowerCase();
        const typeMatches = plugType.type?.toLowerCase().includes(searchVal);
        return typeMatches;
      });
    }

    // Status
    let statusFilterSelected = filters.filter((option: Option) => {
      return option.type === 'status';
    });

    allPlugTypes = allPlugTypes.filter((cur: any) => {
      if (statusFilterSelected.length === 0) {
        return true;
      }
      let shouldShow = false;
      statusFilterSelected.forEach((statusFilter) => {
        if (
          (statusFilter.name === 'Active' && cur.isActive) ||
          (statusFilter.name === 'Disabled' && !cur.isActive)
        ) {
          shouldShow = true;
        }
      });
      return shouldShow;
    });

    // vehicleType
    let categoryFilterSelected = filters.filter((option: Option) => {
      return option.type === 'vehicleType';
    });

    allPlugTypes = allPlugTypes.filter((cur: any) => {
      if (categoryFilterSelected.length === 0) {
        return true;
      }
      let shouldShow = false;
      categoryFilterSelected.forEach((categoryFilter) => {
        if (
          (categoryFilter.id === 3 && cur.vehicleType == 'car') ||
          (categoryFilter.id === 4 && cur.vehicleType == 'bicycle')
        ) {
          shouldShow = true;
        }
      });
      return shouldShow;
    });

    return allPlugTypes;
  };

  let allPlugTypes = plugTypeList ? filterAndSearch(plugTypeList) : null;

  return (
    <div className="flex flex-col gap-[40px]">
      {/* Search & Filters */}
      <div className="flex flex-row justify-between items-center flex-wrap gap-[20px]">
        <AppSearch searchValue={searchValue} searchHandler={searchHandler} />
        <div className="flex flex-row gap-[8px] flex-wrap">
          <ManagePlugTypeFilter
            selected={filters}
            selectHandler={selectHandler}
            multiple={true}
            className="sm:w-[190px]"
          />
          <AppButton
            primary
            className="w-[165px] h-12 px-[30px] py-1"
            onClick={() => {
              router.push('/dashboard/setup/plug-type/add-plug-type');
            }}
          >
            <p>Add Plug Type</p>
          </AppButton>
        </div>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <AppTableHeader
            headers={isAdmin ? headersAdmin : headersCommercial}
          />
          <tbody>
            {allPlugTypes?.map((plugType: any) => {
              return (
                <ManagePlugTypeTableRow
                  key={plugType.id}
                  plugType={plugType}
                  isAdmin={isAdmin}
                  user={user}
                  reLoad={fetchPlugTypes}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePlugTypeTable;
