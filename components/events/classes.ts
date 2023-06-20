import { Web3Dependencies } from '@_types/hooks';
import endpoints from 'config/endpoints.json';
import { toast } from 'react-toastify';
import { logger, makeRequest } from 'utils';
import { getSignedData } from 'utils/sign';

export const addClassCreatedEvent = (
  deps: Partial<Web3Dependencies>,
  callback: (id: number) => void
) => {
  const { contracts } = deps;

  contracts.nftSchool.once('NewClassCreated', (res) =>
    callback(res.toNumber())
  );
};

export const removeEvents = ({ contracts }: Web3Dependencies) => {
  contracts.nftSchool.removeAllListeners('NewClassCreated');
};
