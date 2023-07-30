import { useRouter } from 'next/router';

import ROUTES from '@config/routes.json';
import { BaseLayout, FormClassDetail } from '@templates';
import { Breadcrumb, Table } from '@organisms';
import { Box } from '@molecules';
import { Heading, LinkText } from '@atoms';
import {
  useClassDetailApi,
  useNftRegistrationClassListApi,
} from '@hooks/api/classes';
import { NftClassRegistrationEntity } from '@_types/models/entities';
import { classEntity } from 'domain/models';

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
    field: 'student.fullName',
    name: 'Họ và tên',
  },
];

const ClassDetailCouncil = () => {
  const router = useRouter();
  const { id: qid } = router.query;
  const id = parseInt(qid as string);
  if (!id || Number.isNaN(id)) return null;

  const { data: classDetail } = useClassDetailApi(id);
  const { data: studentList = [] } = useNftRegistrationClassListApi({
    classId: id,
  });
  const displayClassDetail = classEntity.displayClassDetail(
    classDetail || classEntity.createLoadingState()
  );

  const links = [
    {
      label: 'Dashboard',
      route: ROUTES.manage,
    },
    {
      label: 'Danh sách lớp học',
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
        />
      </Box>
    </BaseLayout>
  );
};

export default ClassDetailCouncil;
