import { IHandler } from '@_types/api';
import REQUEST_CONST from 'config/request.json';
import { run, withSession } from '@api/utils';
import { classesRepo } from 'domain/repositories';
import { NftClassRegistrationQuery } from '@_types/api/class';

const { METHOD } = REQUEST_CONST;

const get: IHandler = async (req, res) => {
  const { studentTokenId, classId, isRegained } =
    req.query as NftClassRegistrationQuery;
  const result = await classesRepo.getNftClassRegistrations({
    studentTokenId,
    classId,
    isRegained,
  });

  res.sendData(200, result);
};

export default withSession(
  run({
    [METHOD.GET]: get,
  })
);
