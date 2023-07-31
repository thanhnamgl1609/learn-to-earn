import useSWR from 'swr';

import { CryptoHookFactory } from '@_types/hooks';
import { Class } from '@_types/school';
import { formatClassResponse } from './formatter';
import { useApi } from '@hooks/common';

type UseClassDetailResponse = {};

type ClassDetailHookFactory = CryptoHookFactory<
  Class,
  UseClassDetailResponse,
  UseClassDetailParams
>;

export type UseClassDetailParams = {
  id: number;
};

export type UseClassDetailHook = ReturnType<ClassDetailHookFactory>;

export const hookFactory: ClassDetailHookFactory =
  ({ contracts }) =>
  ({ id }) => {
    const getClassDetail = useApi(async () => {
      const classResponse = await contracts!.school.getClassById(id);
      const result = await formatClassResponse(classResponse);

      return result;
    });

    const { data, ...swr } = useSWR(
      contracts ? `web3/useClassDetail${id}` : null,
      getClassDetail,
      {}
    );

    return {
      ...swr,
      data,
    };
  };
