import _ from 'lodash';

import { Class } from '@_types/school';
import ROUTES from '@config/routes.json';
import CONST from '@config/constants.json';
import { useAssignedClasses } from '@hooks/web3';
import { Box } from '@molecules';
import { Table } from '@organisms';
import { Heading, Link } from '@atoms';
import { useAppSelector } from '@hooks/stores';
import { selectCurrentNftIdentity } from '@store/userSlice';
import { formatDate } from 'utils';
import { useAssignedClassesApi } from '@hooks/api/classes';
import { ClassEntity } from '@_types/models/entities';

type ClassColumnProps = {
  item: ClassEntity;
};

const { KNOWLEDGE_BLOCKS, DATE_TIME } = CONST;
const KNOWLEDGE_BLOCK_BY_IDS = _.keyBy(KNOWLEDGE_BLOCKS, 'id');

const ActionColumn = ({ item }: ClassColumnProps) => {
  return (
    <div>
      <Link
        href={ROUTES.classDetail.name.replace(/:id/, item.onChainId.toString())}
        className="bg-indigo-900 px-2 py-1 text-white rounded-[4px] hover:opacity-80 min-w-[96px]"
      >
        Chi tiết
      </Link>
    </div>
  );
};

const classTableHeaders = [
  {
    field: 'onChainId',
    name: 'Mã lớp học',
  },
  {
    field: 'course.name',
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
  },
  {
    field: 'maxSize',
    name: 'Số sinh viên tối đa',
  },
  {
    field: 'numberOfStudents',
    name: 'Số sinh viên',
  },
  {
    name: 'Ngày bắt đầu môn học',
    custom: ({ item }: ClassColumnProps) => (
      <p>{formatDate(item.startAt, DATE_TIME.DATETIME)}</p>
    ),
  },
  {
    name: 'Ngày kết thúc môn học',
    custom: ({ item }: ClassColumnProps) => (
      <p>{formatDate(item.completeAt, DATE_TIME.DATETIME)}</p>
    ),
  },
  {
    name: 'Hành động',
    custom: ActionColumn,
  },
];
export const TeacherProfile = () => {
  const { tokenId } = useAppSelector(selectCurrentNftIdentity);
  const { data: assignedClasses = [] } = useAssignedClassesApi({ tokenId });

  return (
    <Box className="px-8 py-6" autoLayout>
      <Heading>Lớp học được phân công</Heading>
      <Table headers={classTableHeaders} data={assignedClasses} />
    </Box>
  );
};
