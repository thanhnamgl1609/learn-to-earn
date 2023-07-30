import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';

import CONST from '@config/constants.json';
import ROUTES from '@config/routes.json';
import { BaseLayout, FormClassDetail } from '@templates';
import { Breadcrumb, Table } from '@organisms';
import { Box } from '@molecules';
import {
  Button,
  Heading,
  Input,
  InputFileButton,
  LinkText,
} from '@atoms';
import {
  useClassDetailApi,
  useNftRegistrationClassListApi,
} from '@hooks/api/classes';
import { NftClassRegistrationEntity } from '@_types/models/entities';
import { classEntity } from 'domain/models';
import { useAppDispatch, useAppSelector } from '@hooks/stores';
import { selectUser } from '@store/userSlice';
import { UpdateScoreModal } from '@templates/Modal';
import { useModalController } from '@hooks/ui';
import { toast } from 'react-toastify';
import { useUploadCSV } from '@hooks/form/useUploadCSV';
import { openConfirmModal } from '@store/appSlice';
import { useUpdateScores } from '@hooks/common';

const { ROLES } = CONST;

type ColumnProp = {
  item: NftClassRegistrationEntity;
  onOpenGrantModal: (
    nftClassRegistration: NftClassRegistrationEntity
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
    name: 'MSSV',
    field: 'student.memberCode',
  },
  {
    field: 'student.fullName',
    name: 'Họ và tên',
  },
  {
    name: 'Điểm số',
    custom: ({ item }: ColumnProp) => (
      <p className="text-center">{item.score || 'X'}</p>
    ),
  },
  {
  name: 'Hành động',
  custom: ({ item, onOpenGrantModal }: ColumnProp) => {
    const onOpenModal = () => onOpenGrantModal(item);
    const { isRegained, score } = item;

    const tag = isRegained ? 'Đã đổi NFT' : 'Đã cập nhật điểm';
    const isDisabled = !!isRegained || score !== null;

    return (
      <Button
        theme="main"
        onClick={onOpenModal}
        disabled={isDisabled}
        disabledTag={tag}
        customTagClassName="px-2 py-1"
      >
        Cập nhật điểm
      </Button>
    );
  },
},
];

const ClassDetailTeacher = () => {
  const router = useRouter();
  const { id: qid } = router.query;
  const id = parseInt(qid as string);
  if (!id || Number.isNaN(id)) return null;

  const { role } = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const updateScores = useUpdateScores();
  const { data: classDetail } = useClassDetailApi(id);
  const {
    data: studentList = [],
    customGet,
    mutate,
  } = useNftRegistrationClassListApi({
    classId: id,
  });
  const displayClassDetail = classEntity.displayClassDetail(
    classDetail || classEntity.createLoadingState()
  );
  const [isGrantModalOpen, openGrantModal, closeGrantModal] =
    useModalController();
  const [
    selectedNftClassRegistration,
    setSelectedNftClassRegistration,
  ] = useState<NftClassRegistrationEntity | null>();

  const parseScoreFile = (
    studentListByMemberCode: Record<
      string,
      NftClassRegistrationEntity
    >,
    scores: {
      id: string;
      score: string;
    }[]
  ) => {
    let _scores: NftClassRegistrationEntity[] = [];
    const alreadyHasScores: NftClassRegistrationEntity[] = [];

    scores.every(({ id, score }) => {
      const isValid = score && id && !!studentListByMemberCode[id];
      if (studentListByMemberCode[id].score) {
        alreadyHasScores.push(studentListByMemberCode[id]);
      }

      if (isValid) {
        _scores.push({
          ...studentListByMemberCode[id],
          score: parseInt(score),
        });
      }
      return isValid;
    });

    if (alreadyHasScores.length > 0) {
      return {
        error: `Một số sinh viên đã được nhập điểm (${alreadyHasScores
          .map(({ student: { memberCode } }) => memberCode)
          .join(', ')})`,
      };
    }

    if (_scores.length !== scores.length || _scores.length === 0) {
      return {
        error:
          'File không hợp lệ hoặc sinh viên không tồn tại. Kiểm tra lại định dạng và danh sách sinh viên',
      };
    }

    return { data: _scores };
  };

  const onUploadScoreFile = (
    scores: {
      id: string;
      score: string;
    }[]
  ) => {
    const studentListByMemberCode = studentList.reduce(
      (prev, curr) => ({
        ...prev,
        [curr.student.memberCode]: curr,
      }),
      {}
    );
    const { data: scoreFile, error } = parseScoreFile(
      studentListByMemberCode,
      scores
    );
    if (error) {
      toast.error(error);
      return;
    }
    const caller = () => {
      updateScores(scoreFile, {
        onSuccess: async () => {
          const res = await customGet({
            classId: id,
          });
          mutate(res);
        },
      });
    };
    dispatch(
      openConfirmModal({
        type: 'info',
        header: 'Xác nhận',
        content: (
          <div>
            <p className="mb-[20px]">
              Xác nhận nhập điểm cho những sinh viên sau:
            </p>
            <Table headers={tableHeaders} data={scoreFile} />
          </div>
        ),
        onAccept: caller,
      })
    );
  };

  const handleUploadScoreFile = useUploadCSV(onUploadScoreFile, [
    studentList,
  ]);

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

  const handleRefreshStudents = async () => {
    const res = await customGet({
      classId: id,
    });
    mutate(res);
  };

  const links = [
    {
      label: 'Trang cá nhân',
      route: ROUTES.profile,
    },
    {
      label: `Lớp #${id}`,
    },
  ];

  return (
    <BaseLayout containerClassName="max-w-[640px]">
      <Breadcrumb links={links} />
      <Box autoLayout>
        <Heading>Class #{classDetail?.onChainId}</Heading>
        {classDetail && (
          <FormClassDetail formState={displayClassDetail} edit />
        )}
      </Box>

      <Box autoLayout>
        <Table
          title={`Danh sách sinh viên`}
          data={studentList}
          headers={tableHeaders}
          customProps={{ onOpenGrantModal }}
          subheader={
            <div>
              <InputFileButton
                id="csv"
                label="Tải điểm lên (csv)"
                onChange={handleUploadScoreFile}
                type="file"
                className="inline-block cursor-pointer"
                accept=".csv"
              />
              <p className="mt-[12px]">
                <i>
                  * Chú ý: File điểm phải ở dạng <b>csv</b> có 3 cột{' '}
                  <b>(MSSV, Điểm số)</b> với tiêu đề <b>(id,score)</b>
                </i>
              </p>
            </div>
          }
        />
      </Box>

      <UpdateScoreModal
        isOpen={isGrantModalOpen}
        onClose={onCloseGrantModal}
        nftClassRegistration={selectedNftClassRegistration}
        onRefreshStudents={handleRefreshStudents}
      />
    </BaseLayout>
  );
};

export default ClassDetailTeacher;
