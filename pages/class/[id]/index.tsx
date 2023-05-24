import { useRouter } from 'next/router';

import CONST from '@config/constants.json';
import ROUTES from '@config/routes.json';
import { BaseLayout, ClassDetail, FormClassDetail } from '@templates';
import { Breadcrumb, Table } from '@organisms';
import { Box } from '@molecules';
import { Heading } from '@atoms';
import { useClassDetailApi, useClassListApi } from '@hooks/api/classes';
import { formatDate } from 'utils';
import { classEntity, courseEntity } from 'domain/models';

const { UI } = CONST;

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

  const { data: classDetail } = useClassDetailApi(id);
  const displayClassDetail = classEntity.displayClassDetail(
    classDetail || classEntity.createLoadingState()
  );

  // const displayStudentList =
  //   studentList?.map(({ tokenId, ...otherInfo }) => ({
  //     id: tokenId,
  //     ...otherInfo,
  //   })) || [];

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
        {classDetail && <FormClassDetail formState={displayClassDetail} edit />}
      </Box>

      <Box autoLayout>
        {/* <Table
          title={`Danh sách sinh viên`}
          data={displayStudentList}
          headers={tableHeaders}
        /> */}
      </Box>
    </BaseLayout>
  );
};

export default ClassDetailPage;
