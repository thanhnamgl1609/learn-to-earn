import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from 'ethers';
import { EthersContractContextV5 } from 'ethereum-abi-types-generator';

export type ContractContext = EthersContractContextV5<
  NftClassRegistration,
  NftClassRegistrationMethodNames,
  NftClassRegistrationEventsContext,
  NftClassRegistrationEvents
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
export type NftClassRegistrationEvents =
  | 'Approval'
  | 'ApprovalForAll'
  | 'ClassRegistrationRegained'
  | 'NewClassRegistrationCreated'
  | 'Transfer';
export interface NftClassRegistrationEventsContext {
  Approval(...parameters: any): EventFilter;
  ApprovalForAll(...parameters: any): EventFilter;
  ClassRegistrationRegained(...parameters: any): EventFilter;
  NewClassRegistrationCreated(...parameters: any): EventFilter;
  Transfer(...parameters: any): EventFilter;
}
export type NftClassRegistrationMethodNames =
  | 'new'
  | 'approve'
  | 'balanceOf'
  | 'getApproved'
  | 'isApprovedForAll'
  | 'name'
  | 'ownerOf'
  | 'safeTransferFrom'
  | 'safeTransferFrom'
  | 'setApprovalForAll'
  | 'supportsInterface'
  | 'symbol'
  | 'tokenURI'
  | 'transferFrom'
  | 'initialize'
  | 'getRegisteredClasses'
  | 'getNftClassRegistration'
  | 'getStudentListOfClass'
  | 'getNumberOfRegisteredStudent'
  | 'checkNftClassRegistrationRegained'
  | 'getRegainedNftListOfClass'
  | 'registerClass'
  | 'regainNft';
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
export interface ClassRegistrationRegainedEventEmittedResponse {
  classId: BigNumberish;
}
export interface NewClassRegistrationCreatedEventEmittedResponse {
  classId: BigNumberish;
}
export interface TransferEventEmittedResponse {
  from: string;
  to: string;
  tokenId: BigNumberish;
}
export interface NftclassregistrationResponse {
  tokenId: BigNumber;
  0: BigNumber;
  classId: BigNumber;
  1: BigNumber;
  studentTokenId: BigNumber;
  2: BigNumber;
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
export interface NftClassRegistration {
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
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param nftCertificates Type: address, Indexed: false
   */
  initialize(
    nftCertificates: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getRegisteredClasses(
    overrides?: ContractCallOverrides
  ): Promise<NftclassregistrationResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  getNftClassRegistration(
    tokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<NftclassregistrationResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param classId Type: uint256, Indexed: false
   */
  getStudentListOfClass(
    classId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<NftidentityresponseResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param classId Type: uint256, Indexed: false
   */
  getNumberOfRegisteredStudent(
    classId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param studentTokenId Type: uint256, Indexed: false
   * @param classId Type: uint256, Indexed: false
   */
  checkNftClassRegistrationRegained(
    studentTokenId: BigNumberish,
    classId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param classId Type: uint256, Indexed: false
   */
  getRegainedNftListOfClass(
    classId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber[]>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param classId Type: uint256, Indexed: false
   * @param uri Type: string, Indexed: false
   */
  registerClass(
    classId: BigNumberish,
    uri: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  regainNft(
    tokenId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
}
