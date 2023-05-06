import { toast } from 'react-toastify';

import { createAppAsyncThunk, RootState } from '@store';
import { getIpfsLink } from 'utils/pinataHelper';
import request from 'utils/request';
import { loading, unloading } from '@store/appSlice';

export const uploadData = createAppAsyncThunk<
  string,
  {
    data: Record<string, any>;
    getSignedData: (account: string) => Promise<string>;
  }
>('user/uploadData', async (payload, { getState, dispatch }) => {
  try {
    dispatch(loading());
    const { data, getSignedData } = payload;
    const {
      user: { account },
    } = getState();

    const signature = await getSignedData(account);
    const promise = request.post('/api/apply', {
      address: account,
      signature,
      data,
    });

    const res = await toast.promise(promise, {
      pending: 'Uploading metadata',
      success: 'Your profile is uploaded! Please wait for sending request!',
      error: 'Metadata upload error',
    });

    return getIpfsLink(res.data);
  } catch {
    dispatch(unloading());
  }
});

export const uploadFileData = createAppAsyncThunk<
  string,
  {
    file: File;
  },
  {
    state: RootState;
  }
>('user/uploadData', async (payload, thunkAPI) => {
  const { file } = payload;

  const formData = new FormData();
  formData.append('media', file);

  try {
    const promise = request.post('/api/verify-image', formData);

    const res = await toast.promise(promise, {
      pending: 'Uploading image',
      success: 'Image uploaded',
      error: 'Image upload error',
    });

    return res.data?.url || '';
  } catch (e) {
    console.error(e);
  }
});
