import { Web3Dependencies } from '@_types/hooks';

export const addNftCompleteCourseCreatedEvent = (
  deps: Partial<Web3Dependencies>,
  callback: (tokenId: number) => void
) => {
  const { contracts } = deps;

  contracts.nftCertificates.once('NewCompleteCourseCreated', (res) =>
    callback(res.toNumber())
  );
};

export const removeNftCompleteCourseCreatedEvent = ({
  contracts,
}: Web3Dependencies) => {
  contracts.nftCertificates.removeAllListeners('NewCompleteCourseCreated');
};
