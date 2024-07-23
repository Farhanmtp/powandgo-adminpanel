import { createSlice } from '@reduxjs/toolkit';

export interface vat {}

export interface vatState {
  vatList: vat[];
}

const initialState: vatState = {
  vatList: [],
};

export const vatSlice = createSlice({
  name: 'vatList',
  initialState,
  reducers: {
    updateVatList: (state, action) => {
      state.vatList = action.payload;
    },
  },
});

export const { updateVatList } = vatSlice.actions;

export default vatSlice.reducer;
