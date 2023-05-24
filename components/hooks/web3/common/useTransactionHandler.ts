import { ContractTransaction } from 'ethers';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

type PromiseHandlerFunc = (params: {
  onSuccess?: (params: any) => {};
  onError?: (error: Error) => {};
  successMsg: string;
  errorMsg: string;
  promise: Promise<ContractTransaction>;
}) => Promise<void>;

export const useTransactionHandler = (): PromiseHandlerFunc => {
  return useCallback(async ({ successMsg, errorMsg, promise, onSuccess }) => {
    const tx = await promise;

    const result = await toast.promise(tx!.wait(), {
      pending: 'Processing...',
      success: successMsg,
      error: errorMsg,
    });

    onSuccess?.(result);
  }, []);
};
