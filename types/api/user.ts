export type UserQuery = {
  tokenId?: number;
  registerAddress?: string;
  role?: number;
};

export type UserDetail = {
  id: number;
  profileImage: string;
  tokenId: number;
  fullName: string;
  memberCode: string;
  gender: number;
  dateOfBirth: Date;
  email: string;
  personalEmail: string;
  identityNumber: string;
  phone: string;
  role: number;
  status: number;
  registerAddress: string;
  expiredAt: Date;
  chainURI: string;
};
