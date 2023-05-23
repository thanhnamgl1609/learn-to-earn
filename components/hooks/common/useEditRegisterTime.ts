import { useCallback } from 'react';

import { useValidator } from '@hooks/form';
import { useRegisterTime, useSchoolActions } from '@hooks/web3';
import { useApi } from './useApi';
import { REGISTER_TIME } from '@validators/schemas';
import { SemesterDetail } from '@_types/api/semester';

type FormState = {
  registerStartAt: string;
  registerEndAt: string;
};

export const useEditRegisterTime = () => {
  const { editRegisterTime } = useSchoolActions();
  const validator = useValidator(REGISTER_TIME);

  return useApi(async (formState: FormState, semester: SemesterDetail) => {
    const data = validator(formState);
    if (!data) return;
    const { id } = semester;
    await editRegisterTime(id, formState.registerStartAt, formState.registerEndAt);
  }, []);
};
