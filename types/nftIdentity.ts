export type RegistrationInfo = {
  fullName: string;
  documentURIs: string[];
};

export type StudentMeta = {
  fullName: string;
};

export type TeacherMeta = {
  fullName: string;
  documentURIs: string[];
};

export type MetaType = TeacherMeta | StudentMeta;

export type NftIdentityCore = {
  tokenId: number;
  expiredAt: number;
  register: string;
};

export type NftIdentity = {
  meta: MetaType;
} & NftIdentityCore;
