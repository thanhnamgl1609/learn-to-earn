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
export type NftSchoolEvents = 'NewClassCreated';
export interface NftSchoolEventsContext {
  NewClassCreated(...parameters: any): EventFilter;
}
export type NftSchoolMethodNames =
  | 'new'
  | '_isInitialize'
  | 'minimumGraduationScore'
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
  | 'getClassBySemester'
  | 'getAssignedClasses'
  | 'createClass'
  | 'getRegisterFeeClassById';
export interface NewClassCreatedEventEmittedResponse {
  id: BigNumberish;
}
export interface KnowledgeblockResponse {
  id: BigNumber;
  0: BigNumber;
  credits: BigNumber;
  1: BigNumber;
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
  courseCode: string;
  5: string;
  uri: string;
  6: string;
}
export interface ClassResponse {
  id: BigNumber;
  0: BigNumber;
  courseId: BigNumber;
  1: BigNumber;
  knowledgeBlockId: BigNumber;
  2: BigNumber;
  prevCourseId: BigNumber;
  3: BigNumber;
  credits: BigNumber;
  4: BigNumber;
  completeAt: BigNumber;
  5: BigNumber;
  maxSize: BigNumber;
  6: BigNumber;
  teacherTokenId: BigNumber;
  7: BigNumber;
  semester: BigNumber;
  8: BigNumber;
  registerClassFee: BigNumber;
  9: BigNumber;
  uri: string;
  10: string;
}
export interface NftSchool {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param nftIdentities Type: address, Indexed: false
   * @param knowledgeBlockIds Type: uint256[], Indexed: false
   * @param knowledgeBlockCredits Type: uint256[], Indexed: false
   */
  'new'(
    nftIdentities: string,
    knowledgeBlockIds: BigNumberish[],
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
   */
  minimumGraduationScore(overrides?: ContractCallOverrides): Promise<BigNumber>;
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
   * @param courseCode Type: string, Indexed: false
   * @param uri Type: string, Indexed: false
   */
  createCourse(
    prevCourseId: BigNumberish,
    knowledgeBlockId: BigNumberish,
    credits: BigNumberish,
    courseCode: string,
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
  ): Promise<ClassResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getAllClasses(overrides?: ContractCallOverrides): Promise<ClassResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param semester Type: uint256, Indexed: false
   */
  getClassBySemester(
    semester: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<ClassResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param teacherTokenId Type: uint256, Indexed: false
   */
  getAssignedClasses(
    teacherTokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<ClassResponse[]>;
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
   * @param registerClassFee Type: uint256, Indexed: false
   * @param uri Type: string, Indexed: false
   */
  createClass(
    courseId: BigNumberish,
    completeAt: BigNumberish,
    maxSize: BigNumberish,
    teacherTokenId: BigNumberish,
    semester: BigNumberish,
    registerClassFee: BigNumberish,
    uri: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  getRegisterFeeClassById(
    tokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
}
