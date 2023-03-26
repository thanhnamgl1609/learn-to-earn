import { Button, FlexDiv } from '@atoms';
import { FC, memo, useMemo } from 'react';

type Props = {
  firstLabel: string;
  secondLabel: string;
  firstClassName?: string;
  secondClassName?: string;
  firstButtonType?: 'button' | 'submit';
  secondButtonType?: 'button' | 'submit';
  main?: 1 | 2;
  onClickFirst: () => void;
  onClickSecond: () => void;
};

type GetClassListParams = {
  main?: 1 | 2;
  requiredMain: 1 | 2;
  baseClass: string[];
};

const getClassList = ({
  main,
  requiredMain,
  baseClass = [],
}: GetClassListParams) => {
  const MAIN_CLASS = 'text-white bg-indigo-600 hover:bg-indigo-700';
  const SUB_CLASS = 'bg-gray-200 text-gray-900';
  const classList = baseClass?.length ? [...baseClass] : [];

  if (main === requiredMain) {
    classList.push(MAIN_CLASS);
  } else if (main) {
    classList.push(SUB_CLASS);
  }

  return classList.join(' ');
};

const GroupTwoButtons: FC<Props> = ({
  firstLabel,
  secondLabel,
  firstClassName,
  secondClassName,
  firstButtonType = 'button',
  secondButtonType = 'button',
  main,
  onClickFirst,
  onClickSecond,
}) => {
  const _classList = useMemo(
    () => ({
      first: getClassList({
        main,
        requiredMain: 1,
        baseClass: [firstClassName],
      }),
      second: getClassList({
        main,
        requiredMain: 2,
        baseClass: [secondClassName, 'ml-4'],
      }),
    }),
    [firstClassName, secondClassName, main]
  );

  return (
    <FlexDiv center>
      <Button
        onClick={onClickFirst}
        className={_classList.first}
        type={firstButtonType}
      >
        {firstLabel}
      </Button>

      <Button
        onClick={onClickSecond}
        className={_classList.second}
        type={secondButtonType}
      >
        {secondLabel}
      </Button>
    </FlexDiv>
  );
};

export default memo(GroupTwoButtons);
