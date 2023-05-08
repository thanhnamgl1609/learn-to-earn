import useSWR from 'swr';

import { CryptoHookFactory } from '@_types/hooks';
import { RegisterTime } from '@_types/school';
import { formatRegisterTime } from './formatter';
import { useApi } from '@hooks/common';
import { parseTimeStamp, sameOrAfter, sameOrBefore } from 'utils';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

type UseRegisterTimeResponse = {
  canCreateNewClass: boolean;
  canEditRegisterTime: boolean;
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
    const getRegisterTime = useApi(async () => {
      const registerTimeResponse = await contracts!.nftSchool.getRegisterTime();

      return formatRegisterTime(registerTimeResponse);
    });

    const { data, ...swr } = useSWR(
      contracts ? `web3/useRegisterTime` : null,
      getRegisterTime,
      {
        revalidateOnFocus: false,
      }
    );

    const editRegisterTime = useCallback(
      async ({ registerStartAt, registerEndAt }: RegisterTime) => {
        if (!contracts) return null;
        const tx = await contracts.nftSchool.updateRegisteredTime(
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
      canCreateNewClass:
        data?.registerStartAt && sameOrAfter(data.registerStartAt),
      canEditRegisterTime:
        !data?.registerEndAt || sameOrBefore(data.registerEndAt),
      editRegisterTime,
    };
  };
