import { useRouter } from 'next/router';

import { NftIdentity } from '@_types/nftIdentity';
import ROUTES from '@config/routes.json';
import { useClassDetail } from '@hooks/web3';
import { useAppDispatch } from '@hooks/stores';
import { useGrantNftIdentity } from '@hooks/common';
import { BaseLayout, ClassDetail } from '@templates';
import { Breadcrumb, Table } from '@organisms';
import { Box } from '@molecules';
import { Button, Heading } from '@atoms';
import { openConfirmModal } from '@store/appSlice';

type IdentityColumnProps = {
  item: Omit<NftIdentity, 'tokenId'> & { id: number };
};

const ActionColumns = ({ item }: IdentityColumnProps) => {
  const dispatch = useAppDispatch();
  const grantNftIdentity = useGrantNftIdentity();
  const { id, ...pNftIdentity } = item;

  const onRegisterClick = () => {
    dispatch(
      openConfirmModal({
        content: `Cấp chứng chỉ cho sinh viên ${item.meta.fullName} - #${id}`,
        onAccept: () =>
          grantNftIdentity({
            tokenId: id,
            ...pNftIdentity,
          }),
      })
    );
  };

  return (
    <div>
      <Button
        onClick={onRegisterClick}
        className="bg-indigo-900 px-2 py-1 text-white rounded-[4px] hover:opacity-80"
      >
        Cấp chứng chỉ
      </Button>
    </div>
  );
};

const tableHeaders = [
  {
    field: 'id',
    name: 'Token ID',
  },
  {
    field: 'meta.fullName',
    name: 'Họ và tên',
  },
  {
    name: 'Action',
    custom: ActionColumns,
  },
];

const SchoolClassDetail = () => {
  const router = useRouter();
  const { id: qid } = router.query;
  const id = parseInt(qid as string);
  if (!id || Number.isNaN(id)) return null;

  const {
    classDetail: { data: classDetail, studentList },
  } = useClassDetail({ id, withStudentList: true });

  const displayStudentList = studentList?.map(({ tokenId, ...otherInfo }) => ({
    id: tokenId,
    ...otherInfo,
  }));

  const links = [
    {
      label: 'Profile',
      route: ROUTES.profile,
    },
    {
      label: `Lớp #${id}`,
    },
  ];

  return (
    <BaseLayout>
      <Breadcrumb links={links} />
      <Box autoLayout>
        <Heading>Class #{classDetail?.id}</Heading>
        {classDetail && <ClassDetail classDetail={classDetail} />}
      </Box>

      <Box autoLayout>
        <Table
          title={`Danh sách sinh viên`}
          data={displayStudentList}
          headers={tableHeaders}
        />
      </Box>
    </BaseLayout>
  );
};

export default SchoolClassDetail;
