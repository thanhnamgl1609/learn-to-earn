import { HTMLAttributes, FC, memo, PropsWithChildren } from 'react';

type Props = HTMLAttributes<HTMLDivElement>;

type DivProps = PropsWithChildren<Props>;

const CircleBox: FC<DivProps> = ({ children, className, ...props }) => (
  <div
    className={[
      `rounded-[50%]
       border border-transparent shadow-sm
      `,
      className,
    ].join(' ')}
    {...props}
  >
    {children}
  </div>
);

export default memo(CircleBox);
