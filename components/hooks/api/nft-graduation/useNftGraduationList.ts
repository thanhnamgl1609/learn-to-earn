import useSWR, { SWRResponse } from 'swr';

import { NftGraduationEntity } from '@_types/models/entities';
import { NftGraduationQuery } from '@_types/api/certificates';
import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils/request';
import { useApi } from '@hooks/common';

export const useNftGraduationList = (
  query: NftGraduationQuery
): SWRResponse<NftGraduationEntity[]> => {
  const getter = useApi(
    async (params: [string, NftGraduationQuery]) => {
      const nftGraduations = await makeRequest()(params);

      return nftGraduations as NftGraduationEntity[];
    }
  );

  const result = useSWR([endpoints.nftGraduation, query], getter, {});

  return result;
};

export const useNftGraduationListGetter = () => {
  return useApi(async (query: NftGraduationQuery) => {
    const nftGraduations = await makeRequest()([
      endpoints.nftGraduation,
      query,
    ]);

    return nftGraduations as NftGraduationEntity[];
  });
};
