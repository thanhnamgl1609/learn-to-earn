import Link, { LinkProps } from 'next/link';
import { AnchorHTMLAttributes, FC, memo, PropsWithChildren } from 'react';
import { cls } from 'utils';

type Props = {
  className?: string;
  size?: 'S' | 'M' | 'L';
  theme?: 'main' | 'sub' | 'disabled' | 'default';
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
    theme = 'default',
    href,
    disabled,
    disabledContainerClassName,
    disabledClassName,
    disabledTag,
    ...props
  }) =>
    disabled ? (
      <div className={cls(disabledContainerClassName, 'group hover:relative')}>
        <p
          className={cls(
            `
            text-center border
            opacity-50 hover:opacity-50
            text-sm rounded-md shadow-sm
          `,
            'px-2 py-1',
            className,
            theme === 'main' &&
              'bg-indigo-900 text-white border border-transparent',
            theme === 'sub' &&
              'bg-white text-indigo-900 border border-indigo-900 border-1',
            disabledClassName
          )}
        >
          {props.children}
        </p>
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
          `block px-2 py-1 mt-1 border overflow-hidden`,
          `text-sm rounded-md shadow-sm`,
          theme === 'default' &&
            'border-gray-300 hover:text-indigo-900 hover:border-indigo-900',
          theme === 'disabled' &&
            `
              read-only:bg-gray-200 read-only:text-black
              read-only:border-none read-only:outline-none
              read-only:cursor-default
            `,
          theme === 'main' &&
            'bg-indigo-900 text-white border border-transparent font-medium  px-4 py-2',
          theme === 'sub' &&
            'bg-white text-indigo-900 border border-indigo-900 border-1',
          className
        )}
        href={href || ''}
        {...props}
      />
    )
);
