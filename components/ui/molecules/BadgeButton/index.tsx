import { ButtonHTMLAttributes, FC, memo, PropsWithChildren } from 'react';

import { Button } from '@atoms';
import { cls } from 'utils';

type Props = {
  size?: 'S' | 'M' | 'L';
  theme?: 'main' | 'sub' | 'disabled';
  tag: string | null;
  customTagClassName?: string;
} & PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

const BadgeButton: FC<Props> = ({
  className,
  tag,
  customTagClassName,
  children,
  ...props
}) => {
  return (
    <Button className={cls('relative inline-block', className)} {...props}>
      {children}
      {tag !== null && (
        <span
          className={cls(
            `
            absolute top-0 right-0 rounded-[50%]
            translate-x-[50%] translate-y-[-50%]
            bg-red-600 px-3 py-1
          `,
            customTagClassName
          )}
        >
          {tag ?? 0}
        </span>
      )}
    </Button>
  );
};

export default memo(BadgeButton);
