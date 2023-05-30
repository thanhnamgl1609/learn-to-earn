import { IHandler } from '@_types/api';
import REQUEST_CONST from 'config/request.json';
import { classService, userService } from 'domain/services';
import { run, withSession } from '@api/utils';
import { addressCheck } from '@api/middleware';
import { createError } from '@api/utils/create-error';

const { METHOD } = REQUEST_CONST;

const get: IHandler = async (req, res) => {
  const result = await classService.getRegisterClasses();

  res.sendData(200, result);
};

const post: IHandler = async (req, res) => {
  const {
    address,
    data: { id },
  } = req.body;

  const studentTokenId = await userService.getNftIdentityTokenId(
    address
  );
  const nftClassRegistration = await classService.getNftRegistrationClass(id);
  if (nftClassRegistration.studentTokenId !== studentTokenId) {
    throw createError(400, 'Không đủ quyền');
  }
  const { classId, tokenId, chainURI } = nftClassRegistration;
  const nftClassRegistrationEntity = await classService.registerClass(
    tokenId,
    studentTokenId,
    classId,
    chainURI
  );

  res.sendData(200, nftClassRegistrationEntity);
};

export default withSession(
  run({
    [METHOD.GET]: get,
    [METHOD.POST]: [addressCheck, post],
  })
);
