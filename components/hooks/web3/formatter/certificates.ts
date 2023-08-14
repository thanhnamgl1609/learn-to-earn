import {
  parseBigNumber,
  parseBigNumberFields,
  parseDate,
  request,
  TIMEOUT,
} from 'utils';

import Api from 'config/api.json';
import CONST from 'config/constants.json';
import {
  NftCompleteCourseEntity,
  NftGraduationEntity,
} from '@_types/models/entities';
import {
  NftCompleteCourseMetadata,
  NftGraduationMetadata,
} from '@_types/certificate';

type FormatNFTParams = {
  tokenId: number;
  metadataURI: string;
};

const { ROLES } = CONST;

export const formatNftCompleteCourseMetadata = (
  tokenId: number,
  chainURI: string,
  meta: NftCompleteCourseMetadata
): NftCompleteCourseEntity => ({
  avgScore: meta.score,
  chainURI,
  classId: meta.classInfo.onChainId,
  grantDate: new Date(meta.grantDate),
  studentTokenId: meta.student.tokenId,
  tokenId,
  class: {
    ...meta.classInfo,
    knowledgeBlock: null,
    course: {
      ...meta.classInfo.course,
      prevCourseId: null,
      prevCourse: undefined,
      status: 1,
      isRequired: meta.classInfo.course.isRequired === 'Bắt buộc',
    },
    courseCode: meta.course?.courseCode ?? '',
    startAt: new Date(meta.classInfo.startAt),
    completeAt: new Date(meta.classInfo.completeAt),
    teacher: {
      ...meta.teacher,
      role: ROLES.TEACHER,
      status: 1,
      registerDate: new Date(meta.student.registerDate),
      approveDate: new Date(meta.student.approveDate),
      dateOfBirth: new Date(meta.student.dateOfBirth),
      expiredAt: new Date(meta.student.expiredAt),
      gender: meta.student.gender === CONST.GENDER[0] ? 0 : 1,
    },
  },
  student: {
    ...meta.student,
    role: ROLES.STUDENT,
    status: 1,
    registerDate: new Date(meta.student.registerDate),
    approveDate: new Date(meta.student.approveDate),
    dateOfBirth: new Date(meta.student.dateOfBirth),
    expiredAt: new Date(meta.student.expiredAt),
    gender: meta.student.gender === CONST.GENDER[0] ? 0 : 1,
  },
});

export const formatNftCompleteCourse = async ({
  tokenId,
  metadataURI,
}: FormatNFTParams): Promise<NftCompleteCourseEntity | null> => {
  try {
    const result = await request.get(Api.proxy, {
      params: {
        l: metadataURI,
      },
    });
    const meta = result.data as NftCompleteCourseMetadata;

    return formatNftCompleteCourseMetadata(
      tokenId,
      metadataURI,
      meta
    );
  } catch (e) {
    return null;
  }
};

export const formatNftGraduation = async ({
  tokenId,
  metadataURI,
}: FormatNFTParams): Promise<NftGraduationEntity> => {
  try {
    const result = await request.get(Api.proxy, {
      params: {
        l: metadataURI,
      },
    });
    const meta = result.data as NftGraduationMetadata;

    return {
      ...meta,
      tokenId,
      uri: metadataURI,
      studentTokenId: meta.student.tokenId,
      grantDate: new Date(meta.grantDate),
      nftCompleteCourseIds: meta.nftCompleteCourses.map(
        ({ tokenId }) => tokenId
      ),
      nftCompleteCourses: meta.nftCompleteCourses.map(
        ({
          tokenId,
          chainURI,
          avgScore: score,
          class: classInfo,
          ...nftCompleteCourseMetadata
        }) =>
          formatNftCompleteCourseMetadata(tokenId, chainURI, {
            ...nftCompleteCourseMetadata,
            score,
            classInfo,
          })
      ),
      student: {
        ...meta.student,
        role: ROLES.STUDENT,
        status: 1,
        registerDate: new Date(meta.student.registerDate),
        approveDate: new Date(meta.student.approveDate),
        dateOfBirth: new Date(meta.student.dateOfBirth),
        expiredAt: new Date(meta.student.expiredAt),
        gender: meta.student.gender === CONST.GENDER[0] ? 0 : 1,
      },
    };
  } catch (e) {
    return null;
  }
};
