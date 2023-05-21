import { CourseEntity } from '@_types/models/entities';
import endpoints from 'config/endpoints.json';
import { request } from 'utils';
import { useApi } from '@hooks/common';
import { useAccount, useUtilities } from '@hooks/web3';

export const useCreateCourseApi = (): ((
  data: Partial<CourseEntity>
) => Promise<CourseEntity>) => {
  const { account } = useAccount();
  const { getSignature } = useUtilities();

  const createCourseCaller = useApi(async (data: Partial<CourseEntity>) => {
    const signature = await getSignature();
    const result = (await request.post(endpoints.sign, {
      data,
      address: account.data,
      signature,
    })) as CourseEntity;

    return result;
  }, []);

  return createCourseCaller;
};
