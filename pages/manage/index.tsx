import { NextPage } from 'next';
import { useRegistrationList, useRegisterTime } from '@hooks/web3';
import CONST from '@config/constants.json';
import Routes from '@config/routes.json';
import { BaseLayout } from '@templates';
import { BoxLinks } from '@organisms';
import { formatDate } from 'utils';

const { ROLES } = CONST;

const PageManage: NextPage = () => {
  const {
    registrationList: { data: teacherRegistrationInfos },
  } = useRegistrationList({ role: ROLES.TEACHER });
  const {
    registrationList: { data: studentRegistrationInfos },
  } = useRegistrationList({ role: ROLES.STUDENT });
  const {
    registerTime: { data: registerTime, canCreateNewClass },
  } = useRegisterTime();

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
      header: `LỚP HỌC - Thời gian đăng ký:
        ${formatDate(registerTime?.registerStartAt)}
        - ${formatDate(registerTime?.registerEndAt)}`,
      links: [
        {
          url: Routes.createClass.name,
          label: 'Tạo lớp học',
          disabled: !canCreateNewClass,
          disabledTag: 'Chỉnh sửa thời gian đăng ký học phần!',
        },
        {
          url: Routes.classes.name,
          label: 'Danh sách lớp học',
          disabled: !canCreateNewClass,
          disabledTag: 'Chỉnh sửa thời gian đăng ký học phần!',
        },
        {
          url: Routes.registerTime.name,
          label: 'Chỉnh sửa thời gian đăng ký học phần',
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
