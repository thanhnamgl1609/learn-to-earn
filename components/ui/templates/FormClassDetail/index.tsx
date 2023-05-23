import { ChangeEvent, FC } from 'react';

import { InputField, SelectField } from '@molecules';

type SelectOption = {
  label: string;
  value: number | string;
};
type ClassDetailProps = {
  formState: {
    courseId: number | string;
    startAt: string;
    completeAt: string;
    maxSize: number | string;
    teacherTokenId: number | string;
    semesterId: number | string;
    size?: number | string;
  };
  onInputChange?: (e: ChangeEvent) => void;
  courses: SelectOption[];
  teachers: SelectOption[];
  semesterOptions: SelectOption[];
  edit?: boolean;
};

export const FormClassDetail: FC<ClassDetailProps> = ({
  formState,
  semesterOptions,
  onInputChange,
  courses,
  teachers,
  edit = false,
}) => (
  <>
    <SelectField
      label="Môn học"
      name="courseId"
      options={courses}
      onChange={onInputChange}
      value={formState.courseId}
      disabled={edit}
    />
    <SelectField
      label="Giảng viên"
      name="teacherTokenId"
      options={teachers}
      onChange={onInputChange}
      value={formState.teacherTokenId}
      disabled={edit}
    />
    <InputField
      label="Ngày bắt đầu"
      name="startAt"
      onChange={onInputChange}
      type="date"
      value={formState.startAt}
      readOnly={edit}
    />
    <InputField
      label="Ngày kết thúc"
      name="completeAt"
      onChange={onInputChange}
      type="date"
      value={formState.completeAt}
      readOnly={edit}
    />
    <InputField
      label="Số lượng sinh viên tối đa"
      name="maxSize"
      value={formState.maxSize}
      onChange={onInputChange}
      disabled={edit}
    />
    <SelectField
      label="Học kỳ"
      name="semesterId"
      options={semesterOptions}
      value={formState.semesterId}
      onChange={onInputChange}
      disabled={edit}
    />
    {formState.size && (
      <InputField
        label="Số lương sinh viên đã đăng ký"
        name="size"
        value={formState.size}
        onChange={onInputChange}
        disabled
      />
    )}
  </>
);
