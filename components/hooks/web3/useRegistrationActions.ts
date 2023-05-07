import { ContractTransaction, ethers } from 'ethers';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment';

import { RegistrationInfo } from '@_types/nftIdentity';
import { HookFactoryWithoutSWR } from '@_types/hooks';
import { formatRegistrationInfoResponses } from './formatter';

type GrantParams = {
  onSuccess?: () => {};
  onError?: (error: Error) => {};
} & RegistrationInfo & { expiredAt: string };

type RejectParams = {
  onSuccess?: () => {};
  onError?: (error: Error) => {};
} & { role: number; applicant: string };

type UseRegistrationActionsReturnTypes = {
  registerNftIdentity: (
    role: number,
    metadataURI: string
  ) => Promise<RegistrationInfo[]>;
  grantNftIdentity: GrantNftIdentityFunc;
  rejectNftIdentity: RejectNftIdentityFunc;
};
type PromiseHandlerFunc = (params: {
  onSuccess?: (...params) => {};
  onError?: (error: Error) => {};
  successMsg: string;
  errorMsg: string;
  promise: Promise<ContractTransaction>;
}) => Promise<void>;

type GrantNftIdentityFunc = (params: GrantParams) => Promise<void>;

type RejectNftIdentityFunc = (params: RejectParams) => Promise<void>;

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
        const promise = _contracts.nftIdentities?.registerNftIdentity(
          role,
          metadataURI,
          {
            value: registerFee,
          }
        );
        await promiseHandler({
          successMsg: 'Request sent! Waiting for validating!',
          errorMsg: 'Error when sending request!',
          promise,
        });

        const registrationInfoResponses =
          await _contracts.nftIdentities?.getAllOwnedRegistrationInfos();

        return formatRegistrationInfoResponses(registrationInfoResponses);
      },
      [_contracts]
    );

    const grantNftIdentity: GrantNftIdentityFunc = useCallback(
      async ({
        onSuccess,
        onError,
        applicant,
        role,
        expiredAt,
        documentURI: tokenURI,
      }) => {
        const promise = _contracts.nftIdentities?.grantNftIdentity(
          applicant,
          role,
          moment(expiredAt).endOf('d').unix(),
          tokenURI
        );
        await promiseHandler({
          successMsg: `Success to grant NFT for ${applicant}`,
          errorMsg: `Fail to grant NFT for ${applicant}`,
          onSuccess,
          onError,
          promise,
        });
      },
      [_contracts]
    );

    const rejectNftIdentity: RejectNftIdentityFunc = useCallback(
      async ({ role, applicant, onSuccess, onError }) => {
        const promise = _contracts.nftIdentities.rejectNftIdentityRegistration(
          applicant,
          role
        );
        await promiseHandler({
          successMsg: `Success to reject NFT for ${applicant}`,
          errorMsg: `Fail to reject NFT for ${applicant}`,
          onSuccess,
          onError,
          promise,
        });
      },
      []
    );

    const promiseHandler: PromiseHandlerFunc = async ({
      successMsg,
      errorMsg,
      promise,
      onSuccess,
      onError,
    }) => {
      try {
        const tx = await promise;

        const result = await toast.promise(tx!.wait(), {
          pending: 'Processing...',
          success: successMsg,
          error: errorMsg,
        });

        onSuccess?.(result);
      } catch (e) {
        toast.error(e.message);
        onError?.(e.message);
      }
    };

    return {
      registerNftIdentity,
      grantNftIdentity,
      rejectNftIdentity,
    };
  };
