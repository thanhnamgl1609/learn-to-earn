import { FC } from 'react';
import _ from 'lodash';

import CONST from 'config/constants.json';
import { InputField } from '@molecules';
import { Class } from '@_types/school';
import { formatDate } from 'utils';

const { KNOWLEDGE_BLOCKS } = CONST;

type ClassDetailProps = {
  classDetail: Class;
};

const KNOWLEDGE_BLOCK_BY_IDS = _.keyBy(KNOWLEDGE_BLOCKS, 'id');

export const ClassDetail: FC<ClassDetailProps> = ({ classDetail }) => (
  <>
    <InputField
      label="Tên môn học"
      name="name"
      value={classDetail.meta?.course?.name || 'Loading...'}
      readOnly
    />
    <InputField
      label="Khối kiến thức"
      name="knowledgeBlockId"
      value={KNOWLEDGE_BLOCK_BY_IDS[classDetail.knowledgeBlockId].name}
      readOnly
    />
    <InputField
      label="Số tín chỉ"
      name="credits"
      type="number"
      value={classDetail.credits}
      readOnly
    />
    <InputField
      label="Giảng viên"
      name="teacherTokenId"
      value={classDetail.meta?.teacher?.name || 'Loading...'}
      readOnly
    />
    <InputField
      label="Số lương sinh viên tối đa"
      name="maxSize"
      value={classDetail.maxSize}
      readOnly
    />
    <InputField
      label="Ngày kết thúc lớp học"
      name="completeAt"
      value={formatDate(classDetail.completeAt)}
      readOnly
    />
  </>
);
