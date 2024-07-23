import { AppDispatch } from './../redux/store';
import apiInstance from '.';
import { updateCommission } from '@/redux/slices/commissionSlice';

export const createCommission =
  (commission: any) => async (dispatch: AppDispatch) => {
    try {
      const response = await apiInstance.post('commission', commission);
      if (
        (response.status === 200 || response.status === 201) &&
        response.data
      ) {
      } else {
        throw new Error('Commission Creation Failed');
      }
    } catch (error) {
      throw error;
    }
  };

export const getAllCommission = () => async (dispatch: AppDispatch) => {
  try {
    const response = await apiInstance.get('commission');
    if (response.status === 200 && response.data) {
      dispatch(updateCommission(response.data.data));
    } else {
      throw new Error('Commission Creation Failed');
    }
  } catch (error) {
    throw error;
  }
};

export const deleteCommission =
  (id: number) => async (dispatch: AppDispatch) => {
    try {
      const response = await apiInstance.delete(`commission/${id}`);
      if (
        response.status !== 200 &&
        response.status !== 201 &&
        !response.data
      ) {
        throw new Error("Garage couldn't be deleted");
      }
    } catch (error) {
      throw error;
    }
  };

export const changeCommissionStatus =
  (id: string, isActive: boolean) => async (dispatch: AppDispatch) => {
    try {
      const response = await apiInstance.post(`commission/status/${id}`, {
        isActive,
      });
      if (
        response.status !== 200 &&
        response.status !== 201 &&
        !response.data
      ) {
        throw new Error('EVC Status Change Failed');
      }
    } catch (error) {
      throw error;
    }
  };

export const getSpecificCommission = async (id: number) => {
  try {
    const response = await apiInstance.get(`commission/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSpecificCommission =
  (id: number, payload: any) => async (dispatch: AppDispatch) => {
    try {
      const response = await apiInstance.patch(`commission/${id}`, payload);
      if (
        response.status !== 200 &&
        response.status !== 201 &&
        !response.data
      ) {
        throw new Error('Commission Not Updated');
      }
    } catch (error) {
      throw error;
    }
  };

export const getAdminCommissions = () => {
  return [
    {
      id: 1,
      providerType: 'Residential',
      commissionType: 'Residential',
      evcName: 'Testing name',
      bookingId: 1,
      totalBill: 5000,
      commissionRate: 2200,
      commissionAmountWithVat: 0,
      commissionAmountWithoutVat: 0,
    },
    {
      id: 2,
      providerType: 'Residential',
      commissionType: 'Residential',
      evcName: 'Testing name',
      bookingId: 1,
      totalBill: 5000,
      commissionRate: 2200,
      commissionAmountWithVat: 0,
      commissionAmountWithoutVat: 0,
    },
    {
      id: 3,
      providerType: 'Residential',
      commissionType: 'Residential',
      evcName: 'Testing name',
      bookingId: 1,
      totalBill: 5000,
      commissionRate: 2200,
      commissionAmountWithVat: 0,
      commissionAmountWithoutVat: 0,
    },
    {
      id: 4,
      providerType: 'Residential',
      commissionType: 'Residential',
      evcName: 'Testing name',
      bookingId: 1,
      totalBill: 5000,
      commissionRate: 2200,
      commissionAmountWithVat: 0,
      commissionAmountWithoutVat: 0,
    },
  ];
};
