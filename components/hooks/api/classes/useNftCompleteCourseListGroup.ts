import useSWR, { SWRResponse } from 'swr';

import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils/request';
import { useApi } from '@hooks/common';
import {
  NftCompleteCourseQuery,
  KnowledgeBlockListResponse,
} from '@_types/api/certificates';

export const useNftCompleteCourseListGroupApi = (
  query: NftCompleteCourseQuery
): SWRResponse<KnowledgeBlockListResponse> & {
  customGet: (
    query: NftCompleteCourseQuery
  ) => Promise<KnowledgeBlockListResponse>;
} => {
  const getter = useApi(
    async (params: [string, NftCompleteCourseQuery]) => {
      const nftCompleteCourses = await makeRequest()(params);

      return nftCompleteCourses as KnowledgeBlockListResponse;
    }
  );

  const customGet = (_query: NftCompleteCourseQuery) =>
    getter([endpoints.nftCompleteCourseGroup, _query]);

  const result = useSWR(
    [endpoints.nftCompleteCourseGroup, query],
    getter,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    ...result,
    customGet,
  };
};
