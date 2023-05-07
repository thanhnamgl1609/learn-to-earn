import { useCallback } from 'react';

import { useValidator } from '@hooks/form';
import { useRegisterTime } from '@hooks/web3';
import { useApi } from './useApi';
import { REGISTER_TIME } from '@validators/schemas';

type FormState = {
  registerStartAt: string;
  registerEndAt: string;
};

export const useEditRegisterTime = () => {
  const {
    registerTime: { editRegisterTime, mutate },
  } = useRegisterTime();
  const validator = useValidator(REGISTER_TIME);
  const caller = useApi(async (data) => {
    await editRegisterTime(data);
    await mutate();
  });

  return useCallback((formState: FormState) => {
    const data = validator(formState);
    if (!data) return;

    return caller(data);
  }, []);
};
