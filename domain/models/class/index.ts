import { ClassEntity } from '@_types/models/entities';
import CONST from 'config/constants.json';
import { formatDate } from 'utils';

const { UI } = CONST;

export const createLoadingState = (): ClassEntity => ({
  id: 0,
  onChainId: 0,
  courseCode: '',
  knowledgeBlockId: 0,
  credits: 0,
  startAt: new Date(),
  completeAt: new Date(),
  maxSize: 0,
  teacherTokenId: 0,
  chainURI: '',
  semesterId: 0,
  registerClassFee: 0,
});

export const displayRegisterFee = (registerFee?: number) =>
  `${registerFee ?? 0} ETH`;

export const displayClassDetail = (classDetail: ClassEntity) => ({
  ...classDetail,
  startAt: formatDate(classDetail?.startAt, UI.INPUT_DATE_FORMAT),
  completeAt: formatDate(classDetail?.completeAt, UI.INPUT_DATE_FORMAT),
  registerClassFee: displayRegisterFee(classDetail?.registerClassFee),
});

export const displayPublic = (classDetail: ClassEntity) => ({
  onChainId: classDetail.onChainId,
  knowledgeBlockId: classDetail.knowledgeBlockId,
  teacherTokenId: classDetail.teacherTokenId,
  credits: classDetail.credits,
  completeAt: classDetail.completeAt,
  maxSize: classDetail.maxSize,
  chainURI: classDetail.chainURI,
});
