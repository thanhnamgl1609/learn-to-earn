import { Contract, ContractInterface, ethers } from 'ethers';
import { AbiItem } from 'web3-utils';

import {
  NftCertificates,
  NftIdentities,
  School,
  NftClassRegistration,
} from '@_types/contracts';
import NftIdentitiesContract from 'public/contracts/NftIdentities.json';
import SchoolsContract from 'public/contracts/School.json';
import NftCertificatesContract from 'public/contracts/NftCertificates.json';
import NftClassRegistrationContract from 'public/contracts/NftClassRegistration.json';
import { ENV } from '@config/env';

export const { abi: nftIdentitiesAbi, networks: nftIdentitiesNetworks } =
  NftIdentitiesContract;
export const { abi: schoolsAbi, networks: schoolsNetworks } =
  SchoolsContract;
export const { abi: nftCertificatesAbi, networks: nftCertificatesNetworks } =
  NftCertificatesContract;
export const {
  abi: nftClassRegistrationAbi,
  networks: nftClassRegistrationNetworks,
} = NftClassRegistrationContract;
type NETWORK = typeof nftIdentitiesNetworks &
  typeof schoolsNetworks &
  typeof nftCertificatesNetworks;

const targetNetwork = process.env.NEXT_PUBLIC_NETWORK_ID as keyof NETWORK;
const chainId = ENV.NEXT_PUBLIC_TARGET_CHAIN_ID;
const jsonRpcUrl = ENV.JSON_RPC_URL;

export const { address: nftIdentitiesContractAddress } =
  nftIdentitiesNetworks[targetNetwork];
export const { address: schoolsContractAddress } =
  schoolsNetworks[targetNetwork];
export const { address: nftCertificatesContractAddress } =
  nftCertificatesNetworks[targetNetwork];
export const { address: nftClassRegistrationContractAddress } =
  nftClassRegistrationNetworks[targetNetwork];

export const loadContract = (
  contractAddress: string,
  abi: Record<string, any>
) => {
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl, {
    chainId: parseInt(chainId),
    name: 'unknown',
  });
  const contract = new Contract(
    contractAddress,
    abi as ContractInterface,
    provider
  );

  return contract.connect(provider.getSigner());
};

export const contract: {
  nftIdentities: NftIdentities;
  school: School;
  nftCertificates: NftCertificates;
  nftClassRegistration: NftClassRegistration;
} = {
  nftIdentities: loadContract(
    nftIdentitiesContractAddress,
    nftIdentitiesAbi as AbiItem[]
  ) as unknown as NftIdentities,
  school: loadContract(
    schoolsContractAddress,
    schoolsAbi as AbiItem[]
  ) as unknown as School,
  nftCertificates: loadContract(
    nftCertificatesContractAddress,
    nftCertificatesAbi as AbiItem[]
  ) as unknown as NftCertificates,
  nftClassRegistration: loadContract(
    nftClassRegistrationContractAddress,
    nftClassRegistrationAbi as AbiItem[]
  ) as unknown as NftClassRegistration,
};
