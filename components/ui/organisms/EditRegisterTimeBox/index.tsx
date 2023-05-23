import { memo, useState, FC } from 'react';

import CONST from 'config/constants.json';
import { SemesterDetail } from '@_types/api/semester';
import { useFormSubmit, useInputTextChange } from '@hooks/form';
import { useEditRegisterTime } from '@hooks/common';
import { InputField } from '@molecules';
import Form from '../Form';
import { formatDate } from 'utils';
import { Button, Heading } from '@atoms';
import { SemesterEntity } from '@_types/models/entities';

type Props = {
  semester: SemesterEntity;
  openSemesterDetail: (semester: SemesterEntity) => () => void;
};

const {
  UI: { INPUT_DATETIME_FORMAT },
} = CONST;

const EditRegisterTimeBox: FC<Props> = ({ semester, openSemesterDetail }) => {
  const [formState, setFormState] = useState({
    registerStartAt: formatDate(
      semester?.registerStartAt ?? new Date(),
      INPUT_DATETIME_FORMAT
    ),
    registerEndAt: formatDate(
      semester?.registerEndAt ?? new Date(),
      INPUT_DATETIME_FORMAT
    ),
  });
  const editRegisterTime = useEditRegisterTime();
  const onSubmit = useFormSubmit(
    () => editRegisterTime(formState, semester),
    [formState, semester]
  );
  const onInputChange = useInputTextChange(setFormState);

  return (
    <Form onSubmit={onSubmit} submitText="Chỉnh sửa" disabled={semester.isPast}>
      <Heading className="flex justify-between items-center">
        <div>
          Thời gian đăng ký học phần
          <p>
            Học kì: {semester?.semester ?? ''} - Năm học{' '}
            {`${semester?.startYear ?? ''} - ${semester?.endYear ?? ''}`}
          </p>
        </div>

        <Button
          onClick={openSemesterDetail(semester)}
          theme="sub"
          size="S"
          type="button"
        >
          Chi tiết
        </Button>
      </Heading>
      <InputField
        type="datetime-local"
        label="Ngày bắt đầu"
        name="registerStartAt"
        value={formState.registerStartAt}
        onChange={onInputChange}
      />
      <InputField
        type="datetime-local"
        label="Ngày kết thúc"
        name="registerEndAt"
        value={formState.registerEndAt}
        onChange={onInputChange}
      />
    </Form>
  );
};

export default memo(EditRegisterTimeBox);
