export type ClassQuery = {
  onChainId?: number;
  semesterId?: number | string;
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

export type NftClassRegistrationQuery = {
  tokenId?: number | string;
};

export type CreatedNftClassRegistration = {
  tokenId: number;
  classId: number;
  studentTokenId: number;
  chainURI: string;
};
