import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { CourseEntity } from '@_types/models/entities';
import CONST from '@config/constants.json';
import ROUTES from '@config/routes.json';
import { useInputTextChange, useSelectOptions } from '@hooks/form';
import { useCourseDetailApi, useCourseListApi } from '@hooks/api';
import { useKnowledgeBlocks } from '@hooks/common';
import { BaseLayout, CourseDetail } from '@templates';
import { Breadcrumb } from '@organisms';
import { Box } from '@molecules';
import { Heading } from '@atoms';

const createDefaultCourse = (): Partial<CourseEntity> => ({
  prevCourseId: 0,
  courseCode: '',
  knowledgeBlockId: 1,
  name: '',
  credits: 4,
  description: '',
  isRequired: false,
  theoryLessons: 40,
  practiceLessons: 0,
  exerciseLessons: 0,
});

const CourseDetailPage = () => {
  const router = useRouter();
  const { id: qid } = router.query;
  const id = parseInt(qid as string);
  if (!id || Number.isNaN(id)) return null;

  const { data: courses } = useCourseListApi();
  const { knowledgeBlockOptions } = useKnowledgeBlocks();
  const courseOptions = useSelectOptions(courses, {
    noSelectLabel: 'Không có môn tiên quyết',
  });

  const [formData, setFormData] = useState(createDefaultCourse());
  const { data } = useCourseDetailApi(id);
  const onInputChange = useInputTextChange(setFormData);

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

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  return (
    <BaseLayout containerClassName="max-w-[640px]">
      <Breadcrumb links={links} />
      <Box autoLayout>
        <Heading>Course #{formData.id}</Heading>
        <CourseDetail
          formState={formData}
          courses={courseOptions}
          knowledgeBlocks={knowledgeBlockOptions}
          onInputChange={onInputChange}
          edit
        />
      </Box>
    </BaseLayout>
  );
};

export default CourseDetailPage;
