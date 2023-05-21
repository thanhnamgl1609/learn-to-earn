import { ContractTransaction, ethers } from 'ethers';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment';

import { HookFactoryWithoutSWR } from '@_types/hooks';
import { formatNftIdentity } from './formatter';
import { NftIdentity } from '@_types/nftIdentity';

type GetNftOfMemberWithRoleParams = {
  role: number;
  sender: string;
};

type UseIdentitiesActionsReturnTypes = {
  getNftOfMemberWithRole: GetNftOfMemberWithRoleFunc;
};

type GetNftOfMemberWithRoleFunc = (
  params: GetNftOfMemberWithRoleParams
) => Promise<NftIdentity>;

type UseIdentitiesActionsHookFactory =
  HookFactoryWithoutSWR<UseIdentitiesActionsReturnTypes>;

export type UseIdentitiesActionsHook =
  ReturnType<UseIdentitiesActionsHookFactory>;

export const hookFactory: UseIdentitiesActionsHookFactory =
  ({ contracts }) =>
  () => {
    const _contracts = contracts;

    const getNftOfMemberWithRole: GetNftOfMemberWithRoleFunc = useCallback(
      async ({ role, sender }) => {
        const result = await _contracts.nftIdentities?.getNftOfMemberWithRole(
          role,
          sender
        );

        return formatNftIdentity(result);
      },
      [_contracts]
    );

    return {
      getNftOfMemberWithRole,
    };
  };
