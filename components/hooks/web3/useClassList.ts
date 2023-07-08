import useSWR from 'swr';

import { CryptoHookFactory } from '@_types/hooks';
import { Class } from '@_types/school';
import { formatClassResponses } from './formatter';
import { useApi } from '@hooks/common';

type UseClassListResponse = {};

export type UseClassListParams = {
  semester?: number;
};

type ClassListHookFactory = CryptoHookFactory<
  Class[],
  UseClassListResponse,
  UseClassListParams
>;

export type UseClassListHook = ReturnType<ClassListHookFactory>;

export const hookFactory: ClassListHookFactory =
  ({ contracts }) =>
  ({ semester } = { semester: 0 }) => {
    const getAllClassCaller = useApi(async () => {
      const caller = semester
        ? contracts!.school.getClassBySemester(semester)
        : contracts.school.getAllClasses();
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
