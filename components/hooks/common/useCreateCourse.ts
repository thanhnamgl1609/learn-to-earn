import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { logger } from 'utils';
import ERROR_MESSAGE from '@config/error-message.json';
import CONST from '@config/constants.json';
import ROUTES from '@config/routes.json';
import { useSchoolActions, useUtilities } from '@hooks/web3';
import { CREATE_COURSE } from '@validators/schemas';
import { useValidator } from '@hooks/form';
import { Course, CourseMeta } from '@_types/school';
import { uploadData } from '@store/actions';
import { loading, unloading } from '@store/appSlice';
import { useAppDispatch } from '@hooks/stores';
import { useApi } from './useApi';

const { UPLOAD_TARGET } = CONST;

export const useCreateCourse = () => {
  const router = useRouter();
  const { getSignedData } = useUtilities();
  const dispatch = useAppDispatch();
  const { createCourse } = useSchoolActions();
  const validator = useValidator(CREATE_COURSE);

  const apiCaller = useApi(
    async (formState: Omit<Course, 'id' | 'meta' | 'status'> & CourseMeta) => {
      if (!validator(formState)) return;
      dispatch(loading());

      try {
        const { name, ...coreCourse } = formState;
        const uri = await dispatch(
          uploadData({ data: { target: UPLOAD_TARGET.CREATE_COURSE, name }, getSignedData })
        ).unwrap();
        const createdCourse = {
          ...coreCourse,
          uri,
        };
        if (!validator(formState)) return;
        const id = await createCourse({ data: createdCourse });
        router.push(ROUTES.courseDetail.name.replace(':id', id.toString()));
      } catch (e) {
        logger(e, { method: 'error' });
        toast.error(ERROR_MESSAGE.UNEXPECTED);
      } finally {
        dispatch(unloading());
      }
    },
    []
  );

  return apiCaller;
};
