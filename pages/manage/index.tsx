import { useRegistrationList } from '@hooks/web3';
import CONST from '@config/constants.json';
import { BaseLayout } from '@templates';
import { NextPage } from 'next';

const { ROLES } = CONST;

const Manager: NextPage = () => {
  const { registrationList } = useRegistrationList({ role: ROLES.TEACHER });
  console.log('🚀 ~ file: index.tsx:10 ~ registrationList:', registrationList);

  return (
    <BaseLayout>
      <a className="" href="/manager/teacher/registration">
        Giảng viên đang đăng ký
      </a>
    </BaseLayout>
  );
};

export default Manager;
