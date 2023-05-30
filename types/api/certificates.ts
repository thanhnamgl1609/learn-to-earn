import { NftCompleteCourseEntity } from "@_types/models/entities";

export type GrantNftCompleteCourseParams = {
  studentTokenId: number;
  avgScore: number;
  classId: number;
  tokenURI: string;
};

export type CreatedNftCompleteCourse = {
  tokenId: number;
  studentTokenId: number;
  classId: number;
  avgScore: number;
  tokenURI: string;
  grantDate: Date;
};

export type NftCompleteCourseQuery = {
  id?: number;
  tokenId?: number;
  studentTokenId?: number;
}

export type NftCompleteCourseListResponse = {
  list: NftCompleteCourseEntity[];
  totalCredits: number;
  totalAvgScore: number;
}