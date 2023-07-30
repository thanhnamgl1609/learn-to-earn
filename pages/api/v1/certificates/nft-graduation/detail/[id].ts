import { IHandler } from '@_types/api';
import { NftCompleteCourseQuery } from '@_types/api/certificates';
import REQUEST_CONST from 'config/request.json';
import { certificatesService } from 'domain/services';
import { run, withSession } from '@api/utils';
import { createError } from '@api/utils/create-error';

const { METHOD } = REQUEST_CONST;

const get: IHandler = async (req, res) => {
  const { id } = req.query;
  if (!id) throw createError(400);

  const result = await certificatesService.getNftGraduation(
    req.query as NftCompleteCourseQuery
  );

  res.sendData(200, result);
};

export default withSession(
  run({
    [METHOD.GET]: get,
  })
);
