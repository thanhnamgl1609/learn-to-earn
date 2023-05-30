import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '@store';
import CONST from '@config/constants.json';

const { CONFIRM_DIALOG_LEVEL } = CONST.UI;

export type ConfirmDialog = {
  isOpen: boolean;
  onAccept: () => any | null;
  content: string | JSX.Element;
  type?: string;
  acceptText?: string;
  rejectText?: string;
  header?: string;
};

export type AppState = {
  loading?: boolean;
  confirmDialog: ConfirmDialog;
  isGrantNftIdentityModalOpen?: boolean;
  isInitialize?: boolean;
};

const defaultDialog = {
  type: CONFIRM_DIALOG_LEVEL.INFO,
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
  isGrantNftIdentityModalOpen: false,
};

export const appSlice = createSlice({
  initialState,
  name: 'apps',
  reducers: {
    updateState: (state, action: PayloadAction<Partial<AppState>>) => {
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
    setGrantNftIdentityModal: (state, { payload }: PayloadAction<boolean>) => {
      state.isGrantNftIdentityModalOpen = payload;
    },
  },
});

export const {
  updateState,
  loading,
  unloading,
  openConfirmModal,
  closeConfirmModal,
} = appSlice.actions;

// selectors
export const selectApp = (state: RootState) => state.app;

export default appSlice.reducer;
