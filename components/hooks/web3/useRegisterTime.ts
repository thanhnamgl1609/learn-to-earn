import useSWR from 'swr';

import { CryptoHookFactory } from '@_types/hooks';
import { RegisterTime } from '@_types/school';
import { formatRegisterTime } from './formatter';
import { useApi } from '@hooks/common';
import { between, sameOrAfter, sameOrBefore } from 'utils';

type UseRegisterTimeResponse = {
  canCreateNewClass: boolean;
  canEditRegisterTime: boolean;
  canRegisterClass: boolean;
};

type RegisterTimeHookFactory = CryptoHookFactory<
  RegisterTime,
  UseRegisterTimeResponse
>;

export type UseRegisterTimeHook = ReturnType<RegisterTimeHookFactory>;

export const hookFactory: RegisterTimeHookFactory =
  ({ contracts }) =>
  () => {
    const getRegisterTime = useApi(async (semesterId: number) => {
      const registerTimeResponse =
        await contracts!.school.getRegisterTime(semesterId);

      return formatRegisterTime(registerTimeResponse);
    });

    const { data, ...swr } = useSWR(
      contracts
        ? `web3/useRegisterTime` + Math.floor(Math.random() + 500)
        : null,
      getRegisterTime
    );

    return {
      ...swr,
      data,
      canCreateNewClass:
        data?.registerEndAt && sameOrAfter(data.registerEndAt),
      canEditRegisterTime:
        !data?.registerEndAt || sameOrBefore(data.registerEndAt),
      canRegisterClass:
        data?.registerStartAt &&
        data?.registerEndAt &&
        between(data?.registerStartAt, data?.registerEndAt),
    };
  };
