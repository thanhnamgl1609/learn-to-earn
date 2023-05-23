import useSWR from 'swr';

import { CryptoHookFactory } from '@_types/hooks';
import { Class } from '@_types/school';
import { formatClassResponses } from './formatter';
import { useApi } from '@hooks/common';

type UseClassListResponse = {};

export type UseClassListParams = {
  current?: boolean;
};

type ClassListHookFactory = CryptoHookFactory<
  Class[],
  UseClassListResponse,
  UseClassListParams
>;

export type UseClassListHook = ReturnType<ClassListHookFactory>;

export const hookFactory: ClassListHookFactory =
  ({ contracts }) =>
  ({ current } = { current: false }) => {
    const getAllClassCaller = useApi(async () => {
      const caller = current
        ? contracts!.nftSchool.getCurrentRegisteredClasses()
        : contracts.nftSchool.getAllClasses();
      const classes = await caller;
      const result = await formatClassResponses(classes);

      return result;
    });

    const { data, ...swr } = useSWR(
      contracts ? `web3/useClassList` : null,
      getAllClassCaller,
      {
        revalidateOnFocus: false,
      }
    );

    return {
      ...swr,
      data,
    };
  };
