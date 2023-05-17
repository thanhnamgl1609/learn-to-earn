import _ from 'lodash';

import { Class } from '@_types/school';
import CONST from '@config/constants.json';
import { useRegisteredClasses } from '@hooks/web3';
import { Box } from '@molecules';
import { Table } from '@organisms';
import { Button, Heading } from '@atoms';
import { formatDate } from 'utils';
import { useAppDispatch } from '@hooks/stores';
import { openConfirmModal } from '@store/appSlice';

type ClassColumnProps = {
  item: Class;
};

const { KNOWLEDGE_BLOCKS, DATE_TIME } = CONST;
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
    name: 'Ngày kết thúc môn học',
    custom: ({ item }: ClassColumnProps) => (
      <p>{formatDate(item.completeAt, DATE_TIME.DATETIME)}</p>
    ),
  },
  {
    field: 'meta.teacher.name',
    name: 'Giảng viên',
  },
  {
    name: 'Hành động',
    custom: ({ item }: ClassColumnProps) => {
      const dispatch = useAppDispatch();
      const onRequestCompleteCourseCertificate = () => {
        dispatch(
          openConfirmModal({
            type: 'warning',
            header: 'Chú ý',
            content: (
              <>
                <p>Hãy chắc chắn bạn đã hoàn tất khóa học trước khi yêu cầu chứng chỉ!</p>
                <p>
                  Thao tác này sẽ thu hồi NFT đăng ký môn học và đổi thành NFT
                  hoàn tất khóa học khi giảng viên đã kiểm chứng!
                </p>
              </>
            ),
            onAccept: () => {},
          })
        );
      };

      return (
        <Button
          onClick={onRequestCompleteCourseCertificate}
          className="bg-indigo-900 px-2 py-1 text-white rounded-[4px] hover:opacity-80 w-[120px]"
        >
          Yều cầu cấp chứng chỉ
        </Button>
      );
    },
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
