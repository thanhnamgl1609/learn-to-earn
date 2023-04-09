import { FC, memo, PropsWithChildren } from 'react';

type Props = {
  className?: string;
};

const Heading: FC<PropsWithChildren<Props>> = ({ className, children }) => (
  <h3 className={[className, `text-xl font-medium`].filter(Boolean).join(' ')}>
    {children}
  </h3>
);

export default memo(Heading);
