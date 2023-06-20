import { IHandler } from '@_types/api';
import REQUEST_CONST from 'config/request.json';
import { certificatesRepo } from 'domain/repositories';
import { run, withSession } from '@api/utils';

const { METHOD } = REQUEST_CONST;

const get: IHandler = async (req, res) => {
  const result = await certificatesRepo.requestGraduation.getAll(req.query);

  res.sendData(200, result);
};

export default withSession(
  run({
    [METHOD.GET]: get,
  })
);
