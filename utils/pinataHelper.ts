import PINATA_CONST from '@config/pinata.json';
import { PinataRes } from '@_types/common';

const IpfsDomain = PINATA_CONST.IPFS;
export const getIpfsLink = ({ IpfsHash }: PinataRes) =>
  `${IpfsDomain}/${IpfsHash}`;
