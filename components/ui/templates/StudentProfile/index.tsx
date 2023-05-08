import _ from 'lodash';

import { Class } from '@_types/school';
import CONST from '@config/constants.json';
import { useRegisteredClasses } from '@hooks/web3';
import { Box } from '@molecules';
import { Table } from '@organisms';
import { Heading } from '@atoms';

type ClassColumnProps = {
  item: Class;
};

const { KNOWLEDGE_BLOCKS, ROLES } = CONST;
const KNOWLEDGE_BLOCK_BY_IDS = _.keyBy(KNOWLEDGE_BLOCKS, 'id');

const classTableHeaders = [
  {
    field: 'id',
    name: 'Mã lớp học',
  },
  {
    field: 'meta.course.name',
    name: 'Tên môn học',
  },
  {
    field: 'knowledgeBlockId',
    name: 'Khối kiến thức',
    custom: ({ item }: ClassColumnProps) => (
      <p>{KNOWLEDGE_BLOCK_BY_IDS[item.knowledgeBlockId].name}</p>
    ),
  },
  {
    field: 'credits',
    name: 'Số tín chỉ',
    custom: ({ item }: ClassColumnProps) => <p>{item.credits}</p>,
  },
  {
    field: 'maxSize',
    name: 'Số sinh viên tối đa',
  },
  {
    field: 'meta.teacher.name',
    name: 'Giảng viên',
  },
];
export const StudentProfile = () => {
  const {
    registeredClasses: { data: registeredClasses },
  } = useRegisteredClasses();
  const displayData =
    registeredClasses?.map(({ meta }) => meta.classInfo) || [];

  return (
    <Box className="px-8 py-6" autoLayout>
      <Heading>Môn học đã đăng ký</Heading>
      <Table headers={classTableHeaders} data={displayData} />
    </Box>
  );
};
