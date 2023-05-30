import type { NextApiRequest, NextApiResponse } from 'next';
import type { Session } from 'next-iron-session';
import { v4 as uuidv4 } from 'uuid';

import CONST from '@config/constants.json';
import REQUEST_CONST from '@config/request.json';
import PINATA_CONST from '@config/pinata.json';
import addressCheckMiddleware from './middleware/address-check';
import { withSession, pinataApiKey, pinataSecretApiKey } from './utils';
import { APPLY_VALIDATOR, CREATE_COURSE_META } from '@validators/schemas';
import { request, today } from 'utils';
import { logger } from 'utils';
import { z } from 'zod';
import { usersRepo } from 'domain/repositories';

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
        const {
          pinataContent,
          meta = null,
        }: {
          pinataContent: Record<string, any>;
          meta?: Record<string, any> | null;
        } = await validate(target, rawData);
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

        return res.status(200).json({
          link: jsonRes.data,
          meta,
        });
      } catch (e) {
        logger(e);
        return res.status(422).json({ message: 'cannot create json' });
      }
    }
  }
);

const validate = async (target?: string, data?: Record<string, any>) => {
  if (!target) return { pinataContent: data };

  switch (target) {
    case UPLOAD_TARGET.REGISTRATION:
      return validateRegistration(data);
    case UPLOAD_TARGET.CREATE_COURSE:
      return validateForm(CREATE_COURSE_META, data);
    case UPLOAD_TARGET.CREATE_CLASS:
      return { pinataContent: data };
    case UPLOAD_TARGET.REGISTER_CLASS:
      return validateRegisterClass(data);
    case UPLOAD_TARGET.APPLY_REGISTRATION:
      return validateApplyRegistration(data);
    case UPLOAD_TARGET.GRANT_NFT_COMPLETE_COURSE:
      return validateGrantNftCompleteCourse(data);
    default:
      return null;
  }
};

const validateRegistration = (rawData?: Record<string, any>) => {
  if (!rawData) return { pinataContent: null };
  const { role, ...data } = rawData;
  const registerDate = today();

  switch (role) {
    case ROLES.TEACHER:
    case ROLES.STUDENT:
      return validateForm(APPLY_VALIDATOR, data, { registerDate });
    default:
      return { pinataContent: null };
  }
};

const validateGrantNftCompleteCourse = async (
  rawData?: Record<string, any>
) => {
  if (!rawData) return { pinataContent: null };
  const grantDate = today();
  const pinataContent = {
    ...rawData,
    grantDate,
  };

  return {
    pinataContent,
    meta: {
      grantDate,
    },
  };
};

const validateForm = (
  validator: z.ZodType,
  data: Record<string, any>,
  mergedData: Record<string, any> = {}
) => {
  try {
    const result = validator.parse(data);
    return { pinataContent: { ...result, ...mergedData } };
  } catch (e) {
    logger(e instanceof z.ZodError ? e.issues : e.message);
    return { pinataContent: null };
  }
};

const validateApplyRegistration = async (rawData?: Record<string, any>) => {
  const { role, ...data } = rawData;
  const memberCode = await usersRepo.getMemberCode(role);
  const approveDate = today();

  return {
    pinataContent: {
      ...data,
      approveDate,
      memberCode: memberCode,
    },
    meta: {
      approveDate,
      memberCode,
    },
  };
};

const validateRegisterClass = async (rawData?: Record<string, any>) => {
  const { role, ...data } = rawData;
  const registerDate = today();

  return {
    pinataContent: {
      ...data,
      registerDate,
    },
    meta: {
      registerDate,
    },
  };
};
