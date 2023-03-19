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
  | 'TransferBatch'
  | 'TransferSingle'
  | 'URI';
export interface NftSchoolEventsContext {
  ApprovalForAll(...parameters: any): EventFilter;
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
  | 'registeredEndAt'
  | 'registeredStartAt'
  | 'safeBatchTransferFrom'
  | 'safeTransferFrom'
  | 'schoolYearEnd'
  | 'setApprovalForAll'
  | 'supportsInterface'
  | 'uri'
  | 'yearId'
  | 'initialize'
  | 'initializeYear'
  | 'updateRegisteredTime'
  | 'createCourse'
  | 'updateCourse'
  | 'burnToken'
  | 'getRegisteredClasses'
  | 'getAllKnowledgeBlocks'
  | 'getKnowledgeBlockById'
  | 'getNftClass'
  | 'getAllNftClasses'
  | 'getAllCourses'
  | 'getCourse'
  | 'checkTokenExists'
  | 'checkTokenOfTypeExists'
  | 'checkInRegisterDate';
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
export interface NftclassResponse {
  tokenId: BigNumber;
  0: BigNumber;
  courseId: BigNumber;
  1: BigNumber;
  knowledgeBlockId: BigNumber;
  2: BigNumber;
  credits: BigNumber;
  3: BigNumber;
  registeredStartAt: BigNumber;
  4: BigNumber;
  registeredEndAt: BigNumber;
  5: BigNumber;
  completeAt: BigNumber;
  6: BigNumber;
  requiredScore: BigNumber[];
  7: BigNumber[];
  maxSize: BigNumber;
  8: BigNumber;
  teacherAddr: string;
  9: string;
}
export interface GetRegisteredClassesResponse {
  result0: NftclassResponse[];
  0: NftclassResponse[];
  result1: string[];
  1: string[];
  length: 2;
}
export interface KnowledgeblockResponse {
  id: BigNumber;
  0: BigNumber;
  name: string;
  1: string;
  credits: BigNumber;
  2: BigNumber;
}
export interface GetNftClassResponse {
  result0: NftclassResponse;
  0: NftclassResponse;
  result1: string;
  1: string;
  length: 2;
}
export interface GetAllNftClassesResponse {
  result0: NftclassResponse[];
  0: NftclassResponse[];
  result1: string[];
  1: string[];
  length: 2;
}
export interface NftcourseResponse {
  tokenId: BigNumber;
  0: BigNumber;
  knowledgeBlockId: BigNumber;
  1: BigNumber;
  credits: BigNumber;
  2: BigNumber;
  status: BigNumber;
  3: BigNumber;
}
export interface GetCourseResponse {
  result0: NftcourseResponse;
  0: NftcourseResponse;
  result1: string;
  1: string;
  length: 2;
}
export interface NftSchool {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param nftIdentities Type: address, Indexed: false
   * @param scoreAddr Type: address, Indexed: false
   * @param knowledgeBlockNames Type: string[], Indexed: false
   * @param knowledgeBlockCredits Type: uint256[], Indexed: false
   */
  'new'(
    nftIdentities: string,
    scoreAddr: string,
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
  registeredEndAt(overrides?: ContractCallOverrides): Promise<BigNumber>;
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
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _schoolYearEnd Type: uint256, Indexed: false
   * @param _registeredStartAt Type: uint256, Indexed: false
   * @param _registeredEndAt Type: uint256, Indexed: false
   */
  initializeYear(
    _schoolYearEnd: BigNumberish,
    _registeredStartAt: BigNumberish,
    _registeredEndAt: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _registeredStartAt Type: uint256, Indexed: false
   * @param _registeredEndAt Type: uint256, Indexed: false
   */
  updateRegisteredTime(
    _registeredStartAt: BigNumberish,
    _registeredEndAt: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param knowledgeBlock Type: uint256, Indexed: false
   * @param credits Type: uint256, Indexed: false
   * @param tokenURI Type: string, Indexed: false
   */
  createCourse(
    knowledgeBlock: BigNumberish,
    credits: BigNumberish,
    tokenURI: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param credits Type: uint256, Indexed: false
   */
  updateCourse(
    tokenId: BigNumberish,
    credits: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  burnToken(
    tokenId: BigNumberish,
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
  ): Promise<GetRegisteredClassesResponse>;
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
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param id Type: uint256, Indexed: false
   */
  getKnowledgeBlockById(
    id: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<KnowledgeblockResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  getNftClass(
    tokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<GetNftClassResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _yearId Type: uint256, Indexed: false
   */
  getAllNftClasses(
    _yearId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<GetAllNftClassesResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getAllCourses(
    overrides?: ContractCallOverrides
  ): Promise<NftcourseResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  getCourse(
    tokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<GetCourseResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  checkTokenExists(
    tokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param requiredType Type: uint256, Indexed: false
   */
  checkTokenOfTypeExists(
    tokenId: BigNumberish,
    requiredType: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  checkInRegisterDate(overrides?: ContractCallOverrides): Promise<boolean>;
}
