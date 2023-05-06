import { FC, PropsWithChildren } from 'react';

import { NavBar } from '@organisms';
import { cls } from 'utils';

type BaseLayoutProps = {
  containerClassName?: string;
};

const BaseLayout: FC<PropsWithChildren<BaseLayoutProps>> = ({
  children,
  containerClassName,
}) => (
  <>
    <NavBar />
    <div className="py-16 bg-gray-50 overflow-hidden min-h-screen">
      <div
        className={cls(
          'max-w-7xl mx-auto px-4 space-y-8 sm:px-6 lg:px-8',
          containerClassName
        )}
      >
        {children}
      </div>
    </div>
  </>
);

export default BaseLayout;
