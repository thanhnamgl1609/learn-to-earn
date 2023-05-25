import { IHandler } from '@_types/api';
import REQUEST_CONST from 'config/request.json';
import { run, withSession } from '@api/utils';
import { ClassQuery } from '@_types/api/class';
import { classService } from 'domain/services';

const { METHOD } = REQUEST_CONST;

const get: IHandler = async (req, res) => {
  const { teacherTokenId } = req.query as ClassQuery;
  const result = await classService.getAssignedClasses(teacherTokenId);

  res.sendData(200, result);
};

export default withSession(
  run({
    [METHOD.GET]: get,
  })
);
