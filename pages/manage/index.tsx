import { NextPage } from 'next';
import Link from 'next/link';
import { useRegistrationList } from '@hooks/web3';
import CONST from '@config/constants.json';
import Routes from '@config/routes.json';
import { BaseLayout } from '@templates';
import { Box } from '@molecules';
import { Heading } from '@atoms';

const { ROLES } = CONST;

const PageManage: NextPage = () => {
  const {
    registrationList: { data: teacherRegistrationInfos },
  } = useRegistrationList({ role: ROLES.TEACHER });
  const {
    registrationList: { data: studentRegistrationInfos },
  } = useRegistrationList({ role: ROLES.STUDENT });

  return (
    <BaseLayout>
      <Box className="px-8 py-6">
        <Heading className="text-indigo-900">ĐƠN ĐĂNG KÝ</Heading>

        <div className="mt-4 space-y-6 md:space-y-0 md:space-x-6">
          <Link
            className="relative inline-block bg-gray-500 text-white border rounded p-4 hover:opacity-80 active:opacity-60"
            href={`${Routes.manageRegistration.name}?r=${[ROLES.TEACHER]}`}
          >
            Giảng viên
            <span className="absolute top-0 right-0 rounded-[50%] translate-x-[50%] translate-y-[-50%] bg-red-600 px-3 py-1">
              {teacherRegistrationInfos?.length ?? 0}
            </span>
          </Link>

          <Link
            className="relative inline-block bg-gray-500 text-white border rounded p-4 hover:opacity-80 active:opacity-60"
            href={`${Routes.manageRegistration.name}?r=${[ROLES.STUDENT]}`}
          >
            Sinh viên
            <span className="absolute top-0 right-0 rounded-[50%] translate-x-[50%] translate-y-[-50%] bg-red-600 px-3 py-1">
              {studentRegistrationInfos?.length ?? 0}
            </span>
          </Link>
        </div>
      </Box>
    </BaseLayout>
  );
};

export default PageManage;
