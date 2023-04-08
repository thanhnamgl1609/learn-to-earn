import type { NextPage } from 'next';
import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import CONST from '@config/constants.json';
import Routes from '@config/routes.json';
import { useAccount, useUserInfo } from '@hooks/web3';
import { InputField, InputMultipleImages, InputSingleImage } from '@molecules';
import { FullPageForm } from '@organisms';
import { useWeb3 } from '@providers/web3';
import { BaseLayout } from '@templates';
import { TeacherMeta } from '@_types/nftIdentity';
import { getSignedData } from 'utils/formHelper';
import { getPinataLink } from 'utils/pinataHelper';
import { useAppDispatch } from '@hooks/stores';
import { loading, unloading } from '@store/appSlice';
import { APPLY_VALIDATOR } from '@validators/schemas';
import { useRouter } from 'next/router';

const { ROLES } = CONST;

const ApplyTeacher: NextPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { ethereum } = useWeb3();
  const {
    account: { data: account },
  } = useAccount();
  const {
    userInfo: { applyTeacher },
  } = useUserInfo();
  const [nftMeta, setNftMeta] = useState<TeacherMeta>({
    fullName: '',
    profileImage: '',
    documentURIs: [],
  });

  const handleImage = useCallback(
    async (e: ChangeEvent<HTMLInputElement>, callback) => {
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

        callback?.(getPinataLink(res.data));
      } catch (e) {
        console.error(e);
      }
    },
    [ethereum, account]
  );

  const handleProfileImageChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      handleImage(e, (url: string) =>
        setNftMeta((_nftMeta) => ({
          ..._nftMeta,
          profileImage: url,
        }))
      ),
    [handleImage]
  );

  const handleDocumentURIsChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      handleImage(e, (url: string) =>
        setNftMeta((_nftMeta) => ({
          ..._nftMeta,
          documentURIs: [..._nftMeta.documentURIs, url],
        }))
      ),
    [handleImage]
  );

  const handleRemoveProfileImage = useCallback(
    () =>
      setNftMeta((_nftMeta) => ({
        ..._nftMeta,
        profileImage: '',
      })),
    []
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

  const validateForm = () => {
    try {
      APPLY_VALIDATOR.parse(nftMeta);
      return true;
    } catch (e) {
      toast.error('Invalid input! Please make sure all fields are entered');
    }
    return false;
  };

  const uploadMetadata = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!validateForm()) return;
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
        router.push(Routes.applicationDetail);
      } catch (e: any) {
        toast.error(e.message);
      } finally {
        dispatch(unloading());
      }
    },
    [nftMeta]
  );

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
        <InputSingleImage
          label="Profile image (160x160)"
          previewClassName="rounded-[50%] aspect-square object-cover w-[160px]"
          image={nftMeta.profileImage}
          onChange={handleProfileImageChange}
          onRemove={handleRemoveProfileImage}
        />
        <InputMultipleImages
          images={nftMeta.documentURIs}
          onChange={handleDocumentURIsChange}
          onRemove={handleRemoveImage}
        />
      </FullPageForm>
    </BaseLayout>
  );
};

export default ApplyTeacher;
