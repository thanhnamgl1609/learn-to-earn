import Link, { LinkProps } from 'next/link';
import { AnchorHTMLAttributes, FC, memo, PropsWithChildren } from 'react';
import { cls } from 'utils';

type Props = {
  className?: string;
  size?: 'S' | 'M' | 'L';
  theme?: 'main' | 'sub';
  disabled?: boolean;
  disabledContainerClassName?: string;
  disabledClassName?: string;
  disabledTag?: string;
} & LinkProps &
  AnchorHTMLAttributes<HTMLAnchorElement>;
export const LinkBox: FC<PropsWithChildren<Props>> = memo(
  ({
    className,
    size,
    theme,
    href,
    disabled,
    disabledContainerClassName,
    disabledClassName,
    disabledTag,
    ...props
  }) =>
    disabled ? (
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
      <Link
        className={`
          block px-2 py-1 mt-1 text-sm border border-gray-300
          hover:text-indigo-900 hover:border-indigo-900 rounded
          overflow-hidden
        `}
        href={href || ''}
        {...props}
      />
    )
);
