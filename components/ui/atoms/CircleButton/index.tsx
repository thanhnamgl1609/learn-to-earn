import { ButtonHTMLAttributes, FC, memo, PropsWithChildren } from 'react';
import withStyles from '../Styles';

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

const CircleButton: FC<ButtonProps> = ({ children, className, ...props }) => (
  <button
    className={[
      className,
      `text-sm px-4 py-2 rounded-[50%]
       hover:opacity-80 active:opacity-60
       font-medium
       border border-transparent shadow-sm
      `,
    ].join(' ')}
    {...props}
  >
    {children}
  </button>
);

export default memo(withStyles<ButtonProps>(CircleButton));
