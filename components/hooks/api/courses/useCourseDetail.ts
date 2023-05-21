import useSWR, { SWRResponse } from 'swr';

import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils/request';
import { useApi } from '@hooks/common';
import { CourseEntity } from '@_types/models/entities';

export const useCourseDetailApi = (id: number): SWRResponse<CourseEntity> => {
  const result = useSWR([`${endpoints.courses}/${id}`], useApi(makeRequest()), {
    revalidateOnFocus: false,
  });
  return result;
};
