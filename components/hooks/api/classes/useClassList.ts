import { useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';

import { ClassEntity } from '@_types/models/entities';
import { ClassQuery } from '@_types/api/class';
import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils/request';
import { useApi } from '@hooks/common';

export const useClassListApi = (
  query?: ClassQuery
): SWRResponse<ClassEntity[]> => {
  const _query = useMemo(() => {
    const q: ClassQuery = { ...query };
    if (q.semesterId && parseInt(q.semesterId as string) === 0)
      delete q.semesterId;

    return q;
  }, [query]);

  const result = useSWR([endpoints.classes, _query], useApi(makeRequest()), {
    revalidateOnFocus: false,
  });

  return result;
};
