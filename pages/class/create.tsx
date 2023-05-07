import { useState } from 'react';

import CONST from '@config/constants.json';
import ROUTES from '@config/routes.json';
import { useCreateCourse } from '@hooks/common';
import { useFormSubmit, useInputTextChange } from '@hooks/form';
import { InputField, SelectField } from '@molecules';
import { Breadcrumb, Form } from '@organisms';
import { BaseLayout, CourseDetail } from '@templates';
import { Heading } from '@atoms';
import { useCourseList } from '@hooks/web3';

const { KNOWLEDGE_BLOCKS } = CONST;

const unsetCourse = {
  label: 'No compulsory previous course',
  value: '0',
};

const createDefaultState = () => ({
  name: '',
  credits: 0,
  prevCourseId: 0,
  knowledgeBlockId: KNOWLEDGE_BLOCKS.GENERAL.id,
});

const CreateCourse = () => {
  const {
    courseList: { data },
  } = useCourseList();
  const courses = [
    unsetCourse,
    ...data?.map(({ meta: { name }, id }) => ({ label: name, value: id })),
  ];
  const knowledgeBlocks = Object.values(KNOWLEDGE_BLOCKS).map(
    ({ id, name }) => ({ value: id, label: name })
  );
  const [formState, setFormState] = useState(createDefaultState());
  const onInputChange = useInputTextChange(setFormState);
  const createCourse = useCreateCourse();
  const onSubmit = useFormSubmit(() => createCourse(formState), [formState]);

  const links = [
    {
      label: 'Manager',
      route: ROUTES.manage,
    },
    {
      label: 'Create Course',
    },
  ];

  return (
    <BaseLayout containerClassName="max-w-[640px]">
      <Breadcrumb links={links} />
      <Form submitText="Create" onSubmit={onSubmit}>
        <Heading>Create Class</Heading>
        <CourseDetail
          formState={formState}
          onInputChange={onInputChange}
          courses={courses}
          knowledgeBlocks={knowledgeBlocks}
        />
      </Form>
    </BaseLayout>
  );
};

export default CreateCourse;
