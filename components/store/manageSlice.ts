import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@store';
import { RegistrationInfo } from '@_types/nftIdentity';
import _ from 'lodash';

export type ManageState = {
  registrations: RegistrationInfo[];
  registrationsByAddr: {
    [key: string]: RegistrationInfo;
  };
};

const initialState: ManageState = {
  registrations: [],
  registrationsByAddr: {},
};

export const manageSlice = createSlice({
  initialState,
  name: 'registrations',
  reducers: {
    updateRegistrations: (state, action: PayloadAction<RegistrationInfo[]>) => {
      Object.assign(state, {
        registrations: action.payload,
        registrationsByAddr: _.keyBy(action.payload, 'applicant'),
      });
    },
  },
});

export const { updateRegistrations } = manageSlice.actions;

// selectors
export const selectManage = (state: RootState) => state.manage;
export const selectRegistrationByAddr = createSelector(
  selectManage,
  ({ registrationsByAddr }) => registrationsByAddr
);

export default manageSlice.reducer;
