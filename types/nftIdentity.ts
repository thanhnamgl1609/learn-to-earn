export type RegistrationInfoRaw = {
  applicant: string;
  documentURI: string;
};

export type RegistrationInfo = {
  meta: RegistrationInfoMeta;
} & RegistrationInfoRaw;

export type RegistrationInfoMeta = TeacherMeta; // | EducationManagerMeta

export type StudentMeta = {
  fullName: string;
};

export type TeacherMeta = {
  fullName: string;
  profileImage: string;
  documentURIs: string[];
};

export type MetaType = TeacherMeta | StudentMeta; // | EducationManagerMeta

export type NftIdentityCore = {
  tokenId: number;
  expiredAt: Date;
  register: string;
};

export type NftIdentity = {
  meta: MetaType;
} & NftIdentityCore;
