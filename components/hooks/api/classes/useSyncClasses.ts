import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { CreatedClass } from '@_types/api/class';
import { SignatureData } from '@_types/common';
import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils';
import { selectUser } from '@store/userSlice';
import { useUtilities } from '@hooks/web3';
import { usePromiseHandler } from '@hooks/common';
import { useAppSelector } from '@hooks/stores';

type Params = {
  data: CreatedClass;
  signature?: string;
};

export const useSyncCreatedClass = () => {
  const { account } = useAppSelector(selectUser);
  const { getSignedData } = useUtilities();
  const promiseHandler = usePromiseHandler();

  return useCallback(async ({ data, signature: _signature }: Params) => {
    let signature = _signature;

    if (!signature) {
      signature = await getSignedData();
    }

    const promise = makeRequest({
      method: 'POST',
      data: {
        data,
        address: account,
        signature,
      },
    })([endpoints.syncClassDetail]);

    await promiseHandler({
      successMsg: 'Đồng bộ lớp học thành công',
      errorMsg: 'Đồng bộ lớp học thất bại',
      promise,
    });
  }, []);
};
