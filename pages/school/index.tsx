import ROUTES from '@config/routes.json';
import { BoxLinks } from '@organisms';
import { BaseLayout } from '@templates';
import { useCurrentSemester } from '@hooks/api';
import { semesterEntity } from 'domain/models';
import { Heading } from '@atoms';

const School = () => {
  const { data: currentSemester } = useCurrentSemester();

  const displaySemester = semesterEntity.displaySemester(currentSemester);
  const displayRegisterTime =
    semesterEntity.displayRegisterTime(currentSemester);

  const boxes = [
    {
      header: (
        <>
          <p>ĐĂNG KÝ HỌC PHẦN</p>
          <p>
            <span className="underline">Thời gian đăng ký: </span>
            {displayRegisterTime.registerStartAt} -{' '}
            {displayRegisterTime.registerEndAt}
          </p>
        </>
      ),
      links: [
        {
          url: ROUTES.registeredClassList.name,
          label: 'Đăng ký học phần',
          disabled: !currentSemester?.isInRegisterTime,
          disabledTag: 'Chưa đến thời gian đăng ký học phần',
        },
      ],
    },
  ];

  return (
    <BaseLayout>
      <Heading>{displaySemester}</Heading>
      {boxes.map((box, index) => (
        <BoxLinks box={box} key={index} />
      ))}
    </BaseLayout>
  );
};

export default School;
