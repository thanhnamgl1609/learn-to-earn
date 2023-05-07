import { useEffect, useState } from 'react';

import { RegisterTime } from '@_types/school';
import CONST from '@config/constants.json';
import ROUTES from '@config/routes.json';
import { useRegisterTime } from '@hooks/web3';
import { useFormSubmit, useInputTextChange } from '@hooks/form';
import { useEditRegisterTime } from '@hooks/common';
import { InputField } from '@molecules';
import { Breadcrumb, Form } from '@organisms';
import { BaseLayout } from '@templates';
import { formatDate } from 'utils';
import { Heading } from '@atoms';

const {
  UI: { INPUT_DATE_FORMAT },
} = CONST;

const createDefaultValue = (data?: RegisterTime) => ({
  registerStartAt: formatDate(data?.registerStartAt, INPUT_DATE_FORMAT) || '',
  registerEndAt: formatDate(data?.registerStartAt, INPUT_DATE_FORMAT) || '',
});

const RegisterTimeDetail = () => {
  const {
    registerTime: { data, canCreateNewClass },
  } = useRegisterTime();

  const [formState, setFormState] = useState(createDefaultValue(data));
  const editRegisterTime = useEditRegisterTime();
  const onFormSubmit = useFormSubmit(
    () => editRegisterTime(formState),
    [formState]
  );
  const onInputChange = useInputTextChange(setFormState);
  const breadcrumbs = [
    {
      route: ROUTES.manage,
      label: 'Trang chủ',
    },
    {
      label: 'Chỉnh sửa thời gian đăng ký',
    },
  ];

  return (
    <BaseLayout containerClassName="max-w-[640px]">
      <Breadcrumb links={breadcrumbs} />

      <Form
        onSubmit={onFormSubmit}
        submitText="Chỉnh sửa"
        disabled={canCreateNewClass}
      >
        <Heading>Thời gian đăng ký học phần</Heading>
        <InputField
          type="date"
          label="Ngày bắt đầu"
          name="registerStartAt"
          value={formState.registerStartAt}
          onChange={onInputChange}
        />
        <InputField
          type="date"
          label="Ngày kết thúc"
          name="registerEndAt"
          value={formState.registerEndAt}
          onChange={onInputChange}
        />
      </Form>
    </BaseLayout>
  );
};

export default RegisterTimeDetail;
