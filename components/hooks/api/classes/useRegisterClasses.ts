import useSWR, { SWRResponse } from 'swr';

import { ClassEntity } from '@_types/models/entities';
import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils/request';
import { useApi } from '@hooks/common';
import { useNftClassRegistrationActions, useSchoolActions } from '@hooks/web3';

export const useRegisterClassesApi = (): SWRResponse<ClassEntity[]> => {
  const { getRegisterFeeClassById } = useSchoolActions();
  const { getNumberOfStudentsOfClass } = useNftClassRegistrationActions();

  const getter = useApi(async (params: [string]) => {
    const classList = await makeRequest()(params);
    console.log("🚀 ~ file: useRegisterClasses.ts:15 ~ getter ~ classList:", classList)
    const classListWithRegisterFee = await Promise.all(
      classList.map(async (classItem: ClassEntity) => {
        const registerClassFee = await getRegisterFeeClassById(
          classItem.onChainId
        );
        const numberOfStudents = await getNumberOfStudentsOfClass(
          classItem.onChainId
        );

        return {
          ...classItem,
          registerClassFee,
          numberOfStudents,
        };
      })
    );

    return classListWithRegisterFee;
  });

  const result = useSWR([endpoints.registerClasses], getter, {
    revalidateOnFocus: false,
  });

  return result;
};
