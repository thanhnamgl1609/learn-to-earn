import { IHandler } from '@_types/api';
import REQUEST_CONST from 'config/request.json';
import { coursesRepo } from 'domain/repositories';
import { run, withSession } from '@api/utils';
import addressCheck from '@api/middleware/address-check';
import { isOwner } from '@api/middleware';

const { METHOD } = REQUEST_CONST;

const get: IHandler = async (req, res) => {
  const result = await coursesRepo.getAll(req.query);

  res.sendData(200, result);
};

const post: IHandler = async (req, res) => {
  const { data } = req.body;
  const result = await coursesRepo.upsert(data);

  res.sendData(200, result);
};

export default withSession(
  run({
    [METHOD.GET]: get,
    [METHOD.POST]: [addressCheck, isOwner, post],
  })
);
