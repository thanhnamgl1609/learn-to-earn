import useSWR, { SWRResponse } from 'swr';

import { NftClassRegistrationEntity } from '@_types/models/entities';
import { NftClassRegistrationQuery } from '@_types/api/class';
import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils/request';
import { useNftClassRegistrationActions } from '@hooks/web3';
import { useApi } from '@hooks/common';

export const useNftRegistrationClassListApi = (
  query: NftClassRegistrationQuery
): SWRResponse<NftClassRegistrationEntity[]> & {
  customGet: (
    _query: NftClassRegistrationQuery
  ) => Promise<NftClassRegistrationEntity[]>;
} => {
  const { getNumberOfStudentsOfClass } =
    useNftClassRegistrationActions();
  const getter = useApi(
    async (params: [string, NftClassRegistrationQuery]) => {
      const nftClassRegistrations = (await makeRequest()(
        params
      )) as NftClassRegistrationEntity[];
      const nftClassRegistrationWithNumberOfStudents =
        await Promise.all(
          nftClassRegistrations.map(
            async ({ tokenId, class: _class, ...other }) => {
              const { onChainId } = _class;

              const numberOfStudents =
                await getNumberOfStudentsOfClass(onChainId);

              return {
                ...other,
                tokenId,
                class: {
                  ..._class,
                  numberOfStudents,
                },
              };
            }
          )
        );

      return nftClassRegistrationWithNumberOfStudents as NftClassRegistrationEntity[];
    }
  );

  const get = async (_query: NftClassRegistrationQuery) =>
    getter([endpoints.nftClassRegistration, _query]);

  const result = useSWR(
    [endpoints.nftClassRegistration, query],
    getter,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    ...result,
    customGet: get,
  };
};
