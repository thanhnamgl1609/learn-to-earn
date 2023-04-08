import axios from 'axios';
import moment from 'moment';
import useSWR from 'swr';

import { CryptoHookFactory } from '@_types/hooks';
import { NftIdentity, RegistrationInfo } from '@_types/nftIdentity';
import { formatRegistrationInfos } from './formatter/registrationInfos';
import { formatNftIdentities } from './formatter/nftIdentities';

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
    const { data, ...swr } = useSWR(
      contracts ? 'web3/useUserInfo' : null,
      async () => {
        const isOwner = await contracts!.nftIdentities.isOwner();

        if (isOwner) {
          return {
            nftIdentities: [],
            registrationInfos: [],
            isOwner: true,
          };
        }

        const [registrationInfoResponses, nftResponses] = await Promise.all([
          contracts!.nftIdentities.getAllOwnedRegistrationInfos(),
          contracts!.nftIdentities.getOwnedNfts(),
        ]);

        const registrationInfos: RegistrationInfo[] =
          await formatRegistrationInfos(registrationInfoResponses);
        const nftIdentities: NftIdentity[] = await formatNftIdentities(
          nftResponses
        );

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

    return {
      ...swr,
      data,
    };
  };
