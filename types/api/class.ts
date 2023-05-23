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
