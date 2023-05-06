import { HookFactoryWithoutSWR } from '@_types/hooks';
import axios from 'axios';
import { ContractTransaction } from 'ethers';
import { useCallback } from 'react';

type CommonParams = {
  onSuccess?: () => {};
  onError?: (error: Error) => {};
};

type PromiseHandlerFunc = (params: {
  onSuccess?: () => {};
  onError?: (error: Error) => {};
  successMsg: string;
  errorMsg: string;
  promise: Promise<ContractTransaction>;
}) => Promise<void>;

type UseUtilitiesReturnTypes = {
  getSignedData: (account: string) => Promise<string>;
};

type UtilitiesHookFactory = HookFactoryWithoutSWR<UseUtilitiesReturnTypes>;

export type UseUtilitiesHook = ReturnType<UtilitiesHookFactory>;

export const hookFactory: UtilitiesHookFactory =
  ({ ethereum }) =>
  () => {
    const getSignedData = useCallback(async (account: string) => {
      const { data: messageToSign } = await axios.get('/api/verify');
      const signedData = await ethereum?.request({
        method: 'personal_sign',
        params: [JSON.stringify(messageToSign), account, messageToSign.id],
      });

      return signedData as string;
    }, [ethereum]);

    return {
      getSignedData,
    };
  };
