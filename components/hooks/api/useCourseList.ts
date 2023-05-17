import useSWR from 'swr';

import { CourseQuery } from '@_types/api/course';
import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils/request';
import { useApi } from '@hooks/common';

export const useCourseList = (query?: CourseQuery) => {
  const result = useSWR(
    [endpoints.courses, query],
    useApi(
      makeRequest({
        method: 'GET',
      })
    ),
    {
      revalidateOnFocus: false,
    }
  );

  return result;
};
