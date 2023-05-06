import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from 'ethers';
import { EthersContractContextV5 } from 'ethereum-abi-types-generator';

export type ContractContext = EthersContractContextV5<
  NftCertificates,
  NftCertificatesMethodNames,
  NftCertificatesEventsContext,
  NftCertificatesEvents
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
export type NftCertificatesEvents =
  | 'ApprovalForAll'
  | 'TransferBatch'
  | 'TransferSingle'
  | 'URI';
export interface NftCertificatesEventsContext {
  ApprovalForAll(...parameters: any): EventFilter;
  TransferBatch(...parameters: any): EventFilter;
  TransferSingle(...parameters: any): EventFilter;
  URI(...parameters: any): EventFilter;
}
export type NftCertificatesMethodNames =
  | 'new'
  | 'balanceOf'
  | 'balanceOfBatch'
  | 'graduationPrice'
  | 'isApprovedForAll'
  | 'registeredEndAt'
  | 'registeredPrice'
  | 'registeredStartAt'
  | 'safeBatchTransferFrom'
  | 'safeTransferFrom'
  | 'schoolYearEnd'
  | 'setApprovalForAll'
  | 'supportsInterface'
  | 'uri'
  | 'yearId'
  | 'getOwnedNftCompleteCourse'
  | 'getNftCompleteCourse'
  | 'getOwnedNftGraduation'
  | 'getNftGraduation'
  | 'exchangeCompleteCourse'
  | 'exchangeGraduation'
  | 'checkCompleteCourse';
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
export interface NftcompletecourseResponse {
  tokenId: BigNumber;
  0: BigNumber;
  courseId: BigNumber;
  1: BigNumber;
  knowledgeBlockId: BigNumber;
  2: BigNumber;
  credits: BigNumber;
  3: BigNumber;
  avgScore: BigNumber;
  4: BigNumber;
}
export interface GetOwnedNftCompleteCourseResponse {
  result0: NftcompletecourseResponse[];
  0: NftcompletecourseResponse[];
  result1: string[];
  1: string[];
  length: 2;
}
export interface GetNftCompleteCourseResponse {
  result0: NftcompletecourseResponse;
  0: NftcompletecourseResponse;
  result1: string;
  1: string;
  length: 2;
}
export interface NftgraduationResponse {
  tokenId: BigNumber;
  0: BigNumber;
}
export interface GetOwnedNftGraduationResponse {
  result0: NftgraduationResponse;
  0: NftgraduationResponse;
  result1: string;
  1: string;
  length: 2;
}
export interface GetNftGraduationResponse {
  result0: NftgraduationResponse;
  0: NftgraduationResponse;
  result1: string;
  1: string;
  length: 2;
}
export interface NftCertificates {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param nftIdentities Type: address, Indexed: false
   * @param nftSchool Type: address, Indexed: false
   */
  'new'(
    nftIdentities: string,
    nftSchool: string,
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
  graduationPrice(overrides?: ContractCallOverrides): Promise<BigNumber>;
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
  registeredEndAt(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  registeredPrice(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  registeredStartAt(overrides?: ContractCallOverrides): Promise<BigNumber>;
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
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  schoolYearEnd(overrides?: ContractCallOverrides): Promise<BigNumber>;
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
   * StateMutability: view
   * Type: function
   */
  yearId(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getOwnedNftCompleteCourse(
    overrides?: ContractCallOverrides
  ): Promise<GetOwnedNftCompleteCourseResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  getNftCompleteCourse(
    tokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<GetNftCompleteCourseResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getOwnedNftGraduation(
    overrides?: ContractCallOverrides
  ): Promise<GetOwnedNftGraduationResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  getNftGraduation(
    tokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<GetNftGraduationResponse>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param studentAddr Type: address, Indexed: false
   * @param studentTokenId Type: uint256, Indexed: false
   * @param courseId Type: uint256, Indexed: false
   * @param knowledgeBlockId Type: uint256, Indexed: false
   * @param credits Type: uint256, Indexed: false
   * @param score Type: uint256, Indexed: false
   * @param tokenURI Type: string, Indexed: false
   */
  exchangeCompleteCourse(
    studentAddr: string,
    studentTokenId: BigNumberish,
    courseId: BigNumberish,
    knowledgeBlockId: BigNumberish,
    credits: BigNumberish,
    score: BigNumberish,
    tokenURI: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param nftCompleteCourseIds Type: uint256[], Indexed: false
   * @param tokenURI Type: string, Indexed: false
   */
  exchangeGraduation(
    nftCompleteCourseIds: BigNumberish[],
    tokenURI: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param courseId Type: uint256, Indexed: false
   * @param studentAddr Type: address, Indexed: false
   */
  checkCompleteCourse(
    courseId: BigNumberish,
    studentAddr: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
}
