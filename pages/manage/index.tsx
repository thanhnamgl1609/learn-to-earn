import { useRegistrationList } from '@hooks/web3';
import CONST from '@config/constants.json';
import Routes from '@config/routes.json';
import { BaseLayout } from '@templates';
import { NextPage } from 'next';

const { ROLES } = CONST;

const PageManage: NextPage = () => {
  const {
    registrationList: { data: applications },
  } = useRegistrationList({ role: ROLES.TEACHER });

  return (
    <BaseLayout>
      <a
        className="relative bg-gray-500 text-white border rounded p-4 hover:opacity-80 active:opacity-60"
        href={Routes.manageTeacherRegistration}
      >
        Giảng viên đang đăng ký
        <span className="absolute top-0 right-0 rounded-[50%] translate-x-[50%] translate-y-[-50%] bg-red-600 px-3 py-1">
          {applications?.length ?? 0}
        </span>
      </a>
    </BaseLayout>
  );
};

export default PageManage;
