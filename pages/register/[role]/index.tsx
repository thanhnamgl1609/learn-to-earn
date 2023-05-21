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
import {
  InputField,
  InputMultipleImages,
  InputSingleImage,
  SelectField,
} from '@molecules';
import { FullPageForm } from '@organisms';
import { formatDate } from 'utils';

const {
  ROLE_LABELS,
  UI: { INPUT_DATE_FORMAT },
} = CONST;
const FORM_FIELDS = {
  FULL_NAME: 'fullName',
  DOCUMENT_URIS: 'documentURIs',
  PROFILE_IMAGE: 'profileImage',
  GENDER: 'gender',
  DATE_OF_BIRTH: 'dateOfBirth',
  PERSONAL_EMAIL: 'personalEmail',
  IDENTITY_NUMBER: 'identityNumber',
  PHONE: 'phone',
};
const createFormDefault = () => ({
  fullName: '',
  profileImage: '',
  documentURIs: [],
  gender: 0,
  dateOfBirth: formatDate(new Date('2000-01-01'), INPUT_DATE_FORMAT),
  personalEmail: '',
  identityNumber: '',
  phone: '',
});

const RegisterRole = () => {
  const registerNftIdentity = useRegisterNftIdentity();

  const [nftMeta, setNftMeta] = useState(createFormDefault());
  const onInputChange = useInputTextChange(setNftMeta);
  const onImageChange = useInputImageChange(setNftMeta);

  const { role } = useAppSelector(selectUser);
  const genderOptions = [
    {
      label: 'Nam',
      value: 0,
    },
    {
      label: 'Nữ',
      value: 1,
    },
  ];

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
          label="Họ và tên"
          placeholder="Nhập họ và tên"
        />
        <SelectField
          options={genderOptions}
          onChange={onInputChange}
          name={FORM_FIELDS.GENDER}
          label="Giới tính"
        />
        <InputField
          value={nftMeta.dateOfBirth}
          type="date"
          onChange={onInputChange}
          name={FORM_FIELDS.DATE_OF_BIRTH}
          label="Ngày sinh"
          placeholder="Nhập ngày tháng năm sinh"
        />
        <InputField
          value={nftMeta.personalEmail}
          onChange={onInputChange}
          name={FORM_FIELDS.PERSONAL_EMAIL}
          label="Email cá nhấn"
          placeholder="Nhập email cá nhân"
        />
        <InputField
          value={nftMeta.identityNumber}
          onChange={onInputChange}
          name={FORM_FIELDS.IDENTITY_NUMBER}
          label="Số CMND/CCCD"
          placeholder="Nhập số CMND/CCCD"
        />
        <InputField
          value={nftMeta.phone}
          onChange={onInputChange}
          name={FORM_FIELDS.PHONE}
          label="Số Điện Thoại"
          placeholder="Nhập số điện thoại liên lạc"
        />
        <InputSingleImage
          id="profile-image"
          name={FORM_FIELDS.PROFILE_IMAGE}
          label="Ảnh đại diện (160x160)"
          previewClassName="rounded-[50%] aspect-square object-cover w-[160px]"
          image={nftMeta.profileImage}
          onRemove={handleRemoveProfileImage}
          onChange={onImageChange}
        />
        <InputMultipleImages
          id="document-uri"
          label="Hình ảnh 2 mặt CMND/CCCD"
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
