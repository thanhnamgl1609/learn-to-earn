import useSWR, { SWRResponse } from 'swr';

import { NftCompleteCourse } from '@_types/certificate';
import { NftCompleteCourseEntity } from '@_types/models/entities';
import {
  NftCompleteCourseQuery,
  NftCompleteCourseListResponse,
} from '@_types/api/certificates';
import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils/request';
import { useApi } from '@hooks/common';

export const useNftCompleteCourseListApi = (
  query: NftCompleteCourseQuery
): SWRResponse<NftCompleteCourseListResponse> => {
  const getter = useApi(
    async (params: [string, NftCompleteCourse]) => {
      const nftCompleteCourses = await makeRequest()(params);

      return nftCompleteCourses as NftCompleteCourseListResponse;
    }
  );

  const result = useSWR(
    [endpoints.nftCompleteCourse, query],
    getter,
    {}
  );

  return result;
};

export const useNftCompleteCourseListGetter = () => {
  return useApi(async (query: NftCompleteCourseQuery) => {
    const nftCompleteCourses = await makeRequest()([
      endpoints.nftCompleteCourse,
      query,
    ]);

    return nftCompleteCourses as NftCompleteCourseEntity[];
  });
};
