import { IHandler } from '@_types/api';
import { NftCompleteCourseQuery } from '@_types/api/certificates';
import CONST from 'config/constants.json';
import REQUEST_CONST from 'config/request.json';
import { certificatesService, userService } from 'domain/services';
import { run, withSession } from '@api/utils';
import { CREATE_NFT_COMPLETE_COURSE } from '@validators/schemas';
import addressCheck from '@api/middleware/address-check';
import parseInput from '@api/middleware/parse-input';

const { METHOD } = REQUEST_CONST;
const { ROLES } = CONST;

const get: IHandler = async (req, res) => {
  const result = await certificatesService.getAll(
    req.query as NftCompleteCourseQuery
  );

  res.sendData(200, result);
};

const post: IHandler = async (req, res) => {
  const { data, address } = req.body;
  const teacherTokenId = await userService.getNftIdentityTokenId(
    address,
    ROLES.TEACHER
  );
  const { tokenURI, ...other } = data;
  const result = await certificatesService.grantNftCompleteCourse(
    {
      chainURI: tokenURI,
      ...other,
    },
    teacherTokenId
  );

  res.sendData(200, result);
};

export default withSession(
  run({
    [METHOD.GET]: get,
    [METHOD.POST]: [addressCheck, parseInput(CREATE_NFT_COMPLETE_COURSE), post],
  })
);
