import type { NextPage } from 'next';
import { ChangeEvent, useCallback, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import CONST from '@config/constants.json';
import { useAccount, useUserInfo } from '@hooks/web3';
import { InputImage, InputField } from '@molecules';
import { FullPageForm } from '@organisms';
import { useWeb3 } from '@providers/web3';
import { BaseLayout } from '@templates';
import { TeacherMeta } from '@_types/nftIdentity';
import { getSignedData } from 'utils/formHelper';
import { getPinataLink } from 'utils/pinataHelper';
import { useAppDispatch } from '@hooks/stores';
import { loading, unloading } from '@store/appSlice';

const { ROLES } = CONST;

const ApplyTeacher: NextPage = () => {
  const dispatch = useAppDispatch();
  const { ethereum } = useWeb3();
  const {
    account: { data: account },
  } = useAccount();
  const {
    userInfo: { applyTeacher },
  } = useUserInfo();
  const [nftMeta, setNftMeta] = useState<TeacherMeta>({
    fullName: '',
    documentURIs: [],
  });

  const handleImage = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target;

      if (!files?.length) {
        console.error('select a file');

        return;
      }

      const file = files[0];
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);

      try {
        const promise = axios.post('/api/verify-image', {
          address: account,
          signature: await getSignedData(ethereum, account),
          bytes,
          contentType: file.type,
          fileName: file.name.replace(/\.[^/.]+$/, ''),
        });

        const res = await toast.promise(promise, {
          pending: 'Uploading image',
          success: 'Image uploaded',
          error: 'Image upload error',
        });

        setNftMeta((_nftMeta) => ({
          ..._nftMeta,
          documentURIs: [..._nftMeta.documentURIs, getPinataLink(res.data)],
        }));
      } catch (e) {
        console.error(e);
      }
    },
    [ethereum, account]
  );

  const handleRemoveImage = useCallback(
    (image: string) =>
      setNftMeta((_nftMeta) => ({
        ..._nftMeta,
        documentURIs: _nftMeta.documentURIs.filter(
          (documentURI) => documentURI !== image
        ),
      })),
    []
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      setNftMeta((_nftMeta) => ({ ..._nftMeta, [name]: value }));
    },
    []
  );

  const uploadMetadata = useCallback(async () => {
    try {
      dispatch(loading());

      const promise = axios.post('/api/apply', {
        address: account,
        signature: await getSignedData(ethereum, account),
        data: {
          ...nftMeta,
          role: ROLES.TEACHER,
        },
      });

      const res = await toast.promise(promise, {
        pending: 'Uploading metadata',
        success: 'Your profile is uploaded! Please wait for sending request!',
        error: 'Metadata upload error',
      });

      await applyTeacher(getPinataLink(res.data));
    } catch (e: any) {
      console.error(e.message);
    } finally {
      dispatch(unloading());
    }
  }, [nftMeta]);

  return (
    <BaseLayout>
      <FullPageForm
        title="Apply teacher"
        description="You have to pay"
        submitText="Upload"
        onSubmit={uploadMetadata}
      >
        <InputField
          value={nftMeta.fullName}
          onChange={handleChange}
          name="fullName"
          label="Full Name"
          placeholder="Input your full name"
        />
        {/* Has Image? */}
        <InputImage
          images={nftMeta.documentURIs}
          onChange={handleImage}
          onRemove={handleRemoveImage}
        />
      </FullPageForm>
    </BaseLayout>
  );
};

export default ApplyTeacher;
