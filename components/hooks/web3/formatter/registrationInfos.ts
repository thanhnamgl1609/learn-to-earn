import {
  RegistrationinfoResponse,
  RegistrationinforesponseResponse,
} from '@_types/contracts/NftIdentities';
import { RegistrationInfo, RegistrationInfoMeta } from '@_types/nftIdentity';
import request from 'utils/request';
import Api from 'config/api.json';

export const formatRegistrationInfo = async (
  { applicant, documentURI }: RegistrationinfoResponse,
  role: number
): Promise<RegistrationInfo> => {
  const { data: meta } = await request.get(Api.proxy, {
    params: {
      l: documentURI,
    },
  });

  return {
    applicant,
    documentURI,
    meta,
    role,
  };
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
    } as RegistrationinfoResponse,
    raw.role.toNumber()
  );

export const formatRegistrationInfoResponses = async (
  raws: RegistrationinforesponseResponse[]
): Promise<RegistrationInfo[]> =>
  Promise.all(raws.map((raw) => formatRegistrationInfoResponse(raw)));
