import ROUTES from 'config/routes.json';
import { Heading, LinkBox } from '@atoms';
import { Table } from '@organisms';
import { RequestGraduationEntity } from '@_types/models/entities';
import { BaseLayout } from '@templates';
import { Box } from '@molecules';
import { useRequestGraduationList } from '@hooks/api';

type ColumnProps = {
  item: RequestGraduationEntity;
};

const requestGraduationHeader = [
  {
    field: 'student.tokenId',
    name: 'Token ID',
  },
  {
    field: 'student.memberCode',
    name: 'MSSV',
  },
  {
    field: 'student.fullName',
    name: 'Tên sinh viên',
  },
  {
    name: 'Hành động',
    custom: ({ item }: ColumnProps) => (
      <LinkBox
        theme="main"
        href={ROUTES.requestGraduationDetail.name.replace(
          /:id/,
          item.studentTokenId.toString()
        )}
      >
        Xem chi tiết
      </LinkBox>
    ),
  },
];

const RequestGraduationList = () => {
  const { data: requestGraduations = [] } = useRequestGraduationList();

  return (
    <BaseLayout>
      <Heading>Danh sách sinh viên yêu cầu tốt nghiệp</Heading>

      <Box autoLayout>
        <Table
          data={requestGraduations}
          headers={requestGraduationHeader}
          autoOrderId
        />
      </Box>
    </BaseLayout>
  );
};

export default RequestGraduationList;
