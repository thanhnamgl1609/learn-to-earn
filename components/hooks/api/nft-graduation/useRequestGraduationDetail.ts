import useSWR from 'swr';
import { makeRequest } from 'utils';
import endpoints from 'config/endpoints.json';
import { RequestGraduationQuery } from '@_types/api/certificates';
import { useApi } from '@hooks/common';
import { RequestGraduationEntity } from '@_types/models/entities';

export const useRequestGraduationDetail = (query: RequestGraduationQuery) => {
  const getter = useApi(async (params: [string, { onChainId: number }]) => {
    const requestDetail = (await makeRequest()(
      params
    )) as RequestGraduationEntity;

    return requestDetail;
  });

  const result = useSWR([endpoints.requestGraduationDetail, query], getter, {
    revalidateOnFocus: false,
  });

  return result;
};

export const getRequestGraduationDetail = async (
  query: RequestGraduationQuery
) => {
  const requestGraduation = await makeRequest()([
    endpoints.requestGraduationDetail,
    query,
  ]);

  return requestGraduation;
};
