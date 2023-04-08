import { useCallback } from 'react';
import { toast } from 'react-toastify';

import z, { getError } from '@validators/zod';

export const useValidator = (validator: z.ZodType) =>
  useCallback((data: z.infer<typeof validator>) => {
    try {
      return validator.parse(data);
    } catch (e) {
      toast.error(getError(e));
      return false;
    }
  }, []);
