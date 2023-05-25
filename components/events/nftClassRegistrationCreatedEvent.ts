import { SignatureData } from '@_types/common';
import { Web3Dependencies } from '@_types/hooks';
import endpoints from 'config/endpoints.json';
import { toast } from 'react-toastify';
import { logger, makeRequest } from 'utils';

export const addNftClassRegistrationCreatedEvent = (
  deps: Partial<Web3Dependencies>,
  options: {
    signatureData: SignatureData;
    metadata: Record<string, any>;
  }
) => {
  const { contracts } = deps;

  contracts.nftClassRegistration.once(
    'NewClassRegistrationCreated',
    async function (nftClassRegistrationId) {
      try {
        const id = nftClassRegistrationId.toNumber();
        const {
          signatureData: { signature, account },
          metadata,
        } = options;
        await makeRequest({
          method: 'POST',
          data: {
            signature,
            address: account,
            data: { id, metadata },
          },
        })([endpoints.registerClasses]);
      } catch (e) {
        logger(e);
        toast.error('Fail to sync to database');
      }
    }
  );
};

export const removeNftClassRegistrationCreatedEvent = ({
  contracts,
}: Web3Dependencies) => {
  contracts.nftClassRegistration.removeAllListeners(
    'NewClassRegistrationCreated'
  );
};
