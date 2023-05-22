import { useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';

import { CourseQuery } from '@_types/api/course';
import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils/request';
import { useApi } from '@hooks/common';
import { CourseEntity } from '@_types/models/entities';

export const useCourseListApi = (
  query?: CourseQuery
): SWRResponse<CourseEntity[]> => {
  const _query = useMemo(() => {
    const { knowledgeBlockId, ...other } = query || {};
    if (knowledgeBlockId && parseInt(knowledgeBlockId as string) === 0) {
      return other;
    }

    return query;
  }, [query]);
  const result = useSWR([endpoints.courses, _query], useApi(makeRequest()), {
    revalidateOnFocus: false,
  });

  return result;
};