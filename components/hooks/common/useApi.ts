import { toast } from 'react-toastify';

import { logger } from 'utils';
import ERROR_MESSAGE from '@config/error-message.json';
import { loading, unloading } from '@store/appSlice';
import { useAppDispatch } from '@hooks/stores';
import { useCallback } from 'react';

const { CONTRACT } = ERROR_MESSAGE;

export const useApi = <D, P>(
  action: (...params: P[]) => Promise<D>,
  deps?: any[]
) => {
  const dispatch = useAppDispatch();

  return useCallback(async (...params: P[]) => {
    try {
      dispatch(loading());
      const result = await action(...params);

      dispatch(unloading());
      return result;
    } catch (e) {
      const isUserDenied = e.message?.includes(
        ERROR_MESSAGE.MAPPING.USER_DENIED
      );
      let errorMessage = e.customError ?? ERROR_MESSAGE.UNEXPECTED;
      if (isUserDenied) errorMessage = ERROR_MESSAGE.USER_DENIED;
      const isNetworkError = e.message?.includes(
        ERROR_MESSAGE.MAPPING.NETWORK_ERROR
      );
      if (isNetworkError) errorMessage = ERROR_MESSAGE.NETWORK_ERROR;
      const contractErrCodes = Object.keys(CONTRACT);
      const errCode = contractErrCodes.find((code) =>
        e.data?.message?.includes(code) || e.error?.data?.message?.includes(code)
      );
      if (errCode) errorMessage = CONTRACT[errCode];
      logger(e, { method: 'error' });
      toast.error(errorMessage);
    } finally {
      dispatch(unloading());
    }
  }, deps);
};
