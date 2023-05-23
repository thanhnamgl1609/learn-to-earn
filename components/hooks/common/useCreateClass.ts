import { useRouter } from 'next/router';

import { CourseApi } from '@_types/api/course';
import { UserDetail } from '@_types/api/user';
import { findById, makeRequest } from 'utils';
import CONST from '@config/constants.json';
import endpoints from 'config/endpoints.json';
import { useAccount, useSchoolActions, useUtilities } from '@hooks/web3';
import { CREATE_CLASS, EXTEND_CREATE_CLASS } from '@validators/schemas';
import { useValidator } from '@hooks/form';
import { uploadData } from '@store/actions';
import { useAppDispatch } from '@hooks/stores';
import { useApi } from './useApi';
import { SemesterDetail } from '@_types/api/semester';

const { UPLOAD_TARGET } = CONST;

export const useCreateClass = () => {
  const { getSignedData } = useUtilities();
  const dispatch = useAppDispatch();
  const { createClass } = useSchoolActions();
  const validator = useValidator(CREATE_CLASS);

  return useApi(
    async (
      formState: {
        courseId: number | string;
        endAt: string;
        completeAt: string;
        maxSize: number | string;
        teacherTokenId: number | string;
        semesterId: number | string;
      },
      courses: CourseApi[],
      teachers: UserDetail[],
      semesters: SemesterDetail[]
    ) => {
      const semester = semesters.find(
        ({ id }) => id === parseInt(formState.semesterId as string)
      );
      if (!semester) return;

      const data = validator(formState, (_schema) =>
        EXTEND_CREATE_CLASS(_schema, semester)
      ) as {
        courseId: number;
        teacherTokenId: number;
        maxSize: number;
        semesterId: number;
        startAt: Date;
        completeAt: Date;
      };
      if (!data) return;

      const course = findById(courses, data.courseId, 'onChainId');
      const teacher = findById(teachers, data.teacherTokenId, 'tokenId');
      const signature = await getSignedData();
      const { link: uri } = await dispatch(
        uploadData({
          data: {
            target: UPLOAD_TARGET.CREATE_CLASS,
            semesterId: data.semesterId,
            startAt: data.startAt,
            completeAt: data.completeAt,
            size: data.maxSize,
            courseCode: course.courseCode,
            courseName: course.name,
            teacherTokenId: teacher.tokenId,
            teacherName: teacher.fullName,
          },
          signature,
          successText: 'Upload class metadata successfully!',
        })
      ).unwrap();
      const createdClass: any = {
        ...data,
        uri,
      };
      await createClass({ data: createdClass });
    },
    []
  );
};
