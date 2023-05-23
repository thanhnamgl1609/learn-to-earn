import { useState } from 'react';

import { CourseEntity } from '@_types/models/entities';
import CONST from '@config/constants.json';
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
import { useCourseList } from '@hooks/web3';
import { useInputCheckChange } from '@hooks/form/useInputCheckChange';
import { useCourseListApi } from '@hooks/api';

const { KNOWLEDGE_BLOCKS } = CONST;

const unsetCourse = {
  label: 'Không có môn tiên quyết',
  value: '0',
};

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

const CreateCourse = () => {
  const { data: courseList } = useCourseListApi();
  const courses = useSelectOptions(courseList, {
    labelField: 'name',
    valueField: 'onChainId',
    noSelectLabel: 'Chọn môn học',
  });
  const knowledgeBlocks = Object.values(KNOWLEDGE_BLOCKS).map(
    ({ id, name }) => ({ value: id, label: name })
  );
  const [formState, setFormState] = useState(createDefaultCourse());
  const onInputChange = useInputTextChange(setFormState);
  const onInputCheckChange = useInputCheckChange(setFormState);
  const createCourse = useCreateCourse();
  const onSubmit = useFormSubmit(() => createCourse(formState), [formState]);

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
          knowledgeBlocks={knowledgeBlocks}
        />
      </Form>
    </BaseLayout>
  );
};

export default CreateCourse;
