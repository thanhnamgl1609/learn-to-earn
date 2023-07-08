export type FileReq = {
  bytes: Uint8Array;
  contentType: string;
  fileName: string;
};

export type PinataRes = {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate: boolean;
}

export type SignatureData = {
  signature: string;
  address?: string;
}
