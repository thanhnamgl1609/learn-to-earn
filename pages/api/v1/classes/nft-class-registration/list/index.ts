import { IHandler } from '@_types/api';
import REQUEST_CONST from 'config/request.json';
import { run, withSession } from '@api/utils';
import { addressCheck } from '@api/middleware';
import { classService } from 'domain/services';

const { METHOD } = REQUEST_CONST;

const put: IHandler = async (req, res) => {
  const result = await classService.updateScores(req.body.data);

  res.sendData(200, result);
};

export default withSession(
  run({
    [METHOD.PUT]: [addressCheck, put],
  })
);
