import { Web3Dependencies } from '@_types/hooks';

export const addNftGraduationCreatedEvent = (
  contracts: Web3Dependencies['contracts'],
  callback: (tokenId: number) => void
) => {
  contracts.nftGraduation.once('GrantNewNftGraduation', (res) =>
    callback(res.toNumber())
  );
};

export const removeNftGraduationCreatedEvent = ({
  contracts,
}: Web3Dependencies) => {
  contracts.nftGraduation.removeAllListeners('GrantNewNftGraduation');
};
