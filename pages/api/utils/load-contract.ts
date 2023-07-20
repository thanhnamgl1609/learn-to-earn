import { Contract, ContractInterface, ethers } from 'ethers';
import { AbiItem } from 'web3-utils';

import {
  NftCompleteCourses,
  NftGraduation,
  NftIdentities,
  School,
  NftClassRegistration,
} from '@_types/contracts';
import NftIdentitiesContract from 'public/contracts/NftIdentities.json';
import SchoolsContract from 'public/contracts/School.json';
import NftCompleteCoursesContract from 'public/contracts/NftCompleteCourses.json';
import NftClassRegistrationContract from 'public/contracts/NftClassRegistration.json';
import NftGraduationContract from 'public/contracts/NftGraduation.json';
import { ENV } from '@config/env';

export const {
  abi: nftIdentitiesAbi,
  networks: nftIdentitiesNetworks,
} = NftIdentitiesContract;
export const { abi: schoolsAbi, networks: schoolsNetworks } =
  SchoolsContract;
export const {
  abi: nftCompleteCoursesAbi,
  networks: nftCompleteCoursesNetworks,
} = NftCompleteCoursesContract;
export const {
  abi: nftClassRegistrationAbi,
  networks: nftClassRegistrationNetworks,
} = NftClassRegistrationContract;
export const {
  abi: nftGraduationAbi,
  networks: nftGraduationNetworks,
} = NftGraduationContract;
type NETWORK = typeof nftIdentitiesNetworks &
  typeof schoolsNetworks &
  typeof nftClassRegistrationNetworks &
  typeof nftCompleteCoursesNetworks &
  typeof nftGraduationNetworks;

const targetNetwork = process.env
  .NEXT_PUBLIC_NETWORK_ID as keyof NETWORK;
const chainId = ENV.NEXT_PUBLIC_TARGET_CHAIN_ID;
const jsonRpcUrl = ENV.JSON_RPC_URL;

export const { address: nftIdentitiesContractAddress } =
  nftIdentitiesNetworks[targetNetwork];
export const { address: schoolsContractAddress } =
  schoolsNetworks[targetNetwork];
export const { address: nftCompleteCoursesContractAddress } =
  nftCompleteCoursesNetworks[targetNetwork];
export const { address: nftClassRegistrationContractAddress } =
  nftClassRegistrationNetworks[targetNetwork];
export const { address: nftGraduationContractAddress } =
  nftGraduationNetworks[targetNetwork];

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
  nftCompleteCourses: NftCompleteCourses;
  nftGraduation: NftGraduation;
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
  nftCompleteCourses: loadContract(
    nftCompleteCoursesContractAddress,
    nftCompleteCoursesAbi as AbiItem[]
  ) as unknown as NftCompleteCourses,
  nftGraduation: loadContract(
    nftGraduationContractAddress,
    nftGraduationAbi as AbiItem[]
  ) as unknown as NftGraduation,
  nftClassRegistration: loadContract(
    nftClassRegistrationContractAddress,
    nftClassRegistrationAbi as AbiItem[]
  ) as unknown as NftClassRegistration,
};
