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
  NftCertificates,
  NftCertificatesMethodNames,
  NftCertificatesEventsContext,
  NftCertificatesEvents
>;
export type NftCertificatesEvents =
  | 'ApprovalForAll'
  | 'TransferBatch'
  | 'TransferSingle'
  | 'URI';
export interface NftCertificatesEventsContext {
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
  | 'getNftScoreBoard'
  | 'registerClass'
  | 'updateScores'
  | 'exchangeCompleteCourse'
  | 'exchangeGraduation';
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
export interface NftcompletecourseResponse {
  tokenId: string;
  courseTemplateId: string;
  requirementId: string;
  credits: string;
  avgScore: string;
}
export interface GetOwnedNftCompleteCourseResponse {
  result0: NftcompletecourseResponse[];
  result1: string[];
}
export interface GetNftCompleteCourseResponse {
  result0: NftcompletecourseResponse;
  result1: string;
}
export interface NftgraduationResponse {
  tokenId: string;
}
export interface GetOwnedNftGraduationResponse {
  result0: NftgraduationResponse;
  result1: string;
}
export interface GetNftGraduationResponse {
  result0: NftgraduationResponse;
  result1: string;
}
export interface NftscoreboardResponse {
  tokenId: string;
  classId: string;
  courseTemplateId: string;
  requirementId: string;
  credits: string;
  completeAt: string;
  studentAddr: string;
  teacherAddr: string;
  requiredScore: string[];
  scores: string[];
}
export interface GetNftScoreBoardResponse {
  result0: NftscoreboardResponse;
  result1: string;
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
  'new'(nftIdentities: string, nftSchool: string): MethodReturnContext;
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
   */
  graduationPrice(): MethodConstantReturnContext<string>;
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
  registeredEndAt(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  registeredPrice(): MethodConstantReturnContext<string>;
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
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getOwnedNftCompleteCourse(): MethodConstantReturnContext<GetOwnedNftCompleteCourseResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  getNftCompleteCourse(
    tokenId: string
  ): MethodConstantReturnContext<GetNftCompleteCourseResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getOwnedNftGraduation(): MethodConstantReturnContext<GetOwnedNftGraduationResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  getNftGraduation(
    tokenId: string
  ): MethodConstantReturnContext<GetNftGraduationResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  getNftScoreBoard(
    tokenId: string
  ): MethodConstantReturnContext<GetNftScoreBoardResponse>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param classId Type: uint256, Indexed: false
   * @param tokenURI Type: string, Indexed: false
   */
  registerClass(classId: string, tokenURI: string): MethodPayableReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param scoreBoardId Type: uint256, Indexed: false
   * @param requireScore Type: uint256[], Indexed: false
   * @param scores Type: uint256[], Indexed: false
   */
  updateScores(
    scoreBoardId: string,
    requireScore: string[],
    scores: string[]
  ): MethodReturnContext;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param scoreBoardId Type: uint256, Indexed: false
   * @param tokenURI Type: string, Indexed: false
   */
  exchangeCompleteCourse(
    scoreBoardId: string,
    tokenURI: string
  ): MethodPayableReturnContext;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param nftCompleteCourseIds Type: uint256[], Indexed: false
   * @param tokenURI Type: string, Indexed: false
   */
  exchangeGraduation(
    nftCompleteCourseIds: string[],
    tokenURI: string
  ): MethodPayableReturnContext;
}
