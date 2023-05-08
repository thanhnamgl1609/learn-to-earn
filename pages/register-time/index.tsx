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
  UI: { INPUT_DATETIME_FORMAT },
} = CONST;

const createDefaultValue = (data?: RegisterTime) => ({
  registerStartAt: formatDate(data?.registerStartAt ?? new Date(), INPUT_DATETIME_FORMAT) || '',
  registerEndAt: formatDate(data?.registerEndAt ?? new Date(), INPUT_DATETIME_FORMAT) || '',
});

const RegisterTimeDetail = () => {
  const {
    registerTime: { data, canEditRegisterTime },
  } = useRegisterTime();
    console.log("🚀 ~ file: index.tsx:27 ~ RegisterTimeDetail ~ canEditRegisterTime:", canEditRegisterTime)

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
        disabled={!canEditRegisterTime}
      >
        <Heading>Thời gian đăng ký học phần</Heading>
        <InputField
          type="datetime-local"
          label="Ngày bắt đầu"
          name="registerStartAt"
          value={formState?.registerStartAt}
          onChange={onInputChange}
        />
        <InputField
          type="datetime-local"
          label="Ngày kết thúc"
          name="registerEndAt"
          value={formState?.registerEndAt}
          onChange={onInputChange}
        />
      </Form>
    </BaseLayout>
  );
};

export default RegisterTimeDetail;
