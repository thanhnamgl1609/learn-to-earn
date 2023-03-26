import { HookFactoryWithoutSWR, Web3Dependencies } from '@_types/hooks';
import { ContractTransaction } from 'ethers';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

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

type GrantNftIdentityFunc = (
  params: {
    address: string;
    expiredAt: number;
    tokenURI: string;
  } & CommonParams
) => Promise<void>;

type RejectNftIdentityFunc = (
  params: {
    address: string;
  } & CommonParams
) => Promise<void>;
type UseManagementReturnTypes = {
  grantNftIdentity: GrantNftIdentityFunc;
  rejectNftIdentity: RejectNftIdentityFunc;
};

type ManagementHookFactory = HookFactoryWithoutSWR<UseManagementReturnTypes>;

export type UseManagementHook = ReturnType<ManagementHookFactory>;

export const hookFactory: ManagementHookFactory =
  ({ contracts }) =>
  () => {
    const _contracts = contracts;

    const grantNftIdentity: GrantNftIdentityFunc = useCallback(
      async ({ address, expiredAt, tokenURI, onSuccess, onError }) => {
        const promise = _contracts.nftIdentities.grantNftIdentity(
          address,
          expiredAt,
          tokenURI
        );
        await promiseHandler({
          successMsg: `Success to grant NFT for ${address}`,
          errorMsg: `Fail to grant NFT for ${address}`,
          onSuccess,
          onError,
          promise: promise,
        });
      },
      [_contracts]
    );

    const rejectNftIdentity: RejectNftIdentityFunc = useCallback(
      async ({ address, onSuccess, onError }) => {
        const promise =
          _contracts.nftIdentities.rejectNftIdentityRegistration(address);
        await promiseHandler({
          successMsg: `Success to reject NFT for ${address}`,
          errorMsg: `Fail to reject NFT for ${address}`,
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
        await toast.promise(
          promise
            .then((tx) => tx.wait())
            .then(() => onSuccess?.())
            .catch((error) => {
              onError?.(error);
              return Promise.reject(error);
            }),
          {
            pending: 'Processing...',
            success: successMsg,
            error: errorMsg,
          }
        );
      } catch (e) {
        toast.error(e.message);
      }
    };

    return {
      grantNftIdentity,
      rejectNftIdentity,
    };
  };
