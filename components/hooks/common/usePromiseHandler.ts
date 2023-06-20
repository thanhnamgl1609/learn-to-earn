import { ContractTransaction } from 'ethers';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

type PromiseHandlerFunc = <R>(params: {
  onSuccess?: (params: any) => {};
  onError?: (error: Error) => {};
  pendingMsg?: string;
  successMsg: string;
  errorMsg: string;
  promise: Promise<R>;
}) => Promise<void>;

export const usePromiseHandler = (): PromiseHandlerFunc => {
  return useCallback(
    async ({ successMsg, errorMsg, promise, pendingMsg = '', onSuccess }) => {
      const result = await toast.promise(promise, {
        pending: pendingMsg,
        success: successMsg,
        error: errorMsg,
      });

      onSuccess?.(result);
    },
    []
  );
};
