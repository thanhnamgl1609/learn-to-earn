import { ButtonHTMLAttributes, FC, memo, PropsWithChildren } from 'react';
import withStyles from '../Styles';

type ButtonProps = {
  size?: 'S' | 'M' | 'L';
} & PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

const Button: FC<ButtonProps> = ({ children, size = 'M', className, ...props }) => (
  <button
    className={[
      className,
      `hover:opacity-80 active:opacity-60
       text-sm rounded-md font-medium
       border border-transparent shadow-sm
       disabled:opacity-50 disabled:hover:opacity-50
      `,
      size === 'S' ? 'px-2 py-1' : 
      size === 'M' ? 'px-4 py-2' :
      'px-6 py-3' 
    ].join(' ')}
    {...props}
  >
    {children}
  </button>
);

export default memo(withStyles<ButtonProps>(Button));
