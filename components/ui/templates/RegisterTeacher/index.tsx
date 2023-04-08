import type { NextPage } from 'next';
import { ChangeEvent, FormEvent, useCallback, useState } from 'react';

import { NftIdentityMetaType, TeacherMeta } from '@_types/nftIdentity';
import CONST from '@config/constants.json';
import { useRegisterNftIdentity } from '@hooks/common';
import {
  useFormSubmit,
  useInputTextChange,
  useInputImageChange,
} from '@hooks/form';
import { InputField, InputMultipleImages, InputSingleImage } from '@molecules';
import { FullPageForm } from '@organisms';

const { ROLES } = CONST;
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

const RegisterTeacher: NextPage = () => {
  const registerNftIdentity = useRegisterNftIdentity();

  const [nftMeta, setNftMeta] = useState(createFormDefault());
  const onInputChange = useInputTextChange(setNftMeta);
  const onImageChange = useInputImageChange(setNftMeta);

  const onSubmit = useFormSubmit(
    () =>
      registerNftIdentity({
        ...nftMeta,
        role: ROLES.TEACHER,
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
    <FullPageForm
      title="Apply teacher"
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
        name={FORM_FIELDS.DOCUMENT_URIS}
        images={nftMeta.documentURIs}
        onRemove={handleRemoveImage}
        onChange={onImageChange}
      />
    </FullPageForm>
  );
};

export default RegisterTeacher;
