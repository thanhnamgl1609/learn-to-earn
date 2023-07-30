import useSWR, { SWRResponse } from 'swr';

import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils/request';
import { useApi } from '@hooks/common';
import { NftGraduationEntity } from '@_types/models/entities';

export const useNftGraduationDetail = (
  id: number
): SWRResponse<NftGraduationEntity> => {
  const result = useSWR(
    [`${endpoints.nftGraduationDetail}/${id}`],
    useApi(makeRequest()),
    {
      revalidateOnFocus: false,
    }
  );

  return result;
};
