import { ChangeEvent, FC } from 'react';

import { InputField, SelectField, TextField } from '@molecules';
import { CourseForm } from '@_types/school';

type SelectOption = {
  label: string;
  value: number | string;
};
type CourseDetailProps = {
  formState: CourseForm;
  onInputChange?: (e: ChangeEvent) => void;
  onInputCheckChange?: (e: ChangeEvent) => void;
  courses: SelectOption[];
  knowledgeBlocks?: SelectOption[];
  edit?: boolean;
};

export const CourseDetail: FC<CourseDetailProps> = ({
  formState,
  onInputChange,
  onInputCheckChange,
  courses,
  knowledgeBlocks = [],
  edit = false,
}) => (
  <>
    <InputField
      label="Mã môn học"
      name="courseCode"
      onChange={onInputChange}
      type="string"
      value={formState.courseCode}
      disabled={edit}
    />
    <InputField
      label="Tên môn học"
      name="name"
      onChange={onInputChange}
      value={formState.name}
    />
    <SelectField
      label="Khối kiến thức"
      name="knowledgeBlockId"
      options={knowledgeBlocks}
      value={formState.knowledgeBlockId}
      onChange={onInputChange}
      disabled={edit}
    />
    <InputField
      label="Số tín chỉ"
      name="credits"
      onChange={onInputChange}
      type="number"
      value={formState.credits}
    />
    <SelectField
      label="Môn học tiên quyết"
      name="prevCourseId"
      options={courses}
      value={formState.prevCourseId}
      onChange={onInputChange}
    />
    <TextField
      label="Mô tả môn học"
      name="description"
      onChange={onInputChange}
      value={formState.description}
    />
    <InputField
      containerClassName="flex gap-[12px] items-center"
      type="checkbox"
      label="Bắt buộc"
      name="isRequired"
      onChange={onInputCheckChange}
      checked={formState.isRequired}
    />
    <InputField
      label="Số tiết lý thuyết"
      name="theoryLessons"
      onChange={onInputChange}
      type="number"
      value={formState.theoryLessons}
    />
    <InputField
      label="Số tiết thực hành"
      name="practiceLessons"
      onChange={onInputChange}
      type="number"
      value={formState.practiceLessons}
    />
    <InputField
      label="Số tiết bài tập"
      name="exerciseLessons"
      onChange={onInputChange}
      type="number"
      value={formState.exerciseLessons}
    />
    {edit && (
      <InputField
        label="Metadata"
        value={formState.chainURI}
        disabled
      />
    )}
  </>
);
