import { withIronSession } from 'next-iron-session';
import NftIdentitiesContract from '../../../public/contracts/NftIdentities.json';
import NftSchoolsContract from '../../../public/contracts/NftSchool.json';
import NftCertificatesContract from '../../../public/contracts/NftCertificates.json';

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
