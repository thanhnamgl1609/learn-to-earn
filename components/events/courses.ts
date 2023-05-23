import { useApi } from '@hooks/common';
import { useAppSelector } from '@hooks/stores';
import { useContracts } from '@providers/web3';
import { selectUser } from '@store/userSlice';
import { Web3Dependencies } from '@_types/hooks';
import endpoints from 'config/endpoints.json';
import { toast } from 'react-toastify';
import { logger, makeRequest } from 'utils';
import { getSignedData } from 'utils/sign';

export const addClassCreatedEvent = (deps: Web3Dependencies) => {
  const { contracts } = deps;

  contracts.nftSchool.once('NewClassCreated', async function (classId) {
    try {
      const _classId = classId.toNumber();
      const { signature, account } = await getSignedData(deps);
      await makeRequest({
        method: 'POST',
        data: {
          signature,
          address: account,
          data: { classId: _classId },
        },
      })([endpoints.classes]);
    } catch (e) {
      logger(e);
      toast.error('Fail to sync to database');
    }
  });
};

export const removeEvents = ({ contracts }: Web3Dependencies) => {
  contracts.nftSchool.removeAllListeners('NewClassCreated');
};
