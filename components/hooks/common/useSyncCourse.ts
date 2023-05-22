import useSWR from 'swr';

import { CourseQuery } from '@_types/api/course';
import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils/request';
import { useApi } from '@hooks/common';
import { useUtilities } from '@hooks/web3';
import { selectUser } from '@store/userSlice';


export const useSyncCourse = (query?: CourseQuery) => {
  const { getSignedData } = useUtilities();
  const { account } = useAppSelector(selectUser);

  return useApi(async () => {
      const signature = await getSignedData();

      makeRequest({
        method: 'POST',
        data: {
          signature,
          address: account,
        },
      });
    },
  );
};
