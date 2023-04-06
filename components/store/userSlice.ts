import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@store';
import { NftIdentity, RegistrationInfo } from '@_types/nftIdentity';
import CONST from '@config/constants.json';

const ALL_ROLES = Object.values(CONST.ROLES);
export type RoleType = (typeof ALL_ROLES)[number];

type UserState = {
  role: number | null;
  roleType: RoleType;
  registrationInfos: RegistrationInfo[];
  nftIdentities: NftIdentity[];
};

const initialState: UserState = {
  role: null,
  roleType: null,
  registrationInfos: [],
  nftIdentities: [],
};

export const userSlice = createSlice({
  initialState,
  name: 'users',
  reducers: {
    updateUser: (state, action: PayloadAction<Partial<UserState>>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { updateUser } = userSlice.actions;

// selectors
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
