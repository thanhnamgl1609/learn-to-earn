import Link, { LinkProps } from 'next/link';
import { FC, memo, PropsWithChildren } from 'react';
import { cls } from 'utils';

type Props = {
  className?: string;
  size?: 'S' | 'M' | 'L';
  theme?: 'main' | 'sub';
  disabled?: boolean;
  disabledContainerClassName?: string;
  disabledClassName?: string;
  disabledTag?: string;
} & LinkProps;

export const CustomLink: FC<PropsWithChildren<Props>> = memo(
  ({
    className,
    size,
    theme,
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
            text-center block hover:opacity-80 active:opacity-60
            text-sm rounded-md font-medium shadow-sm
            disabled:opacity-50 disabled:hover:opacity-50
          `,
          size === 'S' ? 'px-2 py-1' : size === 'M' ? 'px-4 py-2' : 'px-6 py-3',
          theme === 'main' &&
            'bg-indigo-900 text-white border border-transparent',
          theme === 'sub' &&
            'bg-white text-indigo-900 border border-indigo-900 border-1',
          className
        )}
        {...props}
      />
    )
);
