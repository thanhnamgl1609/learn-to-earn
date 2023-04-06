import { CryptoHookFactory } from '@_types/hooks';
import { MetaType, NftIdentity, RegistrationInfo } from '@_types/nftIdentity';
import axios from 'axios';
import { ethers } from 'ethers';
import moment from 'moment';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import useSWR from 'swr';

type SWRResponse = {
  nftIdentities: NftIdentity[];
  registrationInfos: RegistrationInfo[];
  isOwner: boolean;
};
type UseUserInfoResponse = {};

type RoleHookFactory = CryptoHookFactory<SWRResponse, UseUserInfoResponse>;

export type UseUserInfoHook = ReturnType<RoleHookFactory>;

export const hookFactory: RoleHookFactory =
  ({ contracts }) =>
  () => {
    const _contracts = contracts;
    const [registerFee, setRegisterFee] = useState(ethers.BigNumber.from(0));

    const { data, ...swr } = useSWR(
      contracts ? 'web3/useUserInfo' : null,
      async () => {
        const isOwner = await contracts!.nftIdentities.isOwner();

        if (isOwner) {
          return {
            nftIdentities: [],
            registrationInfos: [],
            isOwner: true, 
          }
        }
        
        const [registrationInfoResponses, nftResponses, _registerFee] =
          await Promise.all([
            contracts!.nftIdentities.getAllOwnedRegistrationInfos(),
            contracts!.nftIdentities.getOwnedNfts(),
            contracts!.nftIdentities.registerFee(),
          ]);

        const registrationInfos: RegistrationInfo[] = await Promise.all(
          registrationInfoResponses.map(async ({ detail, role }) => {
            const { applicant, documentURI } = detail;
            const { data: meta } = await axios.get(documentURI);

            return {
              role: role.toNumber(),
              applicant,
              documentURI,
              meta,
            };
          })
        );
        const nftIdentities: NftIdentity[] = await Promise.all(
          nftResponses.map(
            async ({ role, nftIdentity, isExpired, tokenURI }) => {
              const { data: meta } = await axios.get(tokenURI);
              const { expiredAt, register, tokenId } = nftIdentity;

              return {
                role: role.toNumber(),
                expiredAt: moment(expiredAt.toNumber()).toDate(),
                register,
                tokenId: role.toNumber(),
                isExpired,
                tokenURI,
                meta,
              };
            }
          )
        );
        setRegisterFee(_registerFee);

        return {
          registrationInfos,
          nftIdentities,
          isOwner: false,
        };
      },
      {
        revalidateIfStale: false,
        revalidateOnFocus: false,
      }
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
      registerNftIdentity,
      data,
    };
  };
