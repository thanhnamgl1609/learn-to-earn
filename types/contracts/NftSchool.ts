import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from 'ethers';
import { EthersContractContextV5 } from 'ethereum-abi-types-generator';

export type ContractContext = EthersContractContextV5<
  NftSchool,
  NftSchoolMethodNames,
  NftSchoolEventsContext,
  NftSchoolEvents
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
export type NftSchoolEvents =
  | 'ApprovalForAll'
  | 'NewClassCreated'
  | 'TransferBatch'
  | 'TransferSingle'
  | 'URI';
export interface NftSchoolEventsContext {
  ApprovalForAll(...parameters: any): EventFilter;
  NewClassCreated(...parameters: any): EventFilter;
  TransferBatch(...parameters: any): EventFilter;
  TransferSingle(...parameters: any): EventFilter;
  URI(...parameters: any): EventFilter;
}
export type NftSchoolMethodNames =
  | 'new'
  | '_isInitialize'
  | 'balanceOf'
  | 'balanceOfBatch'
  | 'isApprovedForAll'
  | 'minimumGraduationScore'
  | 'registerClassFee'
  | 'safeBatchTransferFrom'
  | 'safeTransferFrom'
  | 'setApprovalForAll'
  | 'supportsInterface'
  | 'uri'
  | 'initialize'
  | 'getAllKnowledgeBlocks'
  | 'updateRegisteredTime'
  | 'getRegisterTime'
  | 'getAllCourses'
  | 'getCourseById'
  | 'getCourseIdByURI'
  | 'createCourse'
  | 'getClassById'
  | 'getAllClasses'
  | 'getCurrentRegisteredClasses'
  | 'getAssignedClasses'
  | 'createClass';
export interface ApprovalForAllEventEmittedResponse {
  account: string;
  operator: string;
  approved: boolean;
}
export interface NewClassCreatedEventEmittedResponse {
  id: BigNumberish;
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
export interface KnowledgeblockResponse {
  id: BigNumber;
  0: BigNumber;
  name: string;
  1: string;
  credits: BigNumber;
  2: BigNumber;
}
export interface GetRegisterTimeResponse {
  result0: BigNumber;
  0: BigNumber;
  result1: BigNumber;
  1: BigNumber;
  length: 2;
}
export interface CourseResponse {
  id: BigNumber;
  0: BigNumber;
  knowledgeBlockId: BigNumber;
  1: BigNumber;
  prevCourseId: BigNumber;
  2: BigNumber;
  credits: BigNumber;
  3: BigNumber;
  status: BigNumber;
  4: BigNumber;
  uri: string;
  5: string;
}
export interface ClassResponse {
  id: BigNumber;
  0: ClassResponse;
  courseId: BigNumber;
  1: ClassResponse;
  knowledgeBlockId: BigNumber;
  2: ClassResponse;
  prevCourseId: BigNumber;
  3: ClassResponse;
  credits: BigNumber;
  4: ClassResponse;
  completeAt: BigNumber;
  5: ClassResponse;
  maxSize: BigNumber;
  6: ClassResponse;
  teacherTokenId: BigNumber;
  7: ClassResponse;
  semester: BigNumber;
  8: ClassResponse;
  uri: string;
  9: ClassResponse;
}
export interface ClassresponseResponse {
  class: ClassResponse;
  0: ClassResponse;
  numberOfStudents: BigNumber;
  1: BigNumber;
}
export interface NftSchool {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param nftIdentities Type: address, Indexed: false
   * @param knowledgeBlockNames Type: string[], Indexed: false
   * @param knowledgeBlockCredits Type: uint256[], Indexed: false
   */
  'new'(
    nftIdentities: string,
    knowledgeBlockNames: string[],
    knowledgeBlockCredits: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  _isInitialize(overrides?: ContractCallOverrides): Promise<boolean>;
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
  minimumGraduationScore(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  registerClassFee(overrides?: ContractCallOverrides): Promise<BigNumber>;
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
  getAllKnowledgeBlocks(
    overrides?: ContractCallOverrides
  ): Promise<KnowledgeblockResponse[]>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param semesterId Type: uint256, Indexed: false
   * @param registeredStartAt Type: uint256, Indexed: false
   * @param registeredEndAt Type: uint256, Indexed: false
   */
  updateRegisteredTime(
    semesterId: BigNumberish,
    registeredStartAt: BigNumberish,
    registeredEndAt: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param semesterId Type: uint256, Indexed: false
   */
  getRegisterTime(
    semesterId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<GetRegisterTimeResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getAllCourses(overrides?: ContractCallOverrides): Promise<CourseResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param id Type: uint256, Indexed: false
   */
  getCourseById(
    id: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<CourseResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenURI Type: string, Indexed: false
   */
  getCourseIdByURI(
    tokenURI: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param prevCourseId Type: uint256, Indexed: false
   * @param knowledgeBlockId Type: uint256, Indexed: false
   * @param credits Type: uint256, Indexed: false
   * @param uri Type: string, Indexed: false
   */
  createCourse(
    prevCourseId: BigNumberish,
    knowledgeBlockId: BigNumberish,
    credits: BigNumberish,
    uri: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param id Type: uint256, Indexed: false
   */
  getClassById(
    id: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<ClassresponseResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getAllClasses(
    overrides?: ContractCallOverrides
  ): Promise<ClassresponseResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param semester Type: uint256, Indexed: false
   */
  getCurrentRegisteredClasses(
    semester: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<ClassresponseResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  getAssignedClasses(
    tokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<ClassresponseResponse[]>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param courseId Type: uint256, Indexed: false
   * @param completeAt Type: uint256, Indexed: false
   * @param maxSize Type: uint256, Indexed: false
   * @param teacherTokenId Type: uint256, Indexed: false
   * @param semester Type: uint256, Indexed: false
   * @param uri Type: string, Indexed: false
   */
  createClass(
    courseId: BigNumberish,
    completeAt: BigNumberish,
    maxSize: BigNumberish,
    teacherTokenId: BigNumberish,
    semester: BigNumberish,
    uri: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
}
