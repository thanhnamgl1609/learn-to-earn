import { IHandler } from '@_types/api';
import CONST from 'config/constants.json';
import REQUEST_CONST from 'config/request.json';
import { certificatesService, userService } from 'domain/services';
import { certificatesRepo } from 'domain/repositories';
import { run, withSession } from '@api/utils';

const { METHOD } = REQUEST_CONST;

const get: IHandler = async (req, res) => {
  const result = await certificatesRepo.getGroupByKnowledge(req.query);

  res.sendData(200, result);
};

export default withSession(
  run({
    [METHOD.GET]: get,
  })
);
