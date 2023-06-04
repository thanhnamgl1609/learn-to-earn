export type RegistrationInfoRaw = {
  applicant: string;
  documentURI: string;
};

export type RegistrationInfo = {
  role: number;
  meta: RegistrationInfoMeta;
  isUploading?: boolean;
} & RegistrationInfoRaw;

export type RegistrationInfoMeta = RegisterTeacherMeta | RegisterStudentMeta; // | EducationManagerMeta

export type RegisterStudentMeta = {
  fullName: string;
  memberCode: string;
  profileImage: string;
  documentURIs: string[];
  gender: number;
  dateOfBirth: Date;
  email: string;
  personalEmail: string;
  identityNumber: string;
  phone: string;
  registerDate: Date;
};

export type RegisterTeacherMeta = {
  fullName: string;
  memberCode: string;
  profileImage: string;
  documentURIs: string[];
  gender: number;
  dateOfBirth: Date;
  email: string;
  personalEmail: string;
  identityNumber: string;
  phone: string;
  registerDate: Date;
};
export type StudentMeta = RegisterStudentMeta & {
  documentURI: string;
  approveDate: Date;
};

export type TeacherMeta = RegisterTeacherMeta & {
  documentURI: string;
  approveDate: Date;
};

export type NftIdentityMetaType = TeacherMeta | StudentMeta; // | EducationManagerMeta

export type NftIdentityCore = {
  tokenId: number;
  expiredAt: Date;
  register: string;
  isExpired: boolean;
};

export type NftIdentity = {
  role: number;
  tokenURI: string;
  meta: NftIdentityMetaType;
  isUploading?: boolean;
} & NftIdentityCore;
