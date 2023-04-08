import { RegistrationinforesponseResponse } from '@_types/contracts/NftIdentities';
import { RegistrationInfo } from '@_types/nftIdentity';
import axios from 'axios';

export const formatRegistrationInfo = async (
  raw: RegistrationinforesponseResponse
): Promise<RegistrationInfo> => {
  const { data: meta } = await axios.get(raw.detail.documentURI);

  return {
    applicant: raw.detail.applicant,
    documentURI: raw.detail.documentURI,
    meta,
    role: raw.role.toNumber(),
  };
};

export const formatRegistrationInfos = async (
  raws: RegistrationinforesponseResponse[]
): Promise<RegistrationInfo[]> =>
  Promise.all(raws.map((raw) => formatRegistrationInfo(raw)));
