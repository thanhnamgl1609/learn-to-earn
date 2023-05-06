import axios from 'axios';
import moment from 'moment';
import useSWR from 'swr';

import { CryptoHookFactory } from '@_types/hooks';
import { NftIdentity, RegistrationInfo } from '@_types/nftIdentity';
import { formatRegistrationInfoResponses } from './formatter/registrationInfos';
import { formatNftIdentities } from './formatter/nftIdentities';

type SWRResponse = {
  nftIdentities: NftIdentity[];
  registrationInfos: RegistrationInfo[];
  isOwner: boolean;
};
type UseUserInfoResponse = {};

type UserInfoHookFactory = CryptoHookFactory<SWRResponse, UseUserInfoResponse>;

export type UseUserInfoHook = ReturnType<UserInfoHookFactory>;

export const hookFactory: UserInfoHookFactory =
  ({ contracts }) =>
  () => {
    const key = 'web3/useUserInfo';
    const { data, ...swr } = useSWR(
      contracts ? key : null,
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
          await formatRegistrationInfoResponses(registrationInfoResponses);
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
      key,
    };
  };
