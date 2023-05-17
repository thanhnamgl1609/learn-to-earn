import { withIronSession } from 'next-iron-session';
import { NextApiRequest, NextApiResponse } from 'next';

import NftIdentitiesContract from '../../../public/contracts/NftIdentities.json';
import NftSchoolsContract from '../../../public/contracts/NftSchool.json';
import NftCertificatesContract from '../../../public/contracts/NftCertificates.json';
import { IHandlers } from '@_types/api';
import { logger } from 'utils';

export const { abi: nftIdentitiesAbi, networks: nftIdentitiesNetworks } =
  NftIdentitiesContract;
export const { abi: nftSchoolsAbi, networks: nftSchoolsNetworks } =
  NftSchoolsContract;
export const { abi: nftCertificatesAbi, networks: nftCertificatesNetworks } =
  NftCertificatesContract;
type NETWORK = typeof nftIdentitiesNetworks &
  typeof nftSchoolsNetworks &
  typeof nftCertificatesNetworks;

const targetNetwork = process.env.NEXT_PUBLIC_NETWORK_ID as keyof NETWORK;

export const { address: nftIdentitiesContractAddress } =
  nftIdentitiesNetworks[targetNetwork];
export const { address: nftSchoolsContractAddress } =
  nftSchoolsNetworks[targetNetwork];
export const { address: nftCertificatesContractAddress } =
  nftCertificatesNetworks[targetNetwork];

export const pinataApiKey = process.env.PINATA_API_KEY;
export const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;
export const pinataJWTKey = process.env.PINATA_JWT_KEY;

export function withSession(handler: any) {
  return withIronSession(handler, {
    password: process.env.SECRET_COOKIES_PASSWORD as string,
    cookieName: 'nft-auth-session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  });
}

export const run =
  (handlers: IHandlers) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method;
    if (!handlers[method]) {
      return res.status(404).json({ message: 'not found' });
    }
    const executors = handlers[method];
    const _res = {
      ...res,
      sendData: (status: number, data: any) => res.status(status).json(data),
    };
    try {
      if (Array.isArray(executors)) {
        for (const executor of executors) {
          await executor(req, _res);
        }
      } else {
        await executors(req, _res);
      }
    } catch (e) {
      logger({
        method: req.method,
        path: req.url,
        error: e,
      });
      if (e.hasOwnProperty('status')) {
        return _res.sendData(e.status, { message: getErrorMessage(e) });
      }

      _res.sendData(500, { message: getErrorMessage({ status: 500 }) });
    }
  };

const getErrorMessage = ({
  status,
  message,
}: {
  status: number;
  message?: string;
}) => {
  if (message) return message;

  switch (status) {
    case 400:
      return 'Bad request';
    case 500:
      return 'Internal error';
    default:
      return 'Invalid error';
  }
};

export { generateCondition } from './generate-conditions';
export { withTransaction } from './db-manager';
