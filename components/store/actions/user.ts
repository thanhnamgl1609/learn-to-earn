import { toast } from 'react-toastify';

import { createAppAsyncThunk, RootState } from '@store';
import { getPinataLink } from 'utils/pinataHelper';
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

    return getPinataLink(res.data);
  } catch {
    dispatch(unloading());
  }
});

export const uploadFileData = createAppAsyncThunk<
  string,
  {
    file: File;
    getSignedData: (account: string) => Promise<string>;
  },
  {
    state: RootState;
  }
>('user/uploadData', async (payload, thunkAPI) => {
  const { file, getSignedData } = payload;
  const {
    user: { account },
  } = thunkAPI.getState();

  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  try {
    const signature = await getSignedData(account);

    const promise = request.post('/api/verify-image', {
      address: account,
      signature,
      bytes,
      contentType: file.type,
      fileName: file.name.replace(/\.[^/.]+$/, ''),
    });

    const res = await toast.promise(promise, {
      pending: 'Uploading image',
      success: 'Image uploaded',
      error: 'Image upload error',
    });

    return getPinataLink(res.data);
  } catch (e) {
    console.error(e);
  }
});
