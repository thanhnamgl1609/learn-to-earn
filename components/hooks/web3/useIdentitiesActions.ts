import { useCallback } from 'react';

import { HookFactoryWithoutSWR } from '@_types/hooks';
import { NftIdentity } from '@_types/nftIdentity';
import { formatNftIdentity } from './formatter';

type GetNftOfMemberWithRoleParams = {
  role: number;
  sender: string;
};

type GetOwnerOfTokenIdFunc = {
  (tokenId: number): Promise<string>;
};

type GetNftOfMemberWithRoleFunc = (
  params: GetNftOfMemberWithRoleParams
) => Promise<NftIdentity>;

type UseIdentitiesActionsReturnTypes = {
  getNftOfMemberWithRole: GetNftOfMemberWithRoleFunc;
  getOwnerOfTokenId: GetOwnerOfTokenIdFunc;
};

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

    const getOwnerOfTokenId: GetOwnerOfTokenIdFunc = useCallback(
      async (tokenId) => {
        const result = await _contracts.nftIdentities.ownerOf(tokenId);

        return result;
      },
      [_contracts]
    );

    return {
      getNftOfMemberWithRole,
      getOwnerOfTokenId,
    };
  };
