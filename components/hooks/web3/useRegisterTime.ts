import useSWR from 'swr';

import { CryptoHookFactory } from '@_types/hooks';
import { RegisterTime } from '@_types/school';
import { formatRegisterTime } from './formatter';
import { useApi } from '@hooks/common';
import {
  between,
  parseDate,
  parseTimeStamp,
  sameOrAfter,
  sameOrBefore,
} from 'utils';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

type UseRegisterTimeResponse = {
  canCreateNewClass: boolean;
  canEditRegisterTime: boolean;
  canRegisterClass: boolean;
  editRegisterTime: (registerTime: RegisterTime) => Promise<void>;
};

type RegisterTimeHookFactory = CryptoHookFactory<
  RegisterTime,
  UseRegisterTimeResponse
>;

export type UseRegisterTimeHook = ReturnType<RegisterTimeHookFactory>;

export const hookFactory: RegisterTimeHookFactory =
  ({ contracts }) =>
  () => {
    const getRegisterTime = useApi(async (semesterId) => {
      const registerTimeResponse = await contracts!.school.getRegisterTime(semesterId);

      return formatRegisterTime(registerTimeResponse);
    });

    const { data, ...swr } = useSWR(
      contracts ? `web3/useRegisterTime` + Math.floor(Math.random() + 500) : null,
      getRegisterTime,
      {
        revalidateOnFocus: false,
      }
    );

    const editRegisterTime = useCallback(
      async ({ registerStartAt, registerEndAt }: RegisterTime) => {
        if (!contracts) return null;
        const tx = await contracts.school.updateRegisteredTime(
          parseTimeStamp(registerStartAt),
          parseTimeStamp(registerEndAt)
        );

        await toast.promise(tx!.wait(), {
          pending: 'Đang xử lý...',
          success: 'Cập nhật thành công',
          error: 'Cập nhật thất bại',
        });
      },
      [contracts]
    );

    return {
      ...swr,
      data,
      canCreateNewClass: data?.registerEndAt && sameOrAfter(data.registerEndAt),
      canEditRegisterTime:
        !data?.registerEndAt || sameOrBefore(data.registerEndAt),
      editRegisterTime,
      canRegisterClass:
        data?.registerStartAt &&
        data?.registerEndAt &&
        between(data?.registerStartAt, data?.registerEndAt),
    };
  };
