import { useState } from 'react';

import CONST from '@config/constants.json';
import ROUTES from '@config/routes.json';
import { formatDate } from 'utils';
import { useCourseList, useMemberList, useRegisterTime } from '@hooks/web3';
import { useCreateClass } from '@hooks/common';
import { useFormSubmit, useInputTextChange } from '@hooks/form';
import { Breadcrumb, Form } from '@organisms';
import { BaseLayout, FormClassDetail } from '@templates';
import { Heading } from '@atoms';

const { ROLES, UI } = CONST;

const createDefaultState = (
  { value: courseId } = { value: 0 },
  { value: teacherTokenId } = { value: 0 },
  { registerEndAt } = { registerEndAt: new Date() }
) => ({
  courseId,
  completeAt: formatDate(registerEndAt, UI.INPUT_DATE_FORMAT),
  maxSize: 0,
  teacherTokenId,
});

const CreateClass = () => {
  const {
    courseList: { data: courseList },
  } = useCourseList();
  const {
    memberList: { data: teacherList },
  } = useMemberList({ role: ROLES.TEACHER });
  const {
    registerTime: { data: registerTime },
  } = useRegisterTime();
  const courses =
    courseList?.map(({ meta: { name }, id }) => ({
      label: name,
      value: id,
    })) || [];
  const teachers =
    teacherList?.map(({ meta: { fullName }, tokenId }) => ({
      label: fullName,
      value: tokenId,
    })) || [];
  const [formState, setFormState] = useState(
    createDefaultState(courses[0], teachers[0], registerTime)
  );
  const onInputChange = useInputTextChange(setFormState);
  const createClass = useCreateClass();
  const onSubmit = useFormSubmit(() => createClass(formState), [formState]);

  const links = [
    {
      label: 'Manager',
      route: ROUTES.manage,
    },
    {
      label: 'Danh sách lớp học',
      route: ROUTES.classes,
    },
    {
      label: 'Tạo lớp học',
    },
  ];

  return (
    <BaseLayout containerClassName="max-w-[640px]">
      <Breadcrumb links={links} />
      <Form submitText="Create" onSubmit={onSubmit}>
        <Heading>
          Tạo lớp học - Thời gian đăng ký:{' '}
          {formatDate(registerTime?.registerStartAt)} -{' '}
          {formatDate(registerTime?.registerEndAt)}
        </Heading>

        <FormClassDetail
          formState={formState}
          onInputChange={onInputChange}
          courses={courses}
          teachers={teachers}
        />
      </Form>
    </BaseLayout>
  );
};

export default CreateClass;
