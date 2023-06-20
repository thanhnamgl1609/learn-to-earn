import { IHandler } from '@_types/api';
import REQUEST_CONST from 'config/request.json';
import { certificatesService } from 'domain/services';
import { run, withSession } from '@api/utils';
import { addressCheck, isOwner } from '@api/middleware';

const { METHOD } = REQUEST_CONST;

const post: IHandler = async (req, res) => {
  const { data } = req.body;
  const result = await certificatesService.syncNftGraduation(data);

  res.sendData(200, result);
};

export default withSession(
  run({
    [METHOD.POST]: [addressCheck, isOwner, post],
  })
);
