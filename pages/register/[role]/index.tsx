import { useCallback, useState } from 'react';

import CONST from '@config/constants.json';
import { BaseLayout } from '@templates';
import { useRegisterNftIdentity } from '@hooks/common';
import { useAppSelector } from '@hooks/stores';
import { selectUser } from '@store/userSlice';

import {
  useFormSubmit,
  useInputTextChange,
  useInputImageChange,
} from '@hooks/form';
import { InputField, InputMultipleImages, InputSingleImage } from '@molecules';
import { FullPageForm } from '@organisms';

const { ROLE_LABELS } = CONST;
const FORM_FIELDS = {
  FULL_NAME: 'fullName',
  DOCUMENT_URIS: 'documentURIs',
  PROFILE_IMAGE: 'profileImage',
};
const createFormDefault = () => ({
  fullName: '',
  profileImage: '',
  documentURIs: [],
});

const RegisterRole = () => {
  const registerNftIdentity = useRegisterNftIdentity();

  const [nftMeta, setNftMeta] = useState(createFormDefault());
  const onInputChange = useInputTextChange(setNftMeta);
  const onImageChange = useInputImageChange(setNftMeta);

  const { role } = useAppSelector(selectUser);

  const onSubmit = useFormSubmit(
    () =>
      registerNftIdentity({
        ...nftMeta,
        role,
      }),
    [nftMeta]
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

  return (
    <BaseLayout>
      <FullPageForm
        title={`Apply ${ROLE_LABELS[role]}`}
        description="You have to pay"
        submitText="Upload"
        onSubmit={onSubmit}
      >
        <InputField
          value={nftMeta.fullName}
          onChange={onInputChange}
          name={FORM_FIELDS.FULL_NAME}
          label="Full Name"
          placeholder="Input your full name"
        />
        <InputSingleImage
          id="profile-image"
          name={FORM_FIELDS.PROFILE_IMAGE}
          label="Profile image (160x160)"
          previewClassName="rounded-[50%] aspect-square object-cover w-[160px]"
          image={nftMeta.profileImage}
          onRemove={handleRemoveProfileImage}
          onChange={onImageChange}
        />
        <InputMultipleImages
          id="document-uri"
          label="Your Identity Images"
          name={FORM_FIELDS.DOCUMENT_URIS}
          images={nftMeta.documentURIs}
          onRemove={handleRemoveImage}
          onChange={onImageChange}
        />
      </FullPageForm>
    </BaseLayout>
  );
};

export default RegisterRole;
