import { CourseApi } from '@_types/api/course';
import { UserDetail } from '@_types/api/user';
import { SemesterDetail } from '@_types/api/semester';
import { findById } from 'utils';
import CONST from '@config/constants.json';
import { CREATE_CLASS, EXTEND_CREATE_CLASS } from '@validators/schemas';
import { uploadData } from '@store/actions';
import { useSchoolActions, useUtilities } from '@hooks/web3';
import { useValidator } from '@hooks/form';
import { useAppDispatch } from '@hooks/stores';
import { useSyncCreatedClass } from '@hooks/api/classes';
import { useApi } from './useApi';

const { UPLOAD_TARGET } = CONST;

export const useCreateClass = () => {
  const { getSignedData } = useUtilities();
  const dispatch = useAppDispatch();
  const { createClass } = useSchoolActions();
  const validator = useValidator(CREATE_CLASS);
  const syncClass = useSyncCreatedClass();

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
      await createClass({
        data: createdClass,
        onSuccess: (onChainId) => {
          syncClass({
            data: {
              onChainId,
              chainURI: uri,
              completeAt: data.completeAt,
              courseCode: course.courseCode,
              credits: course.credits,
              knowledgeBlockId: course.knowledgeBlockId,
              maxSize: data.maxSize,
              semesterId: data.semesterId,
              startAt: data.startAt,
              teacherTokenId: data.teacherTokenId,
            },
            signature,
          });
        },
      });
    },
    []
  );
};
