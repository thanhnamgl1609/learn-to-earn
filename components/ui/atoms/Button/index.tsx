import { ButtonHTMLAttributes, FC, memo, PropsWithChildren } from 'react';
import withStyles from '../Styles';

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

const Button: FC<ButtonProps> = ({ children, className, ...props }) => (
  <button
    className={[
      `text-sm px-4 py-2 rounded-md
       hover:opacity-80 active:opacity-60
       font-medium
       border border-transparent shadow-sm
      `,
      className,
    ].join(' ')}
    {...props}
  >
    {children}
  </button>
);

export default memo(withStyles<ButtonProps>(Button));
