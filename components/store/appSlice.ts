import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@store';

type AppState = {
  loading?: boolean;
  initialUser?: boolean;
};

const initialState: AppState = {
  loading: false,
  initialUser: false,
};

export const appSlice = createSlice({
  initialState,
  name: 'apps',
  reducers: {
    updateState: (state, action: PayloadAction<AppState>) => {
      Object.assign(state, action.payload);
    },
    reInitUser: (state) => {
      state.initialUser = false;
    },
    loading: (state) => {
      state.loading = true;
    },
    unloading: (state) => {
      state.loading = false;
    }
  },
});

export const { updateState, reInitUser, loading, unloading } = appSlice.actions;

// selectors
export const selectApp = (state: RootState) => state.app;

export default appSlice.reducer;
