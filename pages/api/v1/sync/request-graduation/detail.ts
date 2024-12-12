import { IHandler } from '@_types/api';
import REQUEST_CONST from 'config/request.json';
import CONST from 'config/constants.json';
import { certificatesService, userService } from 'domain/services';
import { run, withSession } from '@api/utils';
import { addressCheck } from '@api/middleware';
import { createError } from '@api/utils/create-error';

const { METHOD } = REQUEST_CONST;
const { ROLES } = CONST;

const post: IHandler = async (req, res) => {
  const { data, address } = req.body;
  const studentTokenId = await userService.getNftIdentityTokenId(
    address,
    ROLES.STUDENT
  );
  if (studentTokenId !== data.studentTokenId) {
    throw createError(400);
  }

  const result = await certificatesService.syncRequestGraduation(
    data
  );

  res.sendData(200, result);
};

export default withSession(
  run({
    [METHOD.POST]: [addressCheck, post],
  })
);
