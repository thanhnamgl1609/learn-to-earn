import { useRouter } from 'next/router';

import CONST from '@config/constants.json';
import ROUTES from '@config/routes.json';
import { useClassDetail } from '@hooks/web3';
import { BaseLayout, ClassDetail } from '@templates';
import { Breadcrumb, Table } from '@organisms';
import { Box } from '@molecules';
import { Heading } from '@atoms';

const tableHeaders = [
  {
    field: 'id',
    name: 'Token ID',
  },
  {
    field: 'meta.fullName',
    name: 'Họ và tên',
  },
];

const ClassDetailPage = () => {
  const router = useRouter();
  const { id: qid } = router.query;
  const id = parseInt(qid as string);
  if (!id || Number.isNaN(id)) return null;

  const {
    classDetail: { data: classDetail, studentList },
  } = useClassDetail({ id, withStudentList: true });

  const displayStudentList =
    studentList?.map(({ tokenId, ...otherInfo }) => ({
      id: tokenId,
      ...otherInfo,
    })) || [];

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

  return (
    <BaseLayout containerClassName="max-w-[640px]">
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

export default ClassDetailPage;
