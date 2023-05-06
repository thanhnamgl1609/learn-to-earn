import { NextPage } from 'next';
import Link from 'next/link';
import { useRegistrationList } from '@hooks/web3';
import CONST from '@config/constants.json';
import Routes from '@config/routes.json';
import { BaseLayout } from '@templates';
import { Box } from '@molecules';
import { Heading } from '@atoms';
import { BoxLinks } from '@organisms';

const { ROLES } = CONST;

const PageManage: NextPage = () => {
  const {
    registrationList: { data: teacherRegistrationInfos },
  } = useRegistrationList({ role: ROLES.TEACHER });
  const {
    registrationList: { data: studentRegistrationInfos },
  } = useRegistrationList({ role: ROLES.STUDENT });

  const boxes = [
    {
      header: 'ĐƠN ĐĂNG KÝ',
      links: [
        {
          url: `${Routes.manageRegistration.name}?r=${[ROLES.TEACHER]}`,
          label: 'Giảng viên',
          badge: teacherRegistrationInfos?.length,
        },
        {
          url: `${Routes.manageRegistration.name}?r=${[ROLES.STUDENT]}`,
          label: 'Sinh viên',
          badge: studentRegistrationInfos?.length,
        },
      ],
    },
    {
      header: 'MÔN HỌC',
      links: [
        {
          url: Routes.createCourse.name,
          label: 'Tạo môn học',
        },
        {
          url: Routes.courses.name,
          label: 'Danh sách môn học',
        },
      ],
    },
    {
      header: 'LỚP HỌC',
      links: [
        {
          url: Routes.createClass.name,
          label: 'Tạo lớp học',
        },
        {
          url: Routes.classes.name,
          label: 'Danh sách lớp học',
        },
      ],
    },
  ];

  return (
    <BaseLayout>
      {boxes.map((box, index) => (
        <BoxLinks box={box} key={index} />
      ))}
    </BaseLayout>
  );
};

export default PageManage;
