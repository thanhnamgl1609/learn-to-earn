import { useRouter } from 'next/router';

import CONST from '@config/constants.json';
import ROUTES from '@config/routes.json';
import { useCourseDetail } from '@hooks/web3';
import { BaseLayout, CourseDetail } from '@templates';
import { Breadcrumb } from '@organisms';
import { Box } from '@molecules';
import { Heading } from '@atoms';

const { KNOWLEDGE_BLOCKS } = CONST;

const createDefaultCourse = () => ({
  id: 0,
  prevCourse: {
    meta: { name: '' },
  },
  prevCourseId: 0,
  knowledgeBlockId: 1,
  name: '',
  credits: 0,
});

const CourseDetailPage = () => {
  const router = useRouter();
  const { id: qid } = router.query;
  const id = parseInt(qid as string);
  if (!id || Number.isNaN(id)) return null;

  const {
    courseDetail: { data, isLoading },
  } = useCourseDetail({ id });
  const defaultData = isLoading
    ? createDefaultCourse()
    : { ...data, ...data?.meta };
  const { prevCourse, prevCourseId, knowledgeBlockId } = defaultData;
  const knowledgeBlock = Object.values(KNOWLEDGE_BLOCKS).find(
    ({ id }) => id === knowledgeBlockId
  );
  const courses = [
    {
      label:
        prevCourseId > 0 && !isLoading
          ? prevCourse?.meta?.name || 'error'
          : 'None',
      value: prevCourseId || 0,
    },
  ];
  const knowledgeBlocks = [
    {
      label: knowledgeBlock?.name || 'error',
      value: knowledgeBlock?.id || 0,
    },
  ];

  const links = [
    {
      label: 'Trang chủ',
      route: ROUTES.manage,
    },
    {
      label: 'Danh sách môn học',
      route: ROUTES.courses,
    },
    {
      label: 'Tạo môn học',
    },
  ];

  return (
    <BaseLayout containerClassName="max-w-[640px]">
      <Breadcrumb links={links} />
      <Box autoLayout>
        <Heading>Course #{defaultData.id}</Heading>
        <CourseDetail
          formState={defaultData}
          courses={courses}
          knowledgeBlocks={knowledgeBlocks}
          disabled
        />
      </Box>
    </BaseLayout>
  );
};

export default CourseDetailPage;
