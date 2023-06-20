import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';

import CONST from '@config/constants.json';
import ROUTES from '@config/routes.json';
import { BaseLayout, FormClassDetail } from '@templates';
import { Breadcrumb, Table } from '@organisms';
import { Box } from '@molecules';
import { Button, Heading, LinkText } from '@atoms';
import {
  useClassDetailApi,
  useNftRegistrationClassListApi,
} from '@hooks/api/classes';
import { NftClassRegistrationEntity } from '@_types/models/entities';
import { classEntity } from 'domain/models';
import { useAppSelector } from '@hooks/stores';
import { selectUser } from '@store/userSlice';
import { GrantNftCompleteCourseModal } from '@templates/Modal';
import { useModalController } from '@hooks/ui';
import { NftClassRegistrationEntityWithApproveStatus } from '@_types/api/class';

const { ROLES } = CONST;

type ColumnProp = {
  item: NftClassRegistrationEntityWithApproveStatus;
  onOpenGrantModal: (
    nftClassRegistration: NftClassRegistrationEntityWithApproveStatus
  ) => void;
};

const tableHeaders = [
  {
    name: 'Token ID',
    custom: ({ item }: ColumnProp) => (
      <LinkText
        className="underline hover:opacity-80"
        href={item.chainURI}
        target="_blank"
      >
        {item.tokenId}
      </LinkText>
    ),
  },
  {
    field: 'student.fullName',
    name: 'Họ và tên',
  },
];

const actionColumn = {
  name: 'Hành động',
  custom: ({ item, onOpenGrantModal }: ColumnProp) => {
    const onOpenModal = () => onOpenGrantModal(item);
    const isNotRequest = !item.isApproved && !item.isRegained;
    const isGranted = item.isRegained && !item.isInQueue;

    const tag = isNotRequest
      ? 'Sinh viên chưa gửi yêu cầu cấp NFT'
      : isGranted
      ? 'Đã cấp NFT'
      : '';
    const isDisabled = isNotRequest || isGranted;

    return (
      <Button
        theme="main"
        onClick={onOpenModal}
        disabled={isDisabled}
        disabledTag={tag}
        customTagClassName="px-2 py-1"
      >
        Cấp NFT
      </Button>
    );
  },
};

const ClassDetailPage = () => {
  const router = useRouter();
  const { id: qid } = router.query;
  const id = parseInt(qid as string);
  if (!id || Number.isNaN(id)) return null;

  const { role, account } = useAppSelector(selectUser);
  const { data: classDetail } = useClassDetailApi(id);
  const { data: studentList = [] } = useNftRegistrationClassListApi(
    {
      classId: id,
    },
    {
      account,
      withApprove: true,
    }
  );
  const displayClassDetail = classEntity.displayClassDetail(
    classDetail || classEntity.createLoadingState()
  );
  const [isGrantModalOpen, openGrantModal, closeGrantModal] =
    useModalController();
  const [selectedNftClassRegistration, setSelectedNftClassRegistration] =
    useState<NftClassRegistrationEntity | null>();

  const onOpenGrantModal = (
    nftClassRegistration: NftClassRegistrationEntity
  ) => {
    openGrantModal();
    setSelectedNftClassRegistration(nftClassRegistration);
  };

  const onCloseGrantModal = () => {
    closeGrantModal();
    setSelectedNftClassRegistration(null);
  };

  const isTeacher = role === ROLES.TEACHER;

  const links = [
    {
      label: 'Manager',
      route: ROUTES.manage,
    },
    {
      label: 'Class List',
      route: ROUTES.classes,
    },
    {
      label: `Lớp #${id}`,
    },
  ];

  const _tableHeaders = useMemo(
    () => (isTeacher ? [...tableHeaders, actionColumn] : tableHeaders),
    [isTeacher]
  );

  return (
    <BaseLayout containerClassName="max-w-[640px]">
      {!isTeacher && <Breadcrumb links={links} />}
      <Box autoLayout>
        <Heading>Class #{classDetail?.onChainId}</Heading>
        {classDetail && <FormClassDetail formState={displayClassDetail} edit />}
      </Box>

      <Box autoLayout>
        <Table
          title={`Danh sách sinh viên`}
          data={studentList}
          headers={_tableHeaders}
          customProps={{ onOpenGrantModal }}
        />
      </Box>

      <GrantNftCompleteCourseModal
        isOpen={isGrantModalOpen}
        onClose={onCloseGrantModal}
        nftClassRegistration={selectedNftClassRegistration}
      />
    </BaseLayout>
  );
};

export default ClassDetailPage;
