import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from 'ethers';
import { EthersContractContextV5 } from 'ethereum-abi-types-generator';

export type ContractContext = EthersContractContextV5<
  NftIdentities,
  NftIdentitiesMethodNames,
  NftIdentitiesEventsContext,
  NftIdentitiesEvents
>;

export declare type EventFilter = {
  address?: string;
  topics?: Array<string>;
  fromBlock?: string | number;
  toBlock?: string | number;
};

export interface ContractTransactionOverrides {
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number;
  /**
   * The price (in wei) per unit of gas
   */
  gasPrice?: BigNumber | string | number | Promise<any>;
  /**
   * The nonce to use in the transaction
   */
  nonce?: number;
  /**
   * The amount to send with the transaction (i.e. msg.value)
   */
  value?: BigNumber | string | number | Promise<any>;
  /**
   * The chain ID (or network ID) to use
   */
  chainId?: number;
}

export interface ContractCallOverrides {
  /**
   * The address to execute the call as
   */
  from?: string;
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number;
}
export type NftIdentitiesEvents =
  | 'ApprovalForAll'
  | 'TransferBatch'
  | 'TransferSingle'
  | 'URI';
export interface NftIdentitiesEventsContext {
  ApprovalForAll(...parameters: any): EventFilter;
  TransferBatch(...parameters: any): EventFilter;
  TransferSingle(...parameters: any): EventFilter;
  URI(...parameters: any): EventFilter;
}
export type NftIdentitiesMethodNames =
  | 'new'
  | 'balanceOf'
  | 'balanceOfBatch'
  | 'getAllOwnedRegistrationInfos'
  | 'getAllRegistrationInfosByRole'
  | 'isApprovedForAll'
  | 'isOwner'
  | 'registerFee'
  | 'safeBatchTransferFrom'
  | 'safeTransferFrom'
  | 'setApprovalForAll'
  | 'supportsInterface'
  | 'uri'
  | 'getTokenType'
  | 'getNftOfTokenId'
  | 'ownerOf'
  | 'isAbleToOperate'
  | 'registerNftIdentity'
  | 'grantNftIdentity'
  | 'rejectNftIdentityRegistration'
  | 'burnNft'
  | 'getOwnedNfts'
  | 'getAllMembers'
  | 'getNftOfMemberWithRole'
  | 'getNftTokenIdOfRole';
export interface ApprovalForAllEventEmittedResponse {
  account: string;
  operator: string;
  approved: boolean;
}
export interface TransferBatchEventEmittedResponse {
  operator: string;
  from: string;
  to: string;
  ids: BigNumberish[];
  values: BigNumberish[];
}
export interface TransferSingleEventEmittedResponse {
  operator: string;
  from: string;
  to: string;
  id: BigNumberish;
  value: BigNumberish;
}
export interface URIEventEmittedResponse {
  value: string;
  id: BigNumberish;
}
export interface DetailResponse {
  applicant: string;
  0: DetailResponse;
  documentURI: string;
  1: DetailResponse;
}
export interface RegistrationinforesponseResponse {
  detail: DetailResponse;
  0: DetailResponse;
  role: BigNumber;
  1: BigNumber;
}
export interface RegistrationinfoResponse {
  applicant: string;
  0: string;
  documentURI: string;
  1: string;
}
export interface NftIdentityResponse {
  tokenId: BigNumber;
  0: NftIdentityResponse;
  register: string;
  1: NftIdentityResponse;
  expiredAt: BigNumber;
  2: NftIdentityResponse;
}
export interface NftidentityresponseResponse {
  nftIdentity: NftIdentityResponse;
  0: NftIdentityResponse;
  tokenURI: string;
  1: string;
  role: BigNumber;
  2: BigNumber;
  isExpired: boolean;
  3: boolean;
}
export interface NftIdentities {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param schoolAccount Type: address, Indexed: false
   */
  'new'(
    schoolAccount: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param account Type: address, Indexed: false
   * @param id Type: uint256, Indexed: false
   */
  balanceOf(
    account: string,
    id: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param accounts Type: address[], Indexed: false
   * @param ids Type: uint256[], Indexed: false
   */
  balanceOfBatch(
    accounts: string[],
    ids: BigNumberish[],
    overrides?: ContractCallOverrides
  ): Promise<BigNumber[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getAllOwnedRegistrationInfos(
    overrides?: ContractCallOverrides
  ): Promise<RegistrationinforesponseResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param role Type: uint256, Indexed: false
   */
  getAllRegistrationInfosByRole(
    role: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<RegistrationinfoResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param account Type: address, Indexed: false
   * @param operator Type: address, Indexed: false
   */
  isApprovedForAll(
    account: string,
    operator: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  isOwner(overrides?: ContractCallOverrides): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  registerFee(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param from Type: address, Indexed: false
   * @param to Type: address, Indexed: false
   * @param ids Type: uint256[], Indexed: false
   * @param amounts Type: uint256[], Indexed: false
   * @param data Type: bytes, Indexed: false
   */
  safeBatchTransferFrom(
    from: string,
    to: string,
    ids: BigNumberish[],
    amounts: BigNumberish[],
    data: Arrayish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param from Type: address, Indexed: false
   * @param to Type: address, Indexed: false
   * @param id Type: uint256, Indexed: false
   * @param amount Type: uint256, Indexed: false
   * @param data Type: bytes, Indexed: false
   */
  safeTransferFrom(
    from: string,
    to: string,
    id: BigNumberish,
    amount: BigNumberish,
    data: Arrayish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param operator Type: address, Indexed: false
   * @param approved Type: bool, Indexed: false
   */
  setApprovalForAll(
    operator: string,
    approved: boolean,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param interfaceId Type: bytes4, Indexed: false
   */
  supportsInterface(
    interfaceId: Arrayish,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  uri(
    tokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: pure
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  getTokenType(
    tokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  getNftOfTokenId(
    tokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<NftidentityresponseResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  ownerOf(
    tokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param registerAddr Type: address, Indexed: false
   * @param role Type: uint256, Indexed: false
   */
  isAbleToOperate(
    registerAddr: string,
    role: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param role Type: uint256, Indexed: false
   * @param documentURI Type: string, Indexed: false
   */
  registerNftIdentity(
    role: BigNumberish,
    documentURI: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param targetAccount Type: address, Indexed: false
   * @param role Type: uint256, Indexed: false
   * @param expiredAt Type: uint256, Indexed: false
   * @param tokenURI Type: string, Indexed: false
   */
  grantNftIdentity(
    targetAccount: string,
    role: BigNumberish,
    expiredAt: BigNumberish,
    tokenURI: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param to Type: address, Indexed: false
   * @param role Type: uint256, Indexed: false
   */
  rejectNftIdentityRegistration(
    to: string,
    role: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  burnNft(
    tokenId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getOwnedNfts(
    overrides?: ContractCallOverrides
  ): Promise<NftidentityresponseResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param role Type: uint256, Indexed: false
   */
  getAllMembers(
    role: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<NftidentityresponseResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param role Type: uint256, Indexed: false
   * @param sender Type: address, Indexed: false
   */
  getNftOfMemberWithRole(
    role: BigNumberish,
    sender: string,
    overrides?: ContractCallOverrides
  ): Promise<NftidentityresponseResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param checkedAddr Type: address, Indexed: false
   * @param role Type: uint256, Indexed: false
   */
  getNftTokenIdOfRole(
    checkedAddr: string,
    role: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
}
