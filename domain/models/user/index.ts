import CONST from 'config/constants.json';
import { UserEntity } from '@_types/models/entities';

const { GENDER } = CONST;

export const displayPublic = (userDetail: UserEntity) => ({
  profileImage: userDetail.profileImage,
  tokenId: userDetail.tokenId,
  fullName: userDetail.fullName,
  memberCode: userDetail.memberCode,
  gender: GENDER[userDetail.gender],
  dateOfBirth: userDetail.dateOfBirth,
  email: userDetail.email,
  personalEmail: userDetail.personalEmail,
  phone: userDetail.phone,
  expiredAt: userDetail.expiredAt,
  chainURI: userDetail.chainURI,
});
