import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@store';

export type ConfirmDialog = {
  isOpen: boolean;
  onAccept: () => any | null;
  content: string;
  acceptText?: string;
  rejectText?: string;
  header?: string;
};

export type AppState = {
  loading?: boolean;
  confirmDialog: ConfirmDialog;
};

const defaultDialog = {
  isOpen: false,
  onAccept: null,
  content: '',
  acceptText: 'Đồng ý',
  rejectText: 'Hủy',
  header: 'Xác nhận',
};

const initialState: AppState = {
  loading: false,
  confirmDialog: defaultDialog,
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
    },
    openConfirmModal: (
      state,
      action: PayloadAction<Omit<ConfirmDialog, 'isOpen'>>
    ) => {
      const { payload } = action;
      state.confirmDialog = {
        ...defaultDialog,
        isOpen: true,
        ...payload,
      };
    },
    closeConfirmModal: (state) => {
      state.confirmDialog = { ...defaultDialog };
    },
  },
});

export const { updateState, loading, unloading, openConfirmModal, closeConfirmModal } = appSlice.actions;

// selectors
export const selectApp = (state: RootState) => state.app;

export default appSlice.reducer;
