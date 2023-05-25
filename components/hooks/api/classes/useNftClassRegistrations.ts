import useSWR, { SWRResponse } from 'swr';

import { NftClassRegistrationEntity } from '@_types/models/entities';
import { NftClassRegistrationQuery } from '@_types/api/class';
import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils/request';
import { useNftClassRegistrationActions } from '@hooks/web3';
import { useApi } from '@hooks/common';

export const useNftRegistrationClassListApi = (
  query?: NftClassRegistrationQuery
): SWRResponse<NftClassRegistrationEntity[]> => {
  const { getNumberOfStudentsOfClass } = useNftClassRegistrationActions();

  const getter = useApi(async (params) => {
    const nftClassRegistrations = (await makeRequest()(
      params
    )) as NftClassRegistrationEntity[];
    const nftClassRegistrationWithNumberOfStudents = await Promise.all(
      nftClassRegistrations.map(async ({ class: _class, ...other }) => {
        const numberOfStudents = await getNumberOfStudentsOfClass(
          _class.onChainId
        );

        return {
          ...other,
          class: {
            ..._class,
            numberOfStudents,
          },
        };
      })
    );

    return nftClassRegistrationWithNumberOfStudents as NftClassRegistrationEntity[];
  });

  const result = useSWR([endpoints.nftClassRegistration, query], getter, {
    revalidateOnFocus: false,
  });

  return result;
};
