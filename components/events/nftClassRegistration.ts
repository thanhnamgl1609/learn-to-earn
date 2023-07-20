import { SignatureData } from '@_types/common';
import { Web3Dependencies } from '@_types/hooks';
import endpoints from 'config/endpoints.json';
import { toast } from 'react-toastify';
import { logger, makeRequest } from 'utils';

export const addNftClassRegistrationCreatedEvent = (
  deps: Partial<Web3Dependencies>,
  syncDB: (tokenId: number) => Promise<void>
) => {
  const { contracts } = deps;

  contracts.nftClassRegistration.once(
    'NewClassRegistrationCreated',
    (tokenId) => syncDB(tokenId.toNumber())
  );
};

export const removeNftClassRegistrationCreatedEvent = ({
  contracts,
}: Web3Dependencies) => {
  contracts.nftClassRegistration.removeAllListeners(
    'NewClassRegistrationCreated'
  );
};
