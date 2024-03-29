import { NftGraduationEntity, RequestGraduationEntity } from '@_types/models/entities';

export const formatGraduation = (
  requestGraduation: RequestGraduationEntity | NftGraduationEntity,
) => {
  const nftCompleteCourses =
    requestGraduation.nftCompleteCourseGraduationRelations.map(
      ({ nftCompleteCourse }) => nftCompleteCourse
    );
  delete requestGraduation.nftCompleteCourseGraduationRelations;

  return {
    ...requestGraduation,
    nftCompleteCourses,
  };
};
