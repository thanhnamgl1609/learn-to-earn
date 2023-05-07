import Link, { LinkProps } from 'next/link';
import { FC, memo, PropsWithChildren } from 'react';
import { cls } from 'utils';

type Props = {
  className?: string;
  disabled?: boolean;
  disabledContainerClassName?: string;
  disabledClassName?: string;
  disabledTag?: string;
} & LinkProps;

export const CustomLink: FC<PropsWithChildren<Props>> = memo(
  ({
    className,
    disabled,
    disabledContainerClassName,
    disabledClassName,
    disabledTag,
    ...props
  }) => {
    return disabled ? (
      <div className={cls(disabledContainerClassName, 'group hover:relative')}>
        <p className={cls(className, disabledClassName)}>{props.children}</p>
        {disabledTag && (
          <span
            className={`
              rounded hidden py-1 px-2 absolute top-0 right-0
              bg-black translate-x-[50%] translate-y-[-50%]
              text-white group-hover:block
              min-w-[200px] text-sm opacity-100 z-10
            `}
          >
            {disabledTag}
          </span>
        )}
      </div>
    ) : (
      <Link className={className} {...props} />
    );
  }
);
