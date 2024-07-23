import plugTypeReducer from './slices/plugTypeSlice';
import { configureStore } from '@reduxjs/toolkit';
import EvcRedcuder from './slices/evcSlice';
import thunk from 'redux-thunk';
import commonReducer from './slices/commonSlice';
import garageReducer from './slices/garageSlice';
import bookingConfigReducer from './slices/bookingConflgSlice';
import bookingTransactionsReducer from './slices/bookingTransactionsSlice';
import commissionReducer from './slices/commissionSlice';
import userReducer from './slices/userSlice';
import vehicleInfoReducer from './slices/vehicleInfoSlice';
import bookingsReducer from './slices/booking';
import vatReducer from './slices/vat';

export const store = configureStore({
  reducer: {
    evc: EvcRedcuder,
    common: commonReducer,
    garage: garageReducer,
    bookingConfig: bookingConfigReducer,
    bookingTransactions: bookingTransactionsReducer,
    booking: bookingsReducer,
    commission: commissionReducer,
    user: userReducer,
    plugType: plugTypeReducer,
    vehicleInfo: vehicleInfoReducer,
    vat: vatReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
