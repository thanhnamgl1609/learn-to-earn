import Link, { LinkProps } from 'next/link';
import { AnchorHTMLAttributes, FC, memo, PropsWithChildren } from 'react';
import { cls } from 'utils';

type Props = {
  className?: string;
  size?: 'S' | 'M' | 'L';
  theme?: 'heading' | 'default';
  disabled?: boolean;
  disabledContainerClassName?: string;
  disabledClassName?: string;
  disabledTag?: string;
} & LinkProps &
  AnchorHTMLAttributes<HTMLAnchorElement>;

export const LinkText: FC<PropsWithChildren<Props>> = memo(
  ({
    className,
    size,
    href,
    theme = 'default',
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
        className={cls(
          `
          block mt-1 text-sm hover:text-indigo-900 
        `,
          theme === 'heading' && 'text-xl font-medium',
          theme === 'default' && 'text-sm',
          className,
        )}
        href={href || ''}
        {...props}
      />
    )
);
