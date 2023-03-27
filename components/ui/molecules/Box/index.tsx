import { FC, PropsWithChildren } from 'react';

type Props = {
  className?: string;
  autoLayout?: boolean;
};

const Box: FC<PropsWithChildren<Props>> = ({
  className,
  autoLayout,
  children,
}) => (
  <div
    className={[
      'shadow sm:rounded-md bg-white',
      className,
      autoLayout && 'p-6 space-y-6',
    ]
      .filter(Boolean)
      .join(' ')}
  >
    {children}
  </div>
);

export default Box;
