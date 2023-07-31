import useSWR, { SWRResponse } from 'swr';

import { ClassEntity } from '@_types/models/entities';
import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils/request';
import { useApi } from '@hooks/common';
import {
  useNftClassRegistrationActions,
  useSchoolActions,
} from '@hooks/web3';
import { useAppSelector } from '@hooks/stores';
import { selectCurrentNftClassRegistrations } from '@store/userSlice';
import { useMemo } from 'react';

export const useRegisterClassesApi = (): SWRResponse<
  ClassEntity[]
> => {
  const { getRegisterFeeClassById } = useSchoolActions();
  const { getNumberOfStudentsOfClass } =
    useNftClassRegistrationActions();
  const currentNftClassRegistrations = useAppSelector(
    selectCurrentNftClassRegistrations
  );

  const getter = useApi(
    async (params: [string]) => {
      const classList = await makeRequest()(params);
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
    },
    [currentNftClassRegistrations]
  );

  const result = useSWR([endpoints.registerClasses], getter, {});

  const data = useMemo(
    () =>
      (result.data || [])
        .map((classItem) => {
          const isRegister = currentNftClassRegistrations.some(
            ({ class: { courseCode } }) =>
              courseCode === classItem.courseCode
          );

          return {
            ...classItem,
            isRegister,
          };
        })
        .sort(
          (
            { isRegister: isRegister1 },
            { isRegister: isRegister2 }
          ) =>
            Number(isRegister1) - Number(isRegister2) > 0 ? 1 : -1
        ),
    [result.data, currentNftClassRegistrations]
  );

  return {
    ...result,
    data,
  };
};
