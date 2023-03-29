import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@store';
import { NftIdentity, RegistrationInfoMeta } from '@_types/nftIdentity';
import CONST from '@config/constants.json';

type UserState = {
  roles: number[];
  role: number;
  nftIdentity?: NftIdentity;
  isExpired?: boolean;
  isRequestSent?: boolean;
  registration?: RegistrationInfoMeta;
};

const { ROLES } = CONST;

const initialState: UserState = {
  roles: [ROLES.VISITOR],
  role: ROLES.VISITOR,
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
