import { FC, InputHTMLAttributes, PropsWithChildren } from 'react';

type InputProps = {
  id: string;
  size?: 'S' | 'M' | 'L';
  theme?: 'main' | 'sub' | 'disabled';
  label?: string;
  customTagClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const InputFileButton: FC<InputProps> = ({
  size = 'M',
  theme = 'main',
  label = '',
  className,
  id,
  ...props
}) => (
  <label
    className={[
      `hover:opacity-80 active:opacity-50
       text-sm rounded-md font-medium shadow-sm
      `,
      size === 'S'
        ? 'px-2 py-1'
        : size === 'M'
        ? 'px-4 py-2'
        : 'px-6 py-3',
      theme === 'main' &&
        'bg-indigo-900 text-white border border-transparent',
      theme === 'sub' &&
        'bg-white text-indigo-900 border border-indigo-900 border-1',
      className,
    ].join(' ')}
    htmlFor={id}
  >
    <input id={id} type="file" {...props} className={'w-0 h-0'} />
    {label}
  </label>
);
