import useSWR, { SWRResponse } from 'swr';
import { UserQuery } from '@_types/api/user';
import { makeRequest } from 'utils';
import endpoints from 'config/endpoints.json';
import { useApi } from '@hooks/common';
import { UserEntity } from '@_types/models/entities';
import { useAppDispatch } from '@hooks/stores';
import { useSelector } from 'react-redux';
import {
  selectCurrentNftIdentity,
  updateUser,
} from '@store/userSlice';

export const useMe = () => {
  const { tokenId } = useSelector(selectCurrentNftIdentity);
  const dispatch = useAppDispatch();

  const getter = useApi(async () => {
    const detail = (await makeRequest()([
      endpoints.userDetail,
      { tokenId },
    ])) as UserEntity;
    dispatch(
      updateUser({
        detail,
      })
    );

    return detail as UserEntity;
  }, [tokenId]);

  return getter;
};
