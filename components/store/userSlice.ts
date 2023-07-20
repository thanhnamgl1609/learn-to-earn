import {
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from '@store';

import { NftIdentity, RegistrationInfo } from '@_types/nftIdentity';
import CONST from '@config/constants.json';
import { UserEntity } from '@_types/models/entities';

const ALL_ROLES = Object.values(CONST.ROLES);
export type RoleType = (typeof ALL_ROLES)[number];

export type UserState = {
  role: number | null;
  roleType: RoleType;
  registrationInfos: RegistrationInfo[];
  nftIdentities: NftIdentity[];
  account: string;
  detail: UserEntity | null;
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
  detail: null,
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
export const selectUser = (state: RootState): UserState => state.user;
export const selectCurrentRegistration = createSelector(
  selectUser,
  (user) =>
    user.registrationInfos.find(({ role }) => role === user.role)
);
export const selectCurrentNftIdentity = createSelector(
  selectUser,
  (user) => user.nftIdentities.find(({ role }) => role === user.role)
);
export const selectUserDetail = createSelector(
  selectUser,
  ({ detail }) => detail
);
export const selectCurrentNftClassRegistrations = createSelector(
  selectUserDetail,
  ({ nftClassRegistrations }) =>
    nftClassRegistrations.filter(({ isRegained }) => !isRegained)
);

export default userSlice.reducer;
