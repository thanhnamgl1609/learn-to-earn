import { ChangeEvent, FC } from 'react';

import { InputField, LinkField, SelectField } from '@molecules';
import {
  CourseEntity,
  SemesterEntity,
  UserEntity,
} from '@_types/models/entities';
import { semesterEntity } from 'domain/models';

type SelectOption = {
  label: string;
  value: number | string;
};
type ClassDetailProps = {
  formState: {
    courseId?: number | string;
    startAt: string;
    completeAt: string;
    maxSize: number | string;
    teacherTokenId: number | string;
    semesterId: number | string;
    registerClassFee: string;

    numberOfStudents?: number;
    course?: CourseEntity;
    semester?: SemesterEntity;
    teacher?: UserEntity;
  };
  onInputChange?: (e: ChangeEvent) => void;
  courses?: SelectOption[];
  teachers?: SelectOption[];
  semesterOptions?: SelectOption[];
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
    {edit ? (
      <>
        <InputField
          label="Môn học"
          value={formState.course?.name ?? ''}
          disabled={edit}
        />
        <InputField
          label="Mã môn học"
          value={formState.course?.onChainId ?? ''}
          disabled={edit}
        />
        <LinkField
          label="Thông tin môn học"
          text={formState.course?.chainURI}
          href={formState.course?.chainURI}
          target="_blank"
        />
      </>
    ) : (
      <SelectField
        label="Môn học"
        name="courseId"
        options={courses}
        onChange={onInputChange}
        value={formState.courseId ?? ''}
        disabled={edit}
      />
    )}
    {edit ? (
      <>
        <InputField
          label="Giảng viên"
          value={formState.teacher?.fullName ?? ''}
          disabled={edit}
        />
        <InputField
          label="Mã giảng viên"
          value={formState.teacher?.tokenId ?? ''}
          disabled={edit}
        />
        <LinkField
          label="Thông tin giảng viên"
          text={formState.teacher?.chainURI}
          href={formState.teacher?.chainURI}
          target="_blank"
        />
      </>
    ) : (
      <SelectField
        label="Giảng viên"
        name="teacherTokenId"
        options={teachers}
        onChange={onInputChange}
        value={formState.teacherTokenId ?? ''}
        disabled={edit}
      />
    )}
    <InputField
      label="Ngày bắt đầu"
      name="startAt"
      onChange={onInputChange}
      type="date"
      value={formState.startAt ?? ''}
      readOnly={edit}
    />
    <InputField
      label="Ngày kết thúc"
      name="completeAt"
      onChange={onInputChange}
      type="date"
      value={formState.completeAt ?? ''}
      readOnly={edit}
    />
    <InputField
      label="Số lượng sinh viên tối đa"
      name="maxSize"
      value={formState.maxSize ?? ''}
      onChange={onInputChange}
      disabled={edit}
    />
    <InputField
      label="Phí đăng ký"
      name="registerClassFee"
      value={formState.registerClassFee ?? ''}
      onChange={onInputChange}
      disabled={edit}
    />
    {edit ? (
      <InputField
        label="Học kỳ"
        value={semesterEntity.displaySemester(formState.semester) ?? ''}
        disabled={edit}
      />
    ) : (
      <SelectField
        label="Học kỳ"
        name="semesterId"
        options={semesterOptions}
        value={formState.semesterId ?? ''}
        onChange={onInputChange}
        disabled={edit}
      />
    )}
    {edit && (
      <>
        <InputField
          label="Số lương sinh viên đã đăng ký"
          value={formState.numberOfStudents ?? 0}
          disabled
        />
      </>
    )}
  </>
);
