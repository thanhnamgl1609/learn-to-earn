import _ from 'lodash';

import ROUTES from '@config/routes.json';
import CONST from '@config/constants.json';
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
    textCenter: true,
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
    hideOnTablet: true,
  },
  {
    field: 'credits',
    name: 'Số tín chỉ',
    textCenter: true,
  },
  {
    field: 'maxSize',
    name: 'Số sinh viên tối đa',
    hideOnTablet: true,
    textCenter: true,
  },
  {
    field: 'numberOfStudents',
    name: 'Số sinh viên',
    hideOnTablet: true,
    textCenter: true,
  },
  {
    name: 'Ngày bắt đầu môn học',
    custom: ({ item }: ClassColumnProps) => (
      <p>{formatDate(item.startAt, DATE_TIME.DATETIME)}</p>
    ),
    hideOnTablet: true,
    textCenter: true,
  },
  {
    name: 'Ngày kết thúc môn học',
    custom: ({ item }: ClassColumnProps) => (
      <p>{formatDate(item.completeAt, DATE_TIME.DATETIME)}</p>
    ),
    hideOnTablet: true,
    textCenter: true,
  },
  {
    name: 'Hành động',
    custom: ActionColumn,
  },
];
export const TeacherProfile = () => {
  const { tokenId } = useAppSelector(selectCurrentNftIdentity);
  const { data: assignedClasses = [] } = useAssignedClassesApi({ teacherTokenId: tokenId });

  return (
    <Box className="px-8 py-6" autoLayout>
      <Heading>Lớp học được phân công</Heading>
      <Table headers={classTableHeaders} data={assignedClasses} />
    </Box>
  );
};
