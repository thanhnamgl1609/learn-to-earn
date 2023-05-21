import { HookFactoryWithoutSWR } from '@_types/hooks';
import { ContractTransaction } from 'ethers';

import { request } from 'utils';
import endpoints from '@config/endpoints.json';

type UseUtilitiesReturnTypes = {
  getSignedData: () => Promise<string>;
};

type UtilitiesHookFactory = HookFactoryWithoutSWR<UseUtilitiesReturnTypes>;

export type UseUtilitiesHook = ReturnType<UtilitiesHookFactory>;

export const hookFactory: UtilitiesHookFactory =
  ({ ethereum, provider }) =>
  () => {
    const getSignedData = async (): Promise<string> => {
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
      getSignedData,
    };
  };
