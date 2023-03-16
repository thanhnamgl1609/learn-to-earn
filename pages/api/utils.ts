import { NextApiRequest, NextApiResponse } from 'next';
import { Session, withIronSession } from 'next-iron-session';
import * as utils from 'ethereumjs-util';
import contract from '../../public/contracts/NftMarket.json';
import { NftMarketContract } from '@_types/nftMarketContract';
import { ethers } from 'ethers';

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

export const addressCheckMiddleware = async (
  req: NextApiRequest & { session: Session },
  response: NextApiResponse
) => {
  return new Promise(async (resolve, reject) => {
    const message = req.session.get('message-session');
    const provider = new ethers.providers.JsonRpcProvider(
      'http://127.0.0.1:7545'
    );
    const contract = new ethers.Contract(
      contractAddress,
      abi,
      provider
    ) as unknown as NftMarketContract;

    let nonce: string | Buffer =
      '\x19Ethereum Signed Message:\n' +
      JSON.stringify(message).length +
      JSON.stringify(message);

    nonce = utils.keccak(Buffer.from(nonce, 'utf-8'));
    const { v, r, s } = utils.fromRpcSig(req.body.signature);
    const publicKey = utils.ecrecover(utils.toBuffer(nonce), v, r, s);
    const addrBuffer = utils.pubToAddress(publicKey);
    const address = utils.bufferToHex(addrBuffer);

    if (address === req.body.address.toLowerCase()) {
      resolve('Correct address');
    } else {
      reject('message is empty');
    }
  });
};
