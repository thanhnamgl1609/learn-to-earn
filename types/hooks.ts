import { MetaMaskInpageProvider } from '@metamask/providers';
import { providers } from 'ethers';
import { SWRResponse } from 'swr';
import { NftIdentities, NftSchool, NftCertificates } from './contracts';

export type ContractLists = {
  nftIdentities: NftIdentities;
  nftSchool: NftSchool;
  nftCertificates: NftCertificates;
};

export type Web3Dependencies = {
  ethereum: MetaMaskInpageProvider;
  provider: providers.Web3Provider;
  contracts: ContractLists;
  isLoading: boolean;
};

export type CryptoSWRResponse<D = any, R = any> = SWRResponse<D> & R;

export type CryptoHandlerHook<D = any, R = any, P = any> = (
  params?: P
) => CryptoSWRResponse<D, R>;

export type CryptoHookFactory<D = any, R = any, P = any> = {
  (d: Partial<Web3Dependencies>): CryptoHandlerHook<D, R, P>;
};
