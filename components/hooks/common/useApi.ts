import { toast } from 'react-toastify';

import { logger } from 'utils';
import ERROR_MESSAGE from '@config/error-message.json';
import { loading, unloading } from '@store/appSlice';
import { useAppDispatch } from '@hooks/stores';
import { useCallback } from 'react';

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
      const isUserDenied = e.message.includes(
        ERROR_MESSAGE.MAPPING.USER_DENIED
      );
      let errorMessage = e.customError ?? ERROR_MESSAGE.UNEXPECTED;
      if (isUserDenied) errorMessage = ERROR_MESSAGE.USER_DENIED;
      logger(e, { method: 'error' });
      toast.error(errorMessage);
    } finally {
      dispatch(unloading());
    }
  }, deps);
};
