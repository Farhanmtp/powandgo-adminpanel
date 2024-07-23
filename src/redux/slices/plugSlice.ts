import { createSlice } from '@reduxjs/toolkit';

export interface PlugState {
  plugByAccountType: any;
}

const initialState: PlugState = {
  plugByAccountType: [],
};

export const plugSlice = createSlice({
  name: 'plug',
  initialState,
  reducers: {
    updatePlug: (state, action) => {
      state.plugByAccountType = action.payload;
    },
  },
});

export const { updatePlug } = plugSlice.actions;

export default plugSlice.reducer;
