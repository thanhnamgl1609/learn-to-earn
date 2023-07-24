import { v4 as uuidv4 } from 'uuid';
import { IHandler } from '@_types/api';
import REQUEST_CONST from 'config/request.json';
import { run, withSession } from '@api/utils';
import {
  nftCompleteCoursesContractAddress,
  nftClassRegistrationContractAddress,
  schoolsContractAddress,
  nftIdentitiesContractAddress,
  nftGraduationContractAddress,
} from '@api/utils/load-contract';
import { createError } from '@api/utils/create-error';

const { METHOD } = REQUEST_CONST;

const post: IHandler = async (req, res) => {
  try {
    const message = {
      id: uuidv4(),
      nftIdentitiesContractAddress,
      schoolsContractAddress,
      nftCompleteCoursesContractAddress,
      nftClassRegistrationContractAddress,
      nftGraduationContractAddress,
    };
    req.session.set('message-session', message);
    await req.session.save();
    res.sendData(200, message);
  } catch {
    throw createError(400, 'cannot generate a message!');
  }
};

export default withSession(
  run({
    [METHOD.POST]: post,
  })
);
