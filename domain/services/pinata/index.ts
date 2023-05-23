import { v4 as uuidv4 } from 'uuid';

import { request } from 'utils';
import PINATA_CONST from 'config/pinata.json';
import { ENV } from 'config/env';

const pinataApiKey = ENV.PINATA_API_KEY;
const pinataSecretApiKey = ENV.PINATA_SECRET_API_KEY;

export const uploadData = async (pinataContent: Record<string, any>) => {
  const jsonRes = await request.post(
    PINATA_CONST.PINNING_JSON,
    {
      pinataMetadata: {
        name: uuidv4(),
      },
      pinataContent,
    },
    {
      headers: {
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
    }
  );

  return jsonRes.data;
};
