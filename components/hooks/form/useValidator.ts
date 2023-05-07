import { useCallback } from 'react';
import { toast } from 'react-toastify';

import z, { getDetailError, getError } from '@validators/zod';
import { logger } from 'utils';

export const useValidator = <D>(validator: z.ZodType<D>, deps = []) =>
  useCallback((data: z.infer<typeof validator>) => {
    try {
      return validator.parse(data);
    } catch (e) {
      logger(getDetailError(e));
      toast.error(getError(e));
      return false;
    }
  }, deps);
