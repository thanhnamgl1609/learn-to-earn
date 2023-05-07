import { findById, after } from 'utils';
import CONST from '@config/constants.json';
import {
  useCourseList,
  useMemberList,
  useRegisterTime,
  useSchoolActions,
  useUtilities,
} from '@hooks/web3';
import { CREATE_CLASS } from '@validators/schemas';
import { useValidator } from '@hooks/form';
import { Class } from '@_types/school';
import { uploadData } from '@store/actions';
import { useAppDispatch } from '@hooks/stores';
import { useApi } from './useApi';
import { useCallback } from 'react';

const { UPLOAD_TARGET, ROLES } = CONST;

export const useCreateClass = () => {
  const { getSignedData } = useUtilities();
  const {
    courseList: { data: courses },
  } = useCourseList();
  const {
    memberList: { data: teachers },
  } = useMemberList({ role: ROLES.TEACHER });
  const {
    registerTime: { data: registerTime },
  } = useRegisterTime();
  const dispatch = useAppDispatch();
  const { createClass } = useSchoolActions();
  const validator = useValidator(
    CREATE_CLASS.refine(
      ({ completeAt }) =>
        after(completeAt, registerTime?.registerEndAt || new Date()),
      {
        message: 'Môn học phải hoàn thành sau thời gian đăng ký',
      }
    ),
    [registerTime]
  );

  const caller = useApi(
    async (
      formState: Pick<
        Class,
        'courseId' | 'teacherTokenId' | 'maxSize' | 'completeAt'
      >
    ) => {
      if (!validator(formState)) return;

      const course = findById(courses, formState.courseId);
      const teacher = findById(teachers, formState.teacherTokenId, 'tokenId');
      const uri = await dispatch(
        uploadData({
          data: {
            target: UPLOAD_TARGET.CREATE_CLASS,
            course: {
              id: course.id,
              name: course.meta.name,
            },
            teacher: {
              tokenId: teacher.tokenId,
              name: teacher.meta.fullName,
            },
          },
          getSignedData,
          successText: 'Upload class metadata successfully!',
        })
      ).unwrap();
      const createdClass = {
        ...formState,
        uri,
      };
      await createClass({ data: createdClass });
    },
    []
  );

  return useCallback(
    (formState: {
      courseId: number | string;
      completeAt: string;
      maxSize: number | string;
      teacherTokenId: number | string;
      size?: number | string;
    }) => {
      const data = validator(formState);
      if (!data) return;

      return caller(data);
    },
    []
  );
};
