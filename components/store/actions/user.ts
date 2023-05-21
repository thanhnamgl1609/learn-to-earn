import { toast } from 'react-toastify';

import { createAppAsyncThunk, RootState } from '@store';
import { getIpfsLink } from 'utils/pinataHelper';
import { request } from 'utils';

export const uploadData = createAppAsyncThunk<
  { link: string; meta: Record<string, any> },
  {
    data: Record<string, any>;
    getSignedData?: (account: string) => Promise<string>;
    signature?: string;
    successText?: string;
  }
>('user/uploadData', async (payload, { getState }) => {
  const { data, getSignedData, successText = '', signature } = payload;
  const {
    user: { account },
  } = getState();

  const _signature = !signature ? await getSignedData(account) : signature;
  const promise = request.post('/api/apply', {
    address: account,
    signature: _signature,
    data,
  });

  const res = await toast.promise(promise, {
    pending: 'Uploading metadata',
    success: successText,
    error: 'Metadata upload error',
  });
  const { link, meta } = res.data;

  return { link: getIpfsLink(link), meta };
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
