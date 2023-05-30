import useSWR, { SWRResponse } from 'swr';

import { NftCompleteCourseEntity } from '@_types/models/entities';
import CONST from 'config/constants.json';
import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils/request';
import { useApi } from '@hooks/common';
import {
  NftCompleteCourseQuery,
  NftCompleteCourseListResponse,
} from '@_types/api/certificates';
import { NftCompleteCourse } from '@_types/certificate';

export const useNftCompleteCourseListApi = (
  query: NftCompleteCourseQuery
): SWRResponse<NftCompleteCourseListResponse> => {
  const getter = useApi(async (params: [string, NftCompleteCourse]) => {
    const nftCompleteCourses = await makeRequest()(params);

    return nftCompleteCourses as NftCompleteCourseListResponse;
  });

  const result = useSWR([endpoints.nftCompleteCourse, query], getter, {
    revalidateOnFocus: false,
  });

  return result;
};
