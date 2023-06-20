import { CourseQuery } from '@_types/api/course';
import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils/request';
import { useApi } from '@hooks/common';
import { useUtilities } from '@hooks/web3';
import { selectUser } from '@store/userSlice';
import { useAppSelector } from '@hooks/stores';

export const useSyncCourse = (callback: () => void) => {
  const { getSignedData } = useUtilities();
  const { account } = useAppSelector(selectUser);

  return useApi(async () => {
    const signature = await getSignedData();

    await makeRequest({
      method: 'POST',
      data: {
        signature,
        address: account,
      },
      options: {
        timeout: 100000,
      },
    })([endpoints.syncCourse]);
    callback();
  });
};
