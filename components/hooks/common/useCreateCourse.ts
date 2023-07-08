import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { makeRequest } from 'utils';
import CONST from '@config/constants.json';
import ROUTES from '@config/routes.json';
import endpoints from '@config/endpoints.json';
import { useAccount, useSchoolActions, useUtilities } from '@hooks/web3';
import { CREATE_COURSE } from '@validators/schemas';
import { useValidator } from '@hooks/form';
import { CourseCore, CourseMeta } from '@_types/school';
import { uploadData } from '@store/actions';
import { useAppDispatch } from '@hooks/stores';
import { useApi } from './useApi';

const { UPLOAD_TARGET } = CONST;

export const useCreateCourse = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const validator = useValidator(CREATE_COURSE);

  const { getSignedData } = useUtilities();
  const { createCourse } = useSchoolActions();
  const {
    account: { data: account },
  } = useAccount();

  return useApi(async (formState: Omit<CourseMeta & CourseCore, 'status'>) => {
    const _formState = {
      ...formState,
      isRequired: formState.isRequired ? 1 : 0,
    };
    if (!validator(_formState)) return;
    const existedCourse = await makeRequest()([
      endpoints.coursesDetail,
      {
        courseCode: _formState.courseCode,
      },
    ]);
    if (existedCourse) return toast.error('Mã môn học đã tồn tại');

    const { knowledgeBlockId, prevCourseId, credits, courseCode } = _formState;
    const signature = await getSignedData();
    const { link: uri } = await dispatch(
      uploadData({
        data: { target: UPLOAD_TARGET.CREATE_COURSE, ..._formState },
        signature,
        successText: 'Upload course successfully!',
      })
    ).unwrap();
    const createdCourse = {
      knowledgeBlockId,
      prevCourseId,
      credits,
      uri,
      courseCode,
    };
    const onChainId = await createCourse({ data: createdCourse });
    if (!_formState.prevCourseId) {
      _formState.prevCourseId = null;
    }
    const { id } = await makeRequest({
      method: 'POST',
      data: {
        data: {
          ..._formState,
          onChainId,
          chainURI: uri,
        },
        signature,
        address: account,
      },
    })([endpoints.courses]);
    router.push(ROUTES.courseDetail.name.replace(':id', id.toString()));
  }, []);
};
