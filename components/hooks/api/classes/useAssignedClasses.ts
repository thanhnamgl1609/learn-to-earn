import useSWR, { SWRResponse } from 'swr';

import {
  ClassEntity,
  NftClassRegistrationEntity,
} from '@_types/models/entities';
import { NftClassRegistrationQuery } from '@_types/api/class';
import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils/request';
import { useNftClassRegistrationActions } from '@hooks/web3';
import { useApi } from '@hooks/common';

export const useAssignedClassesApi = (
  query?: NftClassRegistrationQuery
): SWRResponse<ClassEntity[]> => {
  const { getNumberOfStudentsOfClass } = useNftClassRegistrationActions();

  const getter = useApi(async (params) => {
    const classList = await makeRequest()(params);
    const classListWithRegisterFee = await Promise.all(
      classList.map(async (classItem: ClassEntity) => {
        const numberOfStudents = await getNumberOfStudentsOfClass(
          classItem.onChainId
        );

        return {
          ...classItem,
          numberOfStudents,
        };
      })
    );

    return classListWithRegisterFee;
  });

  const result = useSWR([endpoints.assignedClasses, query], getter, {
    revalidateOnFocus: false,
  });

  return result;
};
