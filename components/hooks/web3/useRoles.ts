import { CryptoHookFactory } from '@_types/hooks';
import { MetaType, NftIdentity } from '@_types/nftIdentity';
import { ethers } from 'ethers';
import moment from 'moment';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import useSWR from 'swr';

type GetNftIdentityResponse = {
  nftIdentity: NftIdentity;
  isRequestSent: boolean;
};
type UseRoleResponse = {
  getNftIdentity: (role: number) => Promise<GetNftIdentityResponse>;
};

type RoleHookFactory = CryptoHookFactory<number[], UseRoleResponse>;

export type UseRolesHook = ReturnType<RoleHookFactory>;

export const hookFactory: RoleHookFactory =
  ({ contracts }) =>
  () => {
    const _contracts = contracts;
    const [registerFee, setRegisterFee] = useState(ethers.BigNumber.from(0));

    const { data, ...swr } = useSWR(
      contracts ? 'web3/useRoles' : null,
      async () => {
        const roles = await contracts!.nftIdentities.getRoles();
        const _registerFee = await contracts!.nftIdentities.registerFee();
        setRegisterFee(_registerFee);

        return roles.map((role) => role.toNumber()).sort();
      },
      {
        revalidateIfStale: false,
        revalidateOnFocus: false,
      }
    );

    const getNftIdentity = useCallback(
      async (role: number) => {
        const nftIdentityResponse = await _contracts!.nftIdentities.getOwnedNft(
          role
        );
        const {
          0: nftIdentityRes,
          1: metadataURI,
          2: isRequestSent,
        } = nftIdentityResponse;
        const metaRes = await fetch(metadataURI);
        const meta = (await metaRes.json()) as MetaType;
        const nftIdentity: NftIdentity = {
          tokenId: nftIdentityRes.tokenId.toNumber(),
          expiredAt: moment.unix(nftIdentityRes.expiredAt.toNumber()).toDate(),
          register: nftIdentityRes.register,
          meta,
        };

        return {
          nftIdentity,
          isRequestSent,
        };
      },
      [_contracts]
    );

    const registerNftIdentity = useCallback(
      async (role, metadataURI: string) => {
        try {
          const tx = await _contracts.nftIdentities?.registerNftIdentity(
            role,
            metadataURI,
            {
              value: registerFee,
            }
          );

          await toast.promise(tx!.wait(), {
            pending: 'Processing...',
            success: 'Request sent! Waiting for validating!',
            error: 'Error when sending request!',
          });
        } catch (error) {
          toast.error('Unexpected error');
        }
      },
      [_contracts, registerFee]
    );

    return {
      ...swr,
      getNftIdentity,
      registerNftIdentity,
      data,
    };
  };
