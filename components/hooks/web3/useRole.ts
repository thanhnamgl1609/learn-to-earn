import { CryptoHookFactory } from '@_types/hooks';
import { ethers } from 'ethers';
import { useCallback } from 'react';
import useSWR from 'swr';
import { toast } from 'react-toastify';

type UseRoleResponse = {
};

type RoleHookFactory = CryptoHookFactory<number, UseRoleResponse>;

export type UseRoleHook = ReturnType<RoleHookFactory>;

export const hookFactory: RoleHookFactory =
  ({ contracts }) =>
  () => {
    const { data, ...swr } = useSWR(
      contracts ? 'web3/useRole' : null,
      async () => {
        const role = await contracts!.nftIdentities.getRole();

        return role.toNumber();
      }
    );

    return {
      ...swr,
      data,
    };
  };
