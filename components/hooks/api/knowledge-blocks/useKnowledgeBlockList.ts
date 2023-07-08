import { useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';

import { CourseQuery } from '@_types/api/course';
import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils/request';
import { useApi } from '@hooks/common';
import { CourseEntity, KnowledgeBlockEntity } from '@_types/models/entities';

export const useKnowledgeBlockListApi = (): SWRResponse<
  KnowledgeBlockEntity[]
> => {
  const result = useSWR([endpoints.knowledgeBlocks], useApi(makeRequest()), {
    revalidateOnFocus: false,
  });

  return result;
};

export const getKnowledgeBlockList = () =>
  makeRequest()([endpoints.knowledgeBlocks]);
