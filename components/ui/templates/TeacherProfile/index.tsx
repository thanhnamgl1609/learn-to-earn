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
import { formatDate, parseDate, sameOrAfter, sameOrBefore } from 'utils';

type ClassColumnProps = {
  item: Class;
};

const { KNOWLEDGE_BLOCKS, DATE_TIME } = CONST;
const KNOWLEDGE_BLOCK_BY_IDS = _.keyBy(KNOWLEDGE_BLOCKS, 'id');

const ActionColumn = ({ item }: ClassColumnProps) => {
  return (
    <div>
      <Link
        href={ROUTES.schoolClassDetail.name.replace(/:id/, item.id.toString())}
        className="bg-indigo-900 px-2 py-1 text-white rounded-[4px] hover:opacity-80"
      >
        Chi tiết
      </Link>
    </div>
  );
};

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
    field: 'numberOfStudents',
    name: 'Số sinh viên đã đăng ký',
  },
  {
    field: 'completeAt',
    name: 'Ngày kết thúc',
  },
  {
    field: 'isCompleteText',
    name: 'Tình trạng',
  },
  {
    name: 'Hành động',
    custom: ActionColumn,
  },
];
export const TeacherProfile = () => {
  const { tokenId } = useAppSelector(selectCurrentNftIdentity);
  const {
    assignedClasses: { data: assignedClasses },
  } = useAssignedClasses({ tokenId });

  const displayAssignedClass =
    assignedClasses?.map(({ completeAt, ...otherInfo }) => ({
      completeAt: formatDate(completeAt, DATE_TIME.DATETIME),
      isCompleteText: sameOrAfter(completeAt) ? 'Đang dạy' : 'Đã hoàn tất',
      ...otherInfo,
    })) || [];

  return (
    <Box className="px-8 py-6" autoLayout>
      <Heading>Lớp học được phân công</Heading>
      <Table headers={classTableHeaders} data={displayAssignedClass} />
    </Box>
  );
};
