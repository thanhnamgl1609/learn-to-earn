import type { NextApiRequest, NextApiResponse } from 'next';
import type { Session } from 'next-iron-session';
import { v4 as uuidv4 } from 'uuid';

import CONST from '@config/constants.json';
import REQUEST_CONST from '@config/request.json';
import PINATA_CONST from '@config/pinata.json';
import addressCheckMiddleware from './middleware/address-check';
import { withSession, pinataApiKey, pinataSecretApiKey } from './utils';
import { APPLY_VALIDATOR, CREATE_COURSE_META } from '@validators/schemas';
import request from 'utils/request';
import { logger } from 'utils';
import { z } from 'zod';

const { ROLES, UPLOAD_TARGET } = CONST;
const { METHOD } = REQUEST_CONST;

export default withSession(
  async (
    req: NextApiRequest & { session: Session },
    res: NextApiResponse<any>
  ) => {
    if (req.method === METHOD.POST) {
      try {
        await addressCheckMiddleware(req, res);

        const { body } = req;
        const { target, ...rawData } = body.data;
        const { role, ...data } = rawData;
        const pinataContent = validate(target, data);
        if (!pinataContent) return res.status(400).json({ message: 'invalid' });

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

        return res.status(200).json(jsonRes.data);
      } catch (e) {
        logger(e);
        return res.status(422).json({ message: 'cannot create json' });
      }
    }
  }
);

const validate = (target?: string, data?: Record<string, any>) => {
  if (!target) return null;

  switch (target) {
    case UPLOAD_TARGET.REGISTRATION:
      return validateRegistration(data);
    case UPLOAD_TARGET.CREATE_COURSE:
      return validateForm(CREATE_COURSE_META, data);
    default:
      return null;
  }
};

const validateRegistration = (rawData?: Record<string, any>) => {
  if (!rawData) return null;
  const { role, ...data } = rawData;

  switch (role) {
    case ROLES.TEACHER:
    case ROLES.STUDENT:
      return validateForm(APPLY_VALIDATOR, data);
    default:
      return null;
  }
};

const validateForm = (validator: z.ZodType, data: Record<string, any>) => {
  try {
    return validator.parse(data);
  } catch {
    return null;
  }
};
