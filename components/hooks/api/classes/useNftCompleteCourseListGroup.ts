import useSWR, { SWRResponse } from 'swr';

import { NftCompleteCourseEntity } from '@_types/models/entities';
import CONST from 'config/constants.json';
import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils/request';
import { useApi } from '@hooks/common';
import {
  NftCompleteCourseQuery,
  KnowledgeBlockListResponse,
} from '@_types/api/certificates';
import { NftCompleteCourse } from '@_types/certificate';

export const useNftCompleteCourseListGroupApi = (
  query: NftCompleteCourseQuery
): SWRResponse<KnowledgeBlockListResponse> => {
  const getter = useApi(async (params: [string, NftCompleteCourse]) => {
    const nftCompleteCourses = await makeRequest()(params);

    return nftCompleteCourses as KnowledgeBlockListResponse;
  });

  const result = useSWR([endpoints.nftCompleteCourseGroup, query], getter, {
    revalidateOnFocus: false,
  });

  return result;
};
