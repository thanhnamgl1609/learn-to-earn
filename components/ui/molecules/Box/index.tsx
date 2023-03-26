import { FC, PropsWithChildren } from 'react';

const Box: FC<PropsWithChildren> = ({ children }) => (
  <div className="shadow sm:rounded-md sm:overflow-hidden p-6 bg-white space-y-6">
    {children}
  </div>
);

export default Box;
