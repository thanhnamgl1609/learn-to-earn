export type RegistrationInfoRaw = {
  applicant: string;
  documentURI: string;
};

export type RegistrationInfo = {
  role: number;
  meta: RegistrationInfoMeta;
  isUploading?: boolean;
} & RegistrationInfoRaw;

export type RegistrationInfoMeta = TeacherMeta | StudentMeta; // | EducationManagerMeta

export type StudentMeta = {
  fullName: string;
  profileImage: string;
  documentURIs: string[];
};

export type TeacherMeta = {
  fullName: string;
  profileImage: string;
  documentURIs: string[];
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
