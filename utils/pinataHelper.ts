import PINATA_CONST from '@config/pinata.json';
import { PinataRes } from '@_types/common';

const pinataDomain = PINATA_CONST.CLOUD;
export const getPinataLink = ({ IpfsHash }: PinataRes) =>
  `${pinataDomain}/ipfs/${IpfsHash}`;
