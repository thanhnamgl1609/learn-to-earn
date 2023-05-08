import { ChangeEvent, FC } from 'react';

import { InputField, SelectField } from '@molecules';

type SelectOption = {
  label: string;
  value: number | string;
};
type ClassDetailProps = {
  formState: {
    courseId: number | string;
    completeAt: string;
    maxSize: number | string;
    teacherTokenId: number | string;
    size?: number | string;
  };
  onInputChange?: (e: ChangeEvent) => void;
  courses: SelectOption[];
  teachers: SelectOption[];
  disabled?: boolean;
};

export const FormClassDetail: FC<ClassDetailProps> = ({
  formState,
  onInputChange,
  courses,
  teachers,
  disabled = false,
}) => (
  <>
    <SelectField
      label="Môn học"
      name="name"
      options={courses}
      onChange={onInputChange}
      value={formState.courseId}
      disabled={disabled}
    />
    <SelectField
      label="Giảng viên"
      name="teacherTokenId"
      options={teachers}
      onChange={onInputChange}
      value={formState.teacherTokenId}
      disabled={disabled}
    />
    <InputField
      label="Ngày kết thúc"
      name="completeAt"
      onChange={onInputChange}
      type="datetime-local"
      value={formState.completeAt}
      readOnly={disabled}
    />
    <InputField
      label="Số lượng sinh viên tối đa"
      name="maxSize"
      value={formState.maxSize}
      onChange={onInputChange}
      disabled={disabled}
    />
    {formState.size && (
      <InputField
        label="Số lương sinh viên đã đăng ký"
        name="size"
        value={formState.size}
        onChange={onInputChange}
        disabled={disabled}
      />
    )}
  </>
);
