import { RequestGraduationEntity } from '@_types/models/entities';
import { parseBigNumbers } from 'utils';

export const formatRequestGraduations = (data: any, studentTokenId: number) => {
  return {
    studentTokenId,
    nftCompleteCourseTokenIds: parseBigNumbers(data[0]),
    uri: data[1],
  };
};
