import {
  RegistrationinfoResponse,
  RegistrationinforesponseResponse,
} from '@_types/contracts/NftIdentities';
import { RegistrationInfo, RegistrationInfoMeta } from '@_types/nftIdentity';
import { logger, request } from 'utils';
import Api from 'config/api.json';
import { ENV_CONST } from '@config/env-const';

const defaultMeta: RegistrationInfoMeta = {
  fullName: '',
  profileImage: `${ENV_CONST.IMAGE_PREFIX}/default_avatar.png`,
  documentURIs: [],
  gender: 0,
  dateOfBirth: new Date('2000-01-01'),
  email: '',
  personalEmail: '',
  identityNumber: '',
  phone: '',
  memberCode: '',
};

export const formatRegistrationInfo = async (
  { applicant, documentURI }: Partial<RegistrationinfoResponse>,
  role: number
): Promise<RegistrationInfo> => {
  try {
    const { data: meta } = await request.get(Api.proxy, {
      params: {
        l: documentURI,
      },
    });
    meta.dateOfBirth = new Date(meta.dateOfBirth);

    return {
      applicant,
      documentURI,
      meta,
      role,
      isUploading: false,
    };
  } catch (error) {
    logger(error);
    return {
      applicant,
      documentURI,
      meta: defaultMeta,
      role,
      isUploading: true,
    };
  }
};

export const formatRegistrationInfos = async (
  raws: RegistrationinfoResponse[],
  role: number
) => Promise.all(raws.map((raw) => formatRegistrationInfo(raw, role)));

export const formatRegistrationInfoResponse = (
  raw: RegistrationinforesponseResponse
): Promise<RegistrationInfo> =>
  formatRegistrationInfo(
    {
      applicant: raw.detail.applicant,
      documentURI: raw.detail.documentURI,
    },
    raw.role.toNumber()
  );

export const formatRegistrationInfoResponses = async (
  raws: RegistrationinforesponseResponse[]
): Promise<RegistrationInfo[]> =>
  Promise.all(raws.map((raw) => formatRegistrationInfoResponse(raw)));
