import { FC, memo, useState } from 'react';
import { connect } from 'react-redux';

import { Semester } from '@_types/api/semester';
import { NftClassRegistration } from '@_types/school';
import CONST from 'config/constants.json';
import { useFormSubmit, useInputTextChange } from '@hooks/form';
import { Modal } from '..';
import { Box, InputField } from '@molecules';
import { Heading } from '@atoms';
import { formatDate } from 'utils';

type Props = {
  semester: Semester | null;
  isOpen: boolean;
  onClose: () => void;
};

const {
  UI: { INPUT_DATE_FORMAT },
} = CONST;

export const SemesterDetailModal: FC<Props> = memo(
  ({ semester, isOpen, onClose }) => {
    if (!semester) return null;

    return (
      <Modal
        className="w-[400px] bg-white overflow-auto rounded"
        isOpen={isOpen}
        onClose={onClose}
      >
        <Heading className="px-6 pt-4">
          Học kì {semester.semester} (năm {semester.startYear} -{' '}
          {semester.endYear})
        </Heading>

        <Box autoLayout>
          <InputField label="Mã học kì" value={semester.id} readOnly />
          <InputField
            label="Ngày bắt đầu học kì"
            value={formatDate(semester.startAt, INPUT_DATE_FORMAT)}
            type="date"
            readOnly
          />
          <InputField
            label="Ngày kết thúc học kì"
            value={formatDate(semester.endAt, INPUT_DATE_FORMAT)}
            type="date"
            readOnly
          />
        </Box>
      </Modal>
    );
  }
);
