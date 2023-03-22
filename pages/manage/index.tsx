import { BaseLayout } from '@templates';
import { NextPage } from 'next';

const Manager: NextPage = () => {
  return (
    <BaseLayout>
      <a className="" href="/manager/teacher/registration">
        Giảng viên đang đăng ký
      </a>
    </BaseLayout>
  );
};

export default Manager;
