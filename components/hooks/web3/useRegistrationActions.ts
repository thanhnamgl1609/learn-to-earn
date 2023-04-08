import { HookFactoryWithoutSWR, Web3Dependencies } from '@_types/hooks';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { formatRegistrationInfos } from './formatter/registrationInfos';
import { RegistrationInfo } from '@_types/nftIdentity';

type UseRegistrationActionsReturnTypes = {
  registerNftIdentity: (
    role: number,
    metadataURI: string
  ) => Promise<RegistrationInfo[]>;
};

type UtilitiesHookFactory =
  HookFactoryWithoutSWR<UseRegistrationActionsReturnTypes>;

export type UseRegistrationActionsHook = ReturnType<UtilitiesHookFactory>;

export const hookFactory: UtilitiesHookFactory =
  ({ contracts }) =>
  () => {
    const registerFee = ethers.utils.parseEther('0.05').toString();
    const _contracts = contracts;

    const registerNftIdentity = useCallback(
      async (role: number, metadataURI: string) => {
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

          const registrationInfoResponses =
            await _contracts.nftIdentities?.getAllOwnedRegistrationInfos();

          return formatRegistrationInfos(registrationInfoResponses);
        } catch (error) {
          toast.error('Unexpected error');
        }
      },
      [_contracts]
    );

    return {
      registerNftIdentity,
    };
  };
