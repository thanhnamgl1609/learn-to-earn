import {
  parseBigNumber,
  parseBigNumberFields,
  parseDate,
  request,
} from 'utils';

import Api from 'config/api.json';
import { NftclassregistrationresponseResponse } from '@_types/contracts/School';
import { NftClassRegistration, NftClassRegistrationCore } from '@_types/school';
import { NftclassregistrationResponse } from '@_types/contracts/NftClassRegistration';

const defaultMeta = {
  classInfo: {
    id: 0,
    knowledgeBlockId: 0,
    prevCourseId: 0,
    teacherTokenId: 0,
    credits: 0,
    courseId: 0,
    completeAt: new Date(),
    maxSize: 0,
    registeredStartAt: new Date(),
    registeredEndAt: new Date(),
    meta: {
      course: {
        id: 0,
        name: 'Err',
      },
      teacher: {
        tokenId: 0,
        name: 'Err',
      },
    },
  },
  owner: {
    tokenId: 0,
    fullName: 'Err',
    profileImage: '',
    documentURIs: [],
  },
};

export const formatNftClassRegistrationResponse = async ({
  nftClassRegistration,
  class: classDetail,
  tokenURI: uri,
}: NftclassregistrationresponseResponse): Promise<NftClassRegistration> => {
  const { tokenId, classId, studentTokenId } = parseBigNumberFields(
    nftClassRegistration,
    ['tokenId', 'classId', 'studentTokenId']
  );

  const coreNft = {
    tokenId,
    classId,
    studentTokenId,
  };
  try {
    const { data: meta } = await request.get(Api.proxy, {
      params: {
        l: uri,
      },
    });

    return {
      ...coreNft,
      meta,
    };
  } catch (e) {
    return {
      ...coreNft,
      meta: defaultMeta,
      isUploading: true,
    };
  }
};

export const formatNftClassRegistrationResponses = async (
  raws: NftclassregistrationresponseResponse[]
): Promise<NftClassRegistration[]> =>
  Promise.all(raws.map((raw) => formatNftClassRegistrationResponse(raw)));

export const formatNftClassRegistrationCore = (
  raw: NftclassregistrationResponse
): NftClassRegistrationCore => {
  const { tokenId, classId, studentTokenId } = parseBigNumberFields(raw, [
    'tokenId',
    'classId',
    'studentTokenId',
  ]);

  const coreNft = {
    tokenId,
    classId,
    studentTokenId,
  };

  return coreNft;
};

export const formatNftClassRegistrationCores = async (
  raws: NftclassregistrationResponse[]
): Promise<NftClassRegistrationCore[]> =>
  Promise.all(raws.map((raw) => formatNftClassRegistrationCore(raw)));
