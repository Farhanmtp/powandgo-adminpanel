import { createSlice } from '@reduxjs/toolkit';

export interface CommonState {
  toastMessage: { type: string; message: string; duration: number };
  loading: boolean;
}

const initialState: CommonState = {
  toastMessage: {
    type: 'info',
    message: '',
    duration: 3000,
  },
  loading: false,
};

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    showNotification: (state, action) => {
      state.toastMessage = action.payload;
    },
    clearNotification: (state) => {
      state.toastMessage = initialState.toastMessage;
    },
    startLoading: (state) => {
      state.loading = true;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
  },
});

export const {
  showNotification,
  clearNotification,
  startLoading,
  stopLoading,
} = commonSlice.actions;

export default commonSlice.reducer;
