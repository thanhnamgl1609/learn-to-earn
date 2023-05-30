import { IHandler } from '@_types/api';
import REQUEST_CONST from 'config/request.json';
import { knowledgeBlocksRepo } from 'domain/repositories';
import { run, withSession } from '@api/utils';

const { METHOD } = REQUEST_CONST;

const get: IHandler = async (_, res) => {
  const result = await knowledgeBlocksRepo.getAll();

  res.sendData(200, result);
};

export default withSession(
  run({
    [METHOD.GET]: get,
  })
);
