import { useValidator } from '@hooks/form';
import { useSchoolActions } from '@hooks/web3';
import { useApi } from './useApi';
import { EXTEND_REGISTER_TIME, REGISTER_TIME } from '@validators/schemas';
import { SemesterDetail } from '@_types/api/semester';

type FormState = {
  registerStartAt: string;
  registerEndAt: string;
};

export const useEditRegisterTime = () => {
  const { editRegisterTime } = useSchoolActions();
  const validator = useValidator(REGISTER_TIME);

  return useApi(async (formState: FormState, semester: SemesterDetail) => {
    const data = validator(formState, (_validator) =>
      EXTEND_REGISTER_TIME(_validator, semester)
    );
    if (!data) return;
    const { id } = semester;
    await editRegisterTime(
      id,
      formState.registerStartAt,
      formState.registerEndAt
    );
  }, []);
};
