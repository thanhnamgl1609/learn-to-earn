import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@store';

import CONST from '@config/constants.json';
import { NftIdentity, RegistrationInfo } from '@_types/nftIdentity';

const ALL_ROLES = Object.values(CONST.ROLES);
export type RoleType = (typeof ALL_ROLES)[number];

export type UserState = {
  role: number | null;
  roleType: RoleType;
  registrationInfos: RegistrationInfo[];
  nftIdentities: NftIdentity[];
  account: string;
};

type UpdateUserPayload = Partial<UserState> & {
  afterUpdate?: (...params) => any;
};

const initialState: UserState = {
  role: null,
  roleType: null,
  registrationInfos: [],
  nftIdentities: [],
  account: '',
};

export const userSlice = createSlice({
  initialState,
  name: 'users',
  reducers: {
    updateUser: (state, action: PayloadAction<UpdateUserPayload>) => {
      const { afterUpdate, ...newState } = action.payload;
      Object.assign(state, newState);
      afterUpdate?.(); 
    },
  },
  extraReducers(builder) {},
});

export const { updateUser } = userSlice.actions;

// selectors
export const selectUser = (state: RootState) => state.user;
export const selectCurrentRegistration = createSelector(selectUser, (user) =>
  user.registrationInfos.find(({ role }) => role === user.role)
);
export const selectCurrentNftIdentity = createSelector(selectUser, (user) =>
  user.nftIdentities.find(({ role }) => role === user.role)
);

export default userSlice.reducer;
