import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from 'ethers';
import { EthersContractContextV5 } from 'ethereum-abi-types-generator';

export type ContractContext = EthersContractContextV5<
  NftCompleteCourses,
  NftCompleteCoursesMethodNames,
  NftCompleteCoursesEventsContext,
  NftCompleteCoursesEvents
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
export type NftCompleteCoursesEvents =
  | 'ApprovalForAll'
  | 'NewCompleteCourseCreated'
  | 'TransferBatch'
  | 'TransferSingle'
  | 'URI';
export interface NftCompleteCoursesEventsContext {
  ApprovalForAll(...parameters: any): EventFilter;
  NewCompleteCourseCreated(...parameters: any): EventFilter;
  TransferBatch(...parameters: any): EventFilter;
  TransferSingle(...parameters: any): EventFilter;
  URI(...parameters: any): EventFilter;
}
export type NftCompleteCoursesMethodNames =
  | 'new'
  | 'balanceOf'
  | 'balanceOfBatch'
  | 'graduationPrice'
  | 'isApprovedForAll'
  | 'safeBatchTransferFrom'
  | 'safeTransferFrom'
  | 'setApprovalForAll'
  | 'supportsInterface'
  | 'uri'
  | 'initialize'
  | 'getOwnedNftCompleteCourse'
  | 'getNftCompleteCourse'
  | 'checkCompleteCourse'
  | 'checkApproveOwnerForAllNft'
  | 'checkApprovedForAll'
  | 'approveOwnerForAllNft'
  | 'regainNftCompleteCourses'
  | 'exchangeNftCompleteCourse'
  | 'checkAllNftCompleteCoursesRegained'
  | '_removeFromAllNftCompleteCourses';
export interface ApprovalForAllEventEmittedResponse {
  account: string;
  operator: string;
  approved: boolean;
}
export interface NewCompleteCourseCreatedEventEmittedResponse {
  tokenId: BigNumberish;
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
  studentTokenId: BigNumber;
  1: BigNumber;
  courseId: BigNumber;
  2: BigNumber;
  knowledgeBlockId: BigNumber;
  3: BigNumber;
  credits: BigNumber;
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
export interface NftCompleteCourses {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param nftIdentities Type: address, Indexed: false
   * @param school Type: address, Indexed: false
   * @param nftClassRegistration Type: address, Indexed: false
   */
  'new'(
    nftIdentities: string,
    school: string,
    nftClassRegistration: string,
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
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param nftGraduation Type: address, Indexed: false
   */
  initialize(
    nftGraduation: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
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
   * @param courseId Type: uint256, Indexed: false
   * @param studentAddr Type: address, Indexed: false
   */
  checkCompleteCourse(
    courseId: BigNumberish,
    studentAddr: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  checkApproveOwnerForAllNft(
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param sender Type: address, Indexed: false
   * @param owner Type: address, Indexed: false
   */
  checkApprovedForAll(
    sender: string,
    owner: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param approved Type: bool, Indexed: false
   */
  approveOwnerForAllNft(
    approved: boolean,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param studentTokenId Type: uint256, Indexed: false
   */
  regainNftCompleteCourses(
    studentTokenId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param nftClassRegistrationTokenId Type: uint256, Indexed: false
   * @param tokenURI Type: string, Indexed: false
   */
  exchangeNftCompleteCourse(
    nftClassRegistrationTokenId: BigNumberish,
    tokenURI: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenIds Type: uint256[], Indexed: false
   */
  checkAllNftCompleteCoursesRegained(
    tokenIds: BigNumberish[],
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param studentTokenId Type: uint256, Indexed: false
   * @param tokenIds Type: uint256[], Indexed: false
   */
  _removeFromAllNftCompleteCourses(
    studentTokenId: BigNumberish,
    tokenIds: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
}
