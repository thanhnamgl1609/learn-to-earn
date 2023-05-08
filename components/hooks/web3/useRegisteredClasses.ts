import useSWR from 'swr';

import { CryptoHookFactory } from '@_types/hooks';
import { NftClassRegistration } from '@_types/school';
import { formatNftClassRegistrationResponses } from './formatter';
import { useApi } from '@hooks/common';

type UseRegisteredClassesResponse = {};

type RegisteredClassesHookFactory = CryptoHookFactory<
  NftClassRegistration[],
  UseRegisteredClassesResponse
>;

export type UseRegisteredClassesHook = ReturnType<RegisteredClassesHookFactory>;

export const hookFactory: RegisteredClassesHookFactory =
  ({ contracts }) =>
  () => {
    const getAllClassCaller = useApi(async () => {
      const result = await contracts!.nftSchool.getRegisteredClasses();

      return formatNftClassRegistrationResponses(result);
    });

    const { data, ...swr } = useSWR(
      contracts ? `web3/useRegisteredClasses` : null,
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
