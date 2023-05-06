import { ChangeEvent, FC } from 'react';

import { InputField, SelectField } from '@molecules';

type SelectOption = {
  label: string;
  value: number | string;
};
type CourseDetailProps = {
  formState: {
    name: string;
    credits: number | string;
    prevCourseId: number | string;
    knowledgeBlockId: number | string;
  };
  onInputChange?: (e: ChangeEvent) => void;
  courses: SelectOption[];
  knowledgeBlocks?: SelectOption[];
  disabled?: boolean;
};

export const CourseDetail: FC<CourseDetailProps> = ({
  formState,
  onInputChange,
  courses,
  knowledgeBlocks = [],
  disabled = false,
}) => (
  <>
    <InputField
      label="Course Name"
      name="name"
      onChange={onInputChange}
      value={formState.name}
      readOnly={disabled}
    />
    <InputField
      label="Course Credits"
      name="credits"
      onChange={onInputChange}
      type="number"
      value={formState.credits}
      readOnly={disabled}
    />
    <SelectField
      label="Compulsory previous course"
      name="prevCourseId"
      options={courses}
      value={formState.prevCourseId}
      onChange={onInputChange}
      disabled={disabled}
    />
    <SelectField
      label="Knowledge Block"
      name="knowledgeBlockId"
      options={knowledgeBlocks}
      value={formState.knowledgeBlockId}
      onChange={onInputChange}
      disabled={disabled}
    />
  </>
);
