import { useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';

import { ClassEntity } from '@_types/models/entities';
import { ClassQuery } from '@_types/api/class';
import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils/request';
import { useApi } from '@hooks/common';
import { useNftClassRegistrationActions, useSchoolActions } from '@hooks/web3';

export const useClassListApi = (
  query?: ClassQuery
): SWRResponse<ClassEntity[]> => {
  const { getRegisterFeeClassById } = useSchoolActions();
  const { getNumberOfStudentsOfClass } = useNftClassRegistrationActions();

  const _query = useMemo(() => {
    const q: ClassQuery = { ...query };
    if (q.semesterId && parseInt(q.semesterId as string) === 0)
      delete q.semesterId;

    return q;
  }, [query]);

  const getter = useApi(async (params: [string, ClassQuery]) => {
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
  });

  const result = useSWR([endpoints.classes, _query], getter, {
    revalidateOnFocus: false,
  });

  return result;
};
