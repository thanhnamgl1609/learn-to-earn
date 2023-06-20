import { NftClassRegistrationEntity } from '@_types/models/entities';

export type ClassQuery = {
  onChainId?: number;
  semesterId?: number | string;
  teacherTokenId?: number;
};

export type ClassApi = {
  id: number;
  onChainId: number;
  courseCode: string;
  knowledgeBlockId: number;
  credits: number;
  startAt: Date;
  completeAt: Date;
  maxSize: number;
  teacherTokenId: number;
  chainURI: string;
  semesterId: number;
};

export type CreatedClass = Omit<ClassApi, 'id'>;

export type NftClassRegistrationQuery = {
  studentTokenId?: number | string;
  tokenId?: number | string;
  classId?: number | string;
  isRegained?: 0 | 1;
};

export type CreatedNftClassRegistration = {
  tokenId: number;
  classId: number;
  studentTokenId: number;
  chainURI: string;
  registerDate: string;
  registerFee: number;
};

export type NftClassRegistrationEntityWithApproveStatus =
  NftClassRegistrationEntity & {
    isApproved?: boolean;
    isApprovedSent?: boolean;
    isRegained?: boolean;
    isInQueue?: boolean;
  };
