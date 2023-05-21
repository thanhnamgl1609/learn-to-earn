import { Contract, ContractInterface, ethers } from 'ethers';
import { AbiItem } from 'web3-utils';

import { NftCertificates, NftIdentities, NftSchool } from '@_types/contracts';
import NftIdentitiesContract from 'public/contracts/NftIdentities.json';
import NftSchoolsContract from 'public/contracts/NftSchool.json';
import NftCertificatesContract from 'public/contracts/NftCertificates.json';
import { ENV } from '@config/env';

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
const chainId = ENV.NEXT_PUBLIC_TARGET_CHAIN_ID;
const jsonRpcUrl = ENV.JSON_RPC_URL;

export const { address: nftIdentitiesContractAddress } =
  nftIdentitiesNetworks[targetNetwork];
export const { address: nftSchoolsContractAddress } =
  nftSchoolsNetworks[targetNetwork];
export const { address: nftCertificatesContractAddress } =
  nftCertificatesNetworks[targetNetwork];

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

  return contract;
};

export const contract: {
  nftIdentities: NftIdentities;
  nftSchool: NftSchool;
  nftCertificates: NftCertificates;
} = {
  nftIdentities: loadContract(
    nftIdentitiesContractAddress,
    nftIdentitiesAbi as AbiItem[]
  ) as unknown as NftIdentities,
  nftSchool: loadContract(
    nftSchoolsContractAddress,
    nftSchoolsAbi as AbiItem[]
  ) as unknown as NftSchool,
  nftCertificates: loadContract(
    nftCertificatesContractAddress,
    nftCertificatesAbi as AbiItem[]
  ) as unknown as NftCertificates,
};
