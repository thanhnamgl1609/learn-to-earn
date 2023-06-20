import useSWR from 'swr';
import { makeRequest } from 'utils';
import endpoints from 'config/endpoints.json';
import { RequestGraduationListQuery } from '@_types/api/certificates';
import { useApi } from '@hooks/common';
import { RequestGraduationEntity } from '@_types/models/entities';

export const useRequestGraduationList = (
  query: RequestGraduationListQuery = {}
) => {
  const getter = useApi(
    async (params: [string, RequestGraduationListQuery]) => {
      const requestList = (await makeRequest()(
        params
      )) as RequestGraduationEntity[];

      return requestList;
    }
  );

  const result = useSWR([endpoints.requestGraduationList, query], getter, {
    revalidateOnFocus: false,
  });

  return result;
};

export const getRequestGraduationList = async (
  query: RequestGraduationListQuery = {}
) => {
  const requestGraduation = await makeRequest()([
    endpoints.requestGraduationList,
    query,
  ]);

  return requestGraduation;
};
