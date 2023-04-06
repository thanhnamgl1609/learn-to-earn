import { ButtonHTMLAttributes, FC, memo, PropsWithChildren } from 'react';
import withStyles from '../Styles';

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonProps = PropsWithChildren<Props>;

const CircleButton: FC<ButtonProps> = ({ children, className, ...props }) => (
  <button
    className={[
      `rounded-[50%]
       hover:opacity-80 active:opacity-60
       border border-transparent shadow-sm
      `,
      className,
    ].join(' ')}
    {...props}
  >
    {children}
  </button>
);

export default memo(CircleButton);
