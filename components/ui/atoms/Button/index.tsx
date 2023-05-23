import { ButtonHTMLAttributes, FC, memo, PropsWithChildren } from 'react';

type ButtonProps = {
  size?: 'S' | 'M' | 'L';
  theme?: 'main' | 'sub';
} & PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

const Button: FC<ButtonProps> = ({
  children,
  size = 'M',
  className,
  theme,
  ...props
}) => (
  <button
    className={[
      `hover:opacity-80 active:opacity-60
       text-sm rounded-md font-medium
       border border-transparent shadow-sm
       disabled:opacity-50 disabled:hover:opacity-50
      `,
      size === 'S' ? 'px-2 py-1' : size === 'M' ? 'px-4 py-2' : 'px-6 py-3',
      theme === 'main' && 'bg-indigo-900 text-white',
      theme === 'sub' && 'bg-white text-indigo-900 border-indigo-900',
      className,
    ].join(' ')}
    {...props}
  >
    {children}
  </button>
);

export default memo(Button);
