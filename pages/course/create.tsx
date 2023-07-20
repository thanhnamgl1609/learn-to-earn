import { useState } from 'react';

import { CourseForm } from '@_types/school';
import ROUTES from '@config/routes.json';
import { useCreateCourse } from '@hooks/common';
import {
  useFormSubmit,
  useInputTextChange,
  useSelectOptions,
} from '@hooks/form';
import { Breadcrumb, Form } from '@organisms';
import { BaseLayout, CourseDetail } from '@templates';
import { Heading } from '@atoms';
import { useInputCheckChange } from '@hooks/form/useInputCheckChange';
import { useCourseListApi } from '@hooks/api';
import { useKnowledgeBlockListApi } from '@hooks/api/knowledge-blocks';

const createDefaultCourse = (): CourseForm => ({
  prevCourseId: '0',
  courseCode: '',
  knowledgeBlockId: 1,
  name: '',
  credits: 4,
  description: '',
  isRequired: false,
  theoryLessons: 40,
  practiceLessons: 0,
  exerciseLessons: 0,
  chainURI: '',
});

const CreateCourse = () => {
  const { data: courseList } = useCourseListApi();
  const courses = useSelectOptions(courseList, {
    labelField: 'name',
    valueField: 'onChainId',
    noSelectLabel: 'Chọn môn học',
  });
  const { data: knowledgeBlocks } = useKnowledgeBlockListApi();
  const knowledgeBlockOptions = useSelectOptions(knowledgeBlocks, {
    noSelectLabel: 'Tất cả khối kiến thức',
    labelField: 'name',
    valueField: 'id',
  });
  const [formState, setFormState] = useState(createDefaultCourse());
  const onInputChange = useInputTextChange(setFormState);
  const onInputCheckChange = useInputCheckChange(setFormState);
  const createCourse = useCreateCourse();
  const onSubmit = useFormSubmit(
    () => createCourse(formState),
    [formState]
  );

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
      <Form submitText="Create" onSubmit={onSubmit}>
        <Heading>Create Course</Heading>
        <CourseDetail
          formState={formState}
          onInputChange={onInputChange}
          onInputCheckChange={onInputCheckChange}
          courses={courses}
          knowledgeBlocks={knowledgeBlockOptions}
        />
      </Form>
    </BaseLayout>
  );
};

export default CreateCourse;
