'use client';

import React, { useState, FC, useEffect } from 'react';
import AppSearch from '../Base/AppSearch';
import AppTableHeader from '../Base/AppTableHeader';
import AppButton from '../Base/AppButton';
import { useRouter } from 'next/navigation';
import type { Option } from '../Base/AppListBoxOption';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import VehicleInfoTableRow from './VehicleInfoTableRow';
import VehicleInfoFilter from './VehicleInfoFilter';
import { getAllVehicleInfo } from '@/services/vehicleInfo';

const headersAdmin = [
  'Vehicle Brand',
  'Vehicle Model',
  'Created Date',
  'Action',
];

interface VehicleInfoTableProps {
  user: any;
}

const VehicleInfoTable: FC<VehicleInfoTableProps> = ({ user }) => {
  const dispatch = useAppDispatch();
  const vehicleInfoList = useAppSelector(
    (state: RootState) => state?.vehicleInfo.vehicleInfoList
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

  const filterAndSearch = (vehicleInfoList: any) => {
    let vehicleInfo = vehicleInfoList;

    // Search
    if (searchValue) {
      vehicleInfo = vehicleInfoList.filter((vehicle: any) => {
        let searchVal = searchValue.toLowerCase();
        const modelMatch = vehicle.model?.toLowerCase().includes(searchVal);
        const brandMatch = vehicle.brand?.toLowerCase().includes(searchVal);
        return modelMatch || brandMatch;
      });
    }

    // Vehicle Status
    vehicleInfo = vehicleInfo.filter((cur: any) => {
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

    return vehicleInfo;
  };

  let sortedVehicleInfo = vehicleInfoList
    ? filterAndSearch(vehicleInfoList)
    : null;

  const getVehicleInfoHandler = () => {
    dispatch(getAllVehicleInfo());
  };

  useEffect(() => {
    getVehicleInfoHandler();
    return () => {};
  }, []);

  return (
    <div className="flex flex-col gap-[40px]">
      {/* Search & Filters */}
      <div className="flex flex-row justify-between items-center flex-wrap gap-[20px]">
        <AppSearch
          searchValue={searchValue}
          searchHandler={searchHandler}
          placeholder="Brand / Model"
        />
        {/* <UserFilter /> */}
        <div className="flex flex-row gap-[8px] flex-wrap">
          <VehicleInfoFilter
            selected={filters}
            selectHandler={selectHandler}
            multiple={true}
            className="sm:w-[190px]"
          />
          <AppButton
            primary
            className="h-12 px-[30px] py-1"
            onClick={() => {
              router.push('/dashboard/setup/add-vehicle-info');
            }}
          >
            <p>Add Vehicle Info</p>
          </AppButton>
        </div>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <AppTableHeader headers={headersAdmin} />
          <tbody>
            {sortedVehicleInfo?.map((vehicleInfo: any) => {
              return (
                <VehicleInfoTableRow
                  isAdmin={isAdmin}
                  key={vehicleInfo.id}
                  vehicleInfo={vehicleInfo}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleInfoTable;
