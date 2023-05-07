import useSWR from 'swr';

import CONST from 'config/constants.json';
import { CryptoHookFactory } from '@_types/hooks';
import { NftIdentity } from '@_types/nftIdentity';
import { formatNftIdentities, formatNftIdentity } from './formatter';
import { useAppDispatch } from '@hooks/stores';
import { loading, unloading } from '@store/appSlice';

type UseMemberListResponse = {};

export type UseMemberListParams = {
  role: number;
};

type MemberListHookFactory = CryptoHookFactory<
  NftIdentity[],
  UseMemberListResponse,
  UseMemberListParams
>;

export type UseMemberListHook = ReturnType<MemberListHookFactory>;

const { ROLES } = CONST;
const AVAILABLE_ROLES = [ROLES.TEACHER, ROLES.STUDENT];

export const hookFactory: MemberListHookFactory =
  ({ contracts }) =>
  ({ role }) => {
    const { data, ...swr } = useSWR(
      contracts ? `web3/useMemberList/${role}` : null,
      async () => {
        if (AVAILABLE_ROLES.every((_role) => role !== _role)) return null;

        const nftIdentities = await contracts!.nftIdentities.getAllMembers(
          role
        );

        const result = await formatNftIdentities(nftIdentities);

        return result;
      }
    );

    return {
      ...swr,
      data,
    };
  };
