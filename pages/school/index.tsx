import { formatDate } from 'utils';
import CONST from '@config/constants.json';
import ROUTES from '@config/routes.json';
import { useRegisterTime } from '@hooks/web3';
import { BoxLinks } from '@organisms';
import { BaseLayout } from '@templates';

const { DATE_TIME } = CONST;

const School = () => {
  const {
    registerTime: { data: registerTime, canRegisterClass },
  } = useRegisterTime();

  const displayRegisterTime = {
    registerStartAt:
      formatDate(registerTime?.registerStartAt, DATE_TIME.DATETIME) ||
      'Chưa có',
    registerEndAt:
      formatDate(
        registerTime?.registerEndAt ?? new Date(),
        DATE_TIME.DATETIME
      ) || 'Chưa có',
  };

  const boxes = [
    {
      header: `ĐĂNG KÝ HỌC PHẦN ${displayRegisterTime.registerStartAt} - ${displayRegisterTime.registerEndAt}`,
      links: [
        {
          url: ROUTES.registeredClassList.name,
          label: 'Đăng ký học phần',
          // disabled: !canRegisterClass,
          disabledTag: 'Chưa đến thời gian đăng ký học phần',
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

export default School;
