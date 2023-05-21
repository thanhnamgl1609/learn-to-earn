import _ from 'lodash';

import CONST from '@config/constants.json';
import { useAppDispatch, useAppSelector } from '@hooks/stores';
import { useSchoolActions, useUtilities } from '@hooks/web3';
import { uploadData } from '@store/actions';
import { selectUser } from '@store/userSlice';
import { Class } from '@_types/school';
import { useApi } from './useApi';

const { ROLES } = CONST;

export const useRegisterClass = () => {
  const { registerClass } = useSchoolActions();
  const { getSignedData } = useUtilities();
  const dispatch = useAppDispatch();
  const { nftIdentities } = useAppSelector(selectUser);

  const caller = useApi(async (item: Class) => {
    const nftIdentity = nftIdentities.find(
      ({ role }) => role === ROLES.STUDENT
    );
    const data = {
      classInfo: _.pick(item, [
        'id',
        'knowledgeBlockId',
        'prevCourseId',
        'teacherTokenId',
        'credits',
        'courseId',
        'completeAt',
        'maxSize',
        'registeredStartAt',
        'registeredEndAt',
        'meta',
      ]),
      owner: {
        tokenId: nftIdentity.tokenId,
        ...nftIdentity.meta,
      },
    };

    const { link } = await dispatch(
      uploadData({
        data,
        getSignedData,
        successText: 'Upload succesfully! Please wait for sending request!',
      })
    ).unwrap();

    registerClass(item.id, link);
  });

  return caller;
};
