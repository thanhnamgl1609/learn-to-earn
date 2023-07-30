import { FC, PropsWithChildren } from 'react';

import CONST from 'config/constants.json';
import { NavBar } from '@organisms';
import { cls } from 'utils';
import { CouncilSidebar, StudentSidebar } from '@organisms';
import { useAppSelector } from '@hooks/stores';
import { selectUser } from '@store/userSlice';

type BaseLayoutProps = {
  containerClassName?: string;
};

const { ROLES } = CONST;

const BaseLayout: FC<PropsWithChildren<BaseLayoutProps>> = ({
  children,
  containerClassName,
}) => {
  const { roleType } = useAppSelector(selectUser);
  const withSideBar = [ROLES.COUNCIL, ROLES.STUDENT].includes(
    roleType
  );

  return (
    <>
      {roleType === ROLES.COUNCIL && <CouncilSidebar />}
      {roleType === ROLES.STUDENT && <StudentSidebar />}
      {withSideBar ? (
        <>
          <NavBar withSideBar />
          <div className="relative md:ml-64 py-16 bg-gray-50 overflow-hidden min-h-screen">
            <div
              className={cls(
                'max-w-[1400px] mx-auto px-4 space-y-8 sm:px-6 lg:px-8',
                containerClassName
              )}
            >
              {children}
            </div>
          </div>
        </>
      ) : (
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
      )}
    </>
  );
};

export default BaseLayout;
