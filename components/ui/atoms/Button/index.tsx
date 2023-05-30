import { ButtonHTMLAttributes, FC, memo, PropsWithChildren } from 'react';
import { cls } from 'utils';

type ButtonProps = {
  size?: 'S' | 'M' | 'L';
  theme?: 'main' | 'sub' | 'disabled';
  disabledContainerClassName?: string;
  disabledClassName?: string;
  disabledTag?: string;
  customTagClassName?: string;
} & PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

const Button: FC<ButtonProps> = ({
  children,
  size = 'M',
  className,
  theme,
  disabled,
  disabledContainerClassName,
  disabledClassName,
  disabledTag,
  customTagClassName,
  ...props
}) =>
  disabled ? (
    <div
      className={cls(
        disabledContainerClassName,
        'group hover:relative cursor-default'
      )}
    >
      <p
        className={cls(
          `
            text-center border rounded
            opacity-50 hover:opacity-50
          `,
          size === 'S' ? 'px-2 py-1' : size === 'M' ? 'px-4 py-2' : 'px-6 py-3',
          className,
          theme === 'main' &&
            'bg-indigo-900 text-white border border-transparent',
          theme === 'sub' &&
            'bg-white text-indigo-900 border border-indigo-900 border-1',
          disabledClassName
        )}
      >
        {children}
      </p>
      {disabledTag && (
        <span
          className={cls(
            `
              rounded hidden absolute top-0 right-0
              bg-black translate-x-[50%] translate-y-[-50%]
              text-white group-hover:block text-sm opacity-100 z-10
            `,
            customTagClassName
          )}
        >
          {disabledTag}
        </span>
      )}
    </div>
  ) : (
    <button
      className={[
        `hover:opacity-80 active:opacity-50
       text-sm rounded-md font-medium shadow-sm
      `,
        size === 'S' ? 'px-2 py-1' : size === 'M' ? 'px-4 py-2' : 'px-6 py-3',
        theme === 'main' &&
          'bg-indigo-900 text-white border border-transparent',
        theme === 'sub' &&
          'bg-white text-indigo-900 border border-indigo-900 border-1',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );

export default memo(Button);
