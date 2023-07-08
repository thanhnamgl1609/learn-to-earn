import { ContractTransaction } from 'ethers';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

type PromiseHandlerFunc = (params: {
  onSuccess?: (params: any) => {};
  onError?: (error: Error) => {};
  pendingMsg?: string;
  successMsg: string;
  errorMsg: string;
  promise: Promise<ContractTransaction>;
}) => Promise<void>;

export const useTransactionHandler = (): PromiseHandlerFunc => {
  return useCallback(async ({ successMsg, errorMsg, promise, pendingMsg = '', onSuccess }) => {
    const tx = await promise;

    const result = await toast.promise(tx!.wait(), {
      pending: pendingMsg,
      success: successMsg,
      error: errorMsg,
    });

    onSuccess?.(result);
  }, []);
};
