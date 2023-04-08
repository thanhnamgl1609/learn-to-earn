import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@store';

export type AppState = {
  loading?: boolean;
};

const initialState: AppState = {
  loading: false,
};

export const appSlice = createSlice({
  initialState,
  name: 'apps',
  reducers: {
    updateState: (state, action: PayloadAction<AppState>) => {
      Object.assign(state, action.payload);
    },
    loading: (state) => {
      state.loading = true;
    },
    unloading: (state) => {
      state.loading = false;
    }
  },
});

export const { updateState, loading, unloading } = appSlice.actions;

// selectors
export const selectApp = (state: RootState) => state.app;

export default appSlice.reducer;
