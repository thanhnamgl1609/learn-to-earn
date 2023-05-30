import useSWR, { SWRResponse } from 'swr';

import { ClassEntity } from '@_types/models/entities';
import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils/request';
import { useApi } from '@hooks/common';
import { useNftClassRegistrationActions, useSchoolActions } from '@hooks/web3';

export const useClassDetailApi = (
  tokenId: number
): SWRResponse<ClassEntity> => {
  const { getRegisterFeeClassById } = useSchoolActions();
  const { getNumberOfStudentsOfClass } = useNftClassRegistrationActions();

  const getter = useApi(async (params: [string, { tokenId: number }]) => {
    const classDetail = (await makeRequest()(params)) as ClassEntity;
    const registerClassFee = await getRegisterFeeClassById(
      classDetail.onChainId
    );
    const numberOfStudents = await getNumberOfStudentsOfClass(
      classDetail.onChainId
    );

    return {
      ...classDetail,
      registerClassFee,
      numberOfStudents,
    } as ClassEntity;
  });

  const result = useSWR([endpoints.classDetail, { tokenId }], getter, {
    revalidateOnFocus: false,
  });

  return result;
};
