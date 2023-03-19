import {  withIronSession } from 'next-iron-session';
import ENV_CONST from '@config/env-const';
import contract from '../../public/contracts/NftMarket.json';

type NETWORK = typeof contract.networks;

const targetNetwork = process.env.NEXT_PUBLIC_NETWORK_ID as keyof NETWORK;

const abi = contract.abi;
export const contractAddress = contract.networks[targetNetwork].address;
export const pinataApiKey = process.env.PINATA_API_KEY;
export const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;

export function withSession(handler: any) {
  return withIronSession(handler, {
    password: process.env.SECRET_COOKIES_PASSWORD as string,
    cookieName: 'nft-auth-session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  });
}
