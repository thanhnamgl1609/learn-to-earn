import { useCallback } from 'react';
import { toast } from 'react-toastify';

import z, { getDetailError, getError } from '@validators/zod';
import { logger } from 'utils';

export const useValidator = <D>(validator: z.ZodType<D>, deps = []) =>
  useCallback(
    (
      data: z.infer<typeof validator>,
      extend?: (_validator: z.ZodType<D>) => z.ZodType<D>
    ) => {
      try {
        let _validator = extend ? extend(validator) : validator;
        return _validator.parse(data);
      } catch (e) {
        logger(getDetailError(e));
        toast.error(getError(e));
        return null;
      }
    },
    deps
  );
