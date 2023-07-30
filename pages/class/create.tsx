import { useEffect, useState } from 'react';

import CONST from '@config/constants.json';
import ROUTES from '@config/routes.json';
import { formatDate, dateAdd } from 'utils';
import { useCreateClass } from '@hooks/common';
import {
  useFormSubmit,
  useInputTextChange,
  useSelectOptions,
} from '@hooks/form';
import {
  useCourseListApi,
  useCurrentYear,
  useUserListApi,
} from '@hooks/api';
import { Breadcrumb, Form } from '@organisms';
import { BaseLayout, FormClassDetail } from '@templates';
import { Heading } from '@atoms';
import { semesterEntity } from 'domain/models';

const { ROLES, UI } = CONST;

const createDefaultState = () => ({
  courseId: 0,
  startAt: formatDate(
    dateAdd(new Date(), 5, 'd'),
    UI.INPUT_DATE_FORMAT
  ),
  completeAt: formatDate(
    dateAdd(new Date(), 35, 'd'),
    UI.INPUT_DATE_FORMAT
  ),
  maxSize: 40,
  semesterId: 1,
  teacherTokenId: 0,
  registerClassFee: '0.5',
});

const CreateClass = () => {
  const { data: courseList } = useCourseListApi();
  const { data: teacherList } = useUserListApi({
    role: ROLES.TEACHER,
  });
  const { data: semesters } = useCurrentYear();
  const semesterOptions = useSelectOptions(semesters, {
    valueField: 'id',
    customLabel: (item) => semesterEntity.displaySemester(item),
  });
  const courses = useSelectOptions(courseList, {
    labelField: 'name',
    valueField: 'onChainId',
    noSelectLabel: 'Chọn môn học',
  });
  const teachers = useSelectOptions(teacherList, {
    labelField: 'fullName',
    valueField: 'tokenId',
    noSelectLabel: 'Chọn giảng viên',
  });
  const [formState, setFormState] = useState(createDefaultState());
  // filter expired
  const onInputChange = useInputTextChange(setFormState);
  const createClass = useCreateClass();
  const onSubmit = useFormSubmit(
    () => createClass(formState, courseList, teacherList, semesters),
    [formState, courseList, teacherList, semesters]
  );

  const links = [
    {
      label: 'Dashboard',
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
      <Form submitText="Tạo" onSubmit={onSubmit}>
        <Heading>Tạo lớp học</Heading>

        <FormClassDetail
          formState={formState}
          semesterOptions={semesterOptions}
          onInputChange={onInputChange}
          courses={courses}
          teachers={teachers}
        />
      </Form>
    </BaseLayout>
  );
};

export default CreateClass;
