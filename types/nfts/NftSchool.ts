import BN from 'bn.js';
import BigNumber from 'bignumber.js';
import {
  PromiEvent,
  TransactionReceipt,
  EventResponse,
  EventData,
  Web3ContractContext,
} from 'ethereum-abi-types-generator';

export interface CallOptions {
  from?: string;
  gasPrice?: string;
  gas?: number;
}

export interface SendOptions {
  from: string;
  value?: number | string | BN | BigNumber;
  gasPrice?: string;
  gas?: number;
}

export interface EstimateGasOptions {
  from?: string;
  value?: number | string | BN | BigNumber;
  gas?: number;
}

export interface MethodPayableReturnContext {
  send(options: SendOptions): PromiEvent<TransactionReceipt>;
  send(
    options: SendOptions,
    callback: (error: Error, result: any) => void
  ): PromiEvent<TransactionReceipt>;
  estimateGas(options: EstimateGasOptions): Promise<number>;
  estimateGas(
    options: EstimateGasOptions,
    callback: (error: Error, result: any) => void
  ): Promise<number>;
  encodeABI(): string;
}

export interface MethodConstantReturnContext<TCallReturn> {
  call(): Promise<TCallReturn>;
  call(options: CallOptions): Promise<TCallReturn>;
  call(
    options: CallOptions,
    callback: (error: Error, result: TCallReturn) => void
  ): Promise<TCallReturn>;
  encodeABI(): string;
}

export interface MethodReturnContext extends MethodPayableReturnContext {}

export type ContractContext = Web3ContractContext<
  NftSchool,
  NftSchoolMethodNames,
  NftSchoolEventsContext,
  NftSchoolEvents
>;
export type NftSchoolEvents =
  | 'ApprovalForAll'
  | 'TransferBatch'
  | 'TransferSingle'
  | 'URI';
export interface NftSchoolEventsContext {
  ApprovalForAll(
    parameters: {
      filter?: { account?: string | string[]; operator?: string | string[] };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  TransferBatch(
    parameters: {
      filter?: {
        operator?: string | string[];
        from?: string | string[];
        to?: string | string[];
      };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  TransferSingle(
    parameters: {
      filter?: {
        operator?: string | string[];
        from?: string | string[];
        to?: string | string[];
      };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  URI(
    parameters: {
      filter?: { id?: string | string[] };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
}
export type NftSchoolMethodNames =
  | 'new'
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
  | 'initializeRequirement'
  | 'initializeCourseTemplate'
  | 'initializeYear'
  | 'updateRegisteredTime'
  | 'createRequirement'
  | 'updateRequirement'
  | 'createCourseTemplate'
  | 'updateCourseTemplate'
  | 'burnToken'
  | 'getRegisteredClasses'
  | 'getAllNftRequirements'
  | 'getNftRequirement'
  | 'getNftClass'
  | 'getAllNftClasses'
  | 'getAllNftCourseTemplate'
  | 'getNftCourseTemplate'
  | 'checkTokenExists'
  | 'checkTokenOfTypeExists'
  | 'checkInRegisterDate'
  | '_mintNftRequirement';
export interface ApprovalForAllEventEmittedResponse {
  account: string;
  operator: string;
  approved: boolean;
}
export interface TransferBatchEventEmittedResponse {
  operator: string;
  from: string;
  to: string;
  ids: string[];
  values: string[];
}
export interface TransferSingleEventEmittedResponse {
  operator: string;
  from: string;
  to: string;
  id: string;
  value: string;
}
export interface URIEventEmittedResponse {
  value: string;
  id: string;
}
export interface NftclassResponse {
  tokenId: string;
  courseTemplateId: string;
  requirementId: string;
  credits: string;
  registeredStartAt: string;
  registeredEndAt: string;
  completeAt: string;
  requiredScore: string[];
  maxSize: string;
  teacherAddr: string;
}
export interface GetRegisteredClassesResponse {
  result0: NftclassResponse[];
  result1: string[];
}
export interface NftrequirementResponse {
  tokenId: string;
  credits: string;
}
export interface GetAllNftRequirementsResponse {
  result0: NftrequirementResponse[];
  result1: string[];
}
export interface GetNftRequirementResponse {
  result0: NftrequirementResponse;
  result1: string;
}
export interface GetNftClassResponse {
  result0: NftclassResponse;
  result1: string;
}
export interface GetAllNftClassesResponse {
  result0: NftclassResponse[];
  result1: string[];
}
export interface NftcoursetemplateResponse {
  tokenId: string;
  requirementId: string;
  credits: string;
}
export interface GetNftCourseTemplateResponse {
  result0: NftcoursetemplateResponse;
  result1: string;
}
export interface NftSchool {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param nftIdentities Type: address, Indexed: false
   * @param scoreAddr Type: address, Indexed: false
   */
  'new'(nftIdentities: string, scoreAddr: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param account Type: address, Indexed: false
   * @param id Type: uint256, Indexed: false
   */
  balanceOf(account: string, id: string): MethodConstantReturnContext<string>;
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
    ids: string[]
  ): MethodConstantReturnContext<string[]>;
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
    operator: string
  ): MethodConstantReturnContext<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  minimumGraduationScore(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  registeredEndAt(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  registeredStartAt(): MethodConstantReturnContext<string>;
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
    ids: string[],
    amounts: string[],
    data: string | number[]
  ): MethodReturnContext;
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
    id: string,
    amount: string,
    data: string | number[]
  ): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  schoolYearEnd(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param operator Type: address, Indexed: false
   * @param approved Type: bool, Indexed: false
   */
  setApprovalForAll(operator: string, approved: boolean): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param interfaceId Type: bytes4, Indexed: false
   */
  supportsInterface(
    interfaceId: string | number[]
  ): MethodConstantReturnContext<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  uri(tokenId: string): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  yearId(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param nftCertificates Type: address, Indexed: false
   */
  initialize(nftCertificates: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param credits Type: uint256[], Indexed: false
   * @param tokenURIs Type: string[], Indexed: false
   */
  initializeRequirement(
    credits: string[],
    tokenURIs: string[]
  ): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param requirementIds Type: uint256[], Indexed: false
   * @param credits Type: uint256[], Indexed: false
   * @param tokenURIs Type: string[], Indexed: false
   */
  initializeCourseTemplate(
    requirementIds: string[],
    credits: string[],
    tokenURIs: string[]
  ): MethodReturnContext;
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
    _schoolYearEnd: string,
    _registeredStartAt: string,
    _registeredEndAt: string
  ): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _registeredStartAt Type: uint256, Indexed: false
   * @param _registeredEndAt Type: uint256, Indexed: false
   */
  updateRegisteredTime(
    _registeredStartAt: string,
    _registeredEndAt: string
  ): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param credits Type: uint256, Indexed: false
   * @param tokenURI Type: string, Indexed: false
   */
  createRequirement(credits: string, tokenURI: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param credits Type: uint256, Indexed: false
   */
  updateRequirement(tokenId: string, credits: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param requirementId Type: uint256, Indexed: false
   * @param credits Type: uint256, Indexed: false
   * @param tokenURI Type: string, Indexed: false
   */
  createCourseTemplate(
    requirementId: string,
    credits: string,
    tokenURI: string
  ): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param credits Type: uint256, Indexed: false
   */
  updateCourseTemplate(tokenId: string, credits: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  burnToken(tokenId: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getRegisteredClasses(): MethodConstantReturnContext<GetRegisteredClassesResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getAllNftRequirements(): MethodConstantReturnContext<GetAllNftRequirementsResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  getNftRequirement(
    tokenId: string
  ): MethodConstantReturnContext<GetNftRequirementResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  getNftClass(
    tokenId: string
  ): MethodConstantReturnContext<GetNftClassResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _yearId Type: uint256, Indexed: false
   */
  getAllNftClasses(
    _yearId: string
  ): MethodConstantReturnContext<GetAllNftClassesResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getAllNftCourseTemplate(): MethodConstantReturnContext<
    NftcoursetemplateResponse[]
  >;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  getNftCourseTemplate(
    tokenId: string
  ): MethodConstantReturnContext<GetNftCourseTemplateResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  checkTokenExists(tokenId: string): MethodConstantReturnContext<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param requiredType Type: uint256, Indexed: false
   */
  checkTokenOfTypeExists(
    tokenId: string,
    requiredType: string
  ): MethodConstantReturnContext<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  checkInRegisterDate(): MethodConstantReturnContext<boolean>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param credits Type: uint256, Indexed: false
   * @param tokenURI Type: string, Indexed: false
   */
  _mintNftRequirement(credits: string, tokenURI: string): MethodReturnContext;
}
