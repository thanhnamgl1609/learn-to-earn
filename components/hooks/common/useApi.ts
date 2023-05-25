import { toast } from 'react-toastify';

import { logger } from 'utils';
import ERROR_MESSAGE from '@config/error-message.json';
import { loading, unloading } from '@store/appSlice';
import { useAppDispatch } from '@hooks/stores';
import { useCallback } from 'react';

export const useApi = <D>(action: (...params) => Promise<D>, deps?: any[]) => {
  const dispatch = useAppDispatch();

  return useCallback(async (...params) => {
    try {
      dispatch(loading());
      const result = await action(...params);

      dispatch(unloading());
      return result;
    } catch (e) {
      logger(e, { method: 'error' });
      toast.error(e.customError ?? ERROR_MESSAGE.UNEXPECTED);
    } finally {
      dispatch(unloading());
    }
  }, deps);
};
