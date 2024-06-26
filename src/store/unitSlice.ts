import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const unitSlice = createSlice({
  name: 'unit',
  initialState: {
    isCelsius: true,
  },
  reducers: {
    toggleUnit(state) {
      state.isCelsius = !state.isCelsius;
    },
    setUnit(state, action: PayloadAction<boolean>) {
      state.isCelsius = action.payload;
    },
  },
});

export const { toggleUnit, setUnit } = unitSlice.actions;
export default unitSlice.reducer;
