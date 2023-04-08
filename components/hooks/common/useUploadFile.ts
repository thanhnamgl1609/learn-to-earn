import { ChangeEvent, useCallback } from 'react';
import { toast } from 'react-toastify';

import { selectUser } from '@store/userSlice';
import { uploadFileData } from '@store/actions';
import { useAppDispatch, useAppSelector } from '@hooks/stores';
import { useUtilities } from '@hooks/web3';
import { loading, unloading } from '@store/appSlice';

const useUploadFile = () => {
  const { getSignedData } = useUtilities();
  const { account } = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  return useCallback(
    async (
      e: ChangeEvent<HTMLInputElement>,
      callback: (data: string) => void
    ) => {
      const { files } = e.target;

      if (!files?.length) {
        toast.error('select a file');

        return;
      }

      try {
        dispatch(loading());
        const link = await dispatch(
          uploadFileData({ file: files[0], getSignedData })
        ).unwrap();

        await callback?.(link);
        dispatch(unloading());

        return link;
      } catch (e) {
        console.error(e);
      }
    },
    [account]
  );
};

export default useUploadFile;
