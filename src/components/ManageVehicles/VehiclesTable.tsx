'use client';

import React, { useState, FC, useEffect } from 'react';
import AppSearch from '../Base/AppSearch';
import AppTableHeader from '../Base/AppTableHeader';
import VehicleTableRow from './VehicleTableRow';
import AppButton from '../Base/AppButton';
import { useRouter } from 'next/navigation';
import VehicleFilter from './VehicleFilter';
import type { Option } from '../Base/AppListBoxOption';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { getAllGarage, getUserGarage } from '@/services/garage';

const headersCommercial = [
  'Brand',
  'Model',
  'Battery Capacity (kWh)',
  'Meter Display',
  'Vehicle Status',
  'Action',
];

const headersAdmin = [
  'Brand',
  'Model',
  'User Name',
  'User Email',
  'Battery Capacity (kWh)',
  'Meter Display',
  'Vehicle Status',
  'Action',
];
interface VehiclesTableProps {
  user: any;
}

const VehiclesTable: FC<VehiclesTableProps> = ({ user }) => {
  const dispatch = useAppDispatch();
  const garageList = useAppSelector(
    (state: RootState) => state?.garage.garageList
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

  const filterAndSearch = (vehicleData: any) => {
    let vehicles = vehicleData;

    // Search
    if (searchValue) {
      vehicles = vehicleData.filter((vehicle: any) => {
        let searchVal = searchValue.toLowerCase();
        const brandMatches = vehicle.brand?.toLowerCase().includes(searchVal);
        const vehicleMatches = vehicle.model?.toLowerCase().includes(searchVal);
        return brandMatches || vehicleMatches;
      });
    }

    // Status
    let statusFilterSelected = filters.filter((option: Option) => {
      return option.type === 'status';
    });
    vehicles = vehicles.filter((cur: any) => {
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

    // Category
    let categoryFilterSelected = filters.filter((option: Option) => {
      return option.type === 'category';
    });

    vehicles = vehicles.filter((cur: any) => {
      if (categoryFilterSelected.length === 0) {
        return true;
      }
      let shouldShow = false;
      categoryFilterSelected.forEach((categoryFilter) => {
        if (categoryFilter.id === 3 && cur.displayMeasurement) {
          shouldShow = true;
        }
      });
      return shouldShow;
    });

    return vehicles;
  };

  let vehicles = garageList ? filterAndSearch(garageList) : null;

  const getEvcByUserHandler = () => {
    if (user?.role === 'admin') {
      dispatch(getAllGarage());
    } else if (user?.role === 'user') {
      dispatch(getUserGarage());
    }
  };

  useEffect(() => {
    getEvcByUserHandler();
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
          <VehicleFilter
            selected={filters}
            selectHandler={selectHandler}
            multiple={true}
            className="sm:w-[190px]"
          />
          {!isAdmin && (
            <AppButton
              primary
              className="min-w-[165px] h-12 px-[30px] py-1"
              onClick={() => {
                router.push('/dashboard/vehicle-management/add-vehicles');
              }}
            >
              <p>Add Vehicle</p>
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
            {vehicles?.map((vehicle: any) => {
              return (
                <VehicleTableRow
                  isAdmin={isAdmin}
                  key={vehicle.id}
                  vehicle={vehicle}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehiclesTable;
