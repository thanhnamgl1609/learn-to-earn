import { IHandler } from '@_types/api';
import REQUEST_CONST from 'config/request.json';
import { usersRepo } from 'domain/repositories';
import { run, withSession } from '@api/utils';
import addressCheck from '@api/middleware/address-check';
import { isOwner } from '@api/middleware';

const { METHOD } = REQUEST_CONST;

const get: IHandler = async (req, res) => {
  const result = await usersRepo.getAll(req.query);

  res.sendData(200, result);
};

export default withSession(
  run({
    [METHOD.GET]: get,
  })
);
