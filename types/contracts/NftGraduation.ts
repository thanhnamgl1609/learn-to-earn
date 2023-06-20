import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from 'ethers';
import { EthersContractContextV5 } from 'ethereum-abi-types-generator';

export type ContractContext = EthersContractContextV5<
  NftGraduation,
  NftGraduationMethodNames,
  NftGraduationEventsContext,
  NftGraduationEvents
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
export type NftGraduationEvents =
  | 'Approval'
  | 'ApprovalForAll'
  | 'GrantNewNftGraduation'
  | 'Transfer';
export interface NftGraduationEventsContext {
  Approval(...parameters: any): EventFilter;
  ApprovalForAll(...parameters: any): EventFilter;
  GrantNewNftGraduation(...parameters: any): EventFilter;
  Transfer(...parameters: any): EventFilter;
}
export type NftGraduationMethodNames =
  | 'new'
  | 'approve'
  | 'balanceOf'
  | 'getApproved'
  | 'isApprovedForAll'
  | 'name'
  | 'ownerOf'
  | 'requestGraduationCertificatePrice'
  | 'safeTransferFrom'
  | 'safeTransferFrom'
  | 'setApprovalForAll'
  | 'supportsInterface'
  | 'symbol'
  | 'tokenURI'
  | 'transferFrom'
  | 'getNftCompleteCourseForRequestGraduation'
  | 'getAllRequestGraduationStudents'
  | 'getRequestGraduationDetail'
  | 'checkRequestInQueue'
  | 'getNftGraduation'
  | 'getOwnedNftGraduation'
  | 'getAllGraduations'
  | 'requestGraduationCertificate'
  | 'grantNftGraduation';
export interface ApprovalEventEmittedResponse {
  owner: string;
  approved: string;
  tokenId: BigNumberish;
}
export interface ApprovalForAllEventEmittedResponse {
  owner: string;
  operator: string;
  approved: boolean;
}
export interface GrantNewNftGraduationEventEmittedResponse {
  tokenId: BigNumberish;
}
export interface TransferEventEmittedResponse {
  from: string;
  to: string;
  tokenId: BigNumberish;
}
export interface GetRequestGraduationDetailResponse {
  result0: BigNumber[];
  0: BigNumber[];
  result1: string;
  1: string;
  length: 2;
}
export interface NftgraduationResponse {
  tokenId: BigNumber;
  0: BigNumber;
  studentTokenId: BigNumber;
  1: BigNumber;
}
export interface NftGraduation {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param nftIdentities Type: address, Indexed: false
   * @param nftSchool Type: address, Indexed: false
   * @param nftCertificates Type: address, Indexed: false
   */
  'new'(
    nftIdentities: string,
    nftSchool: string,
    nftCertificates: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param to Type: address, Indexed: false
   * @param tokenId Type: uint256, Indexed: false
   */
  approve(
    to: string,
    tokenId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param owner Type: address, Indexed: false
   */
  balanceOf(
    owner: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  getApproved(
    tokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param owner Type: address, Indexed: false
   * @param operator Type: address, Indexed: false
   */
  isApprovedForAll(
    owner: string,
    operator: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  name(overrides?: ContractCallOverrides): Promise<string>;
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
   */
  requestGraduationCertificatePrice(
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param from Type: address, Indexed: false
   * @param to Type: address, Indexed: false
   * @param tokenId Type: uint256, Indexed: false
   */
  safeTransferFrom(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param from Type: address, Indexed: false
   * @param to Type: address, Indexed: false
   * @param tokenId Type: uint256, Indexed: false
   * @param data Type: bytes, Indexed: false
   */
  safeTransferFrom(
    from: string,
    to: string,
    tokenId: BigNumberish,
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
   */
  symbol(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  tokenURI(
    tokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param from Type: address, Indexed: false
   * @param to Type: address, Indexed: false
   * @param tokenId Type: uint256, Indexed: false
   */
  transferFrom(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param studentTokenId Type: uint256, Indexed: false
   */
  getNftCompleteCourseForRequestGraduation(
    studentTokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getAllRequestGraduationStudents(
    overrides?: ContractCallOverrides
  ): Promise<BigNumber[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param studentTokenId Type: uint256, Indexed: false
   */
  getRequestGraduationDetail(
    studentTokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<GetRequestGraduationDetailResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param studentTokenId Type: uint256, Indexed: false
   */
  checkRequestInQueue(
    studentTokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param studentTokenId Type: uint256, Indexed: false
   */
  getNftGraduation(
    studentTokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<NftgraduationResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getOwnedNftGraduation(
    overrides?: ContractCallOverrides
  ): Promise<NftgraduationResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getAllGraduations(
    overrides?: ContractCallOverrides
  ): Promise<NftgraduationResponse[]>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param nftCompleteCourseTokenIds Type: uint256[], Indexed: false
   * @param uri Type: string, Indexed: false
   */
  requestGraduationCertificate(
    nftCompleteCourseTokenIds: BigNumberish[],
    uri: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param studentTokenId Type: uint256, Indexed: false
   * @param tokenURI Type: string, Indexed: false
   */
  grantNftGraduation(
    studentTokenId: BigNumberish,
    tokenURI: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
}
