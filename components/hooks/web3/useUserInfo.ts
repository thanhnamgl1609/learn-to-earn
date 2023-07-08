import useSWR from 'swr';

import { CryptoHookFactory } from '@_types/hooks';
import { NftIdentity, RegistrationInfo } from '@_types/nftIdentity';
import { formatRegistrationInfoResponses } from './formatter/registrationInfos';
import { formatNftIdentities } from './formatter/nftIdentities';
import endpoints from 'config/endpoints.json';
import { request } from 'utils';

type SWRResponse = {
  nftIdentities: NftIdentity[];
  registrationInfos: RegistrationInfo[];
  isOwner: boolean;
};
type UseUserInfoResponse = {
  getSignature: () => Promise<string>;
};

type UserInfoHookFactory = CryptoHookFactory<SWRResponse, UseUserInfoResponse>;

export type UseUserInfoHook = ReturnType<UserInfoHookFactory>;

export const hookFactory: UserInfoHookFactory =
  ({ contracts, ethereum, provider }) =>
  () => {
    const _contracts = contracts;

    const key = 'web3/useUserInfo';
    const { data, ...swr } = useSWR(
      _contracts ? key : null,
      async () => {
        const isOwner = await _contracts!.nftIdentities.isOwner();

        if (isOwner) {
          return {
            nftIdentities: [],
            registrationInfos: [],
            isOwner: true,
          };
        }

        const [registrationInfoResponses, nftResponses] = await Promise.all([
          _contracts!.nftIdentities.getAllOwnedRegistrationInfos(),
          _contracts!.nftIdentities.getOwnedNfts(),
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

    const getSignature = async (): Promise<string> => {
      const accounts = await provider?.listAccounts();

      if (accounts && accounts[0] && ethereum) {
        const { data: messageToSign } = await request.post(endpoints.sign);
        return ethereum?.request({
          method: 'personal_sign',
          params: [
            JSON.stringify(messageToSign),
            accounts[0],
            messageToSign.id,
          ],
        }) as Promise<string>;
      }

      return '';
    };

    return {
      ...swr,
      data,
      key,
      getSignature,
    };
  };
