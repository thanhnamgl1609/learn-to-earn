import useSWR from 'swr';

import { CryptoHookFactory } from '@_types/hooks';
import { Class } from '@_types/school';
import { formatClassResponses } from './formatter';
import { useApi } from '@hooks/common';

type UseAssignedClassesResponse = {};

export type UseAssignedClassesParams = {
  tokenId: number | null;
};

type AssignedClassesHookFactory = CryptoHookFactory<
  Class[],
  UseAssignedClassesResponse,
  UseAssignedClassesParams
>;

export type UseAssignedClassesHook = ReturnType<AssignedClassesHookFactory>;

export const hookFactory: AssignedClassesHookFactory =
  ({ contracts }) =>
  ({ tokenId } = { tokenId: null }) => {
    const getAllClassCaller = useApi(async () => {
      if (!tokenId) return [];
      const result = await contracts!.nftSchool.getAssignedClasses(tokenId);

      return formatClassResponses(result);
    });

    const { data, ...swr } = useSWR(
      contracts ? `web3/useAssignedClasses` : null,
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
