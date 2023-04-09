import Link from 'next/link';
import { FC, Fragment } from 'react';
import { ChevronRightIcon } from '@heroicons/react/solid';

import { Route } from '@hooks/routes/config';

type BreadcrumbLink = {
  label: string;
  route?: Route;
};
type Props = {
  links: BreadcrumbLink[];
};

const Breadcrumb: FC<Props> = ({ links }) => {
  return (
    <div className="flex gap-2 items-center">
      {links.map(({ label, route }, index) => (
        <Fragment key={label}>
          {index > 0 && (
            <ChevronRightIcon className="text-sm w-[16px] text-gray-800" />
          )}
          {route ? (
            <Link
              href={route.name}
              as={route.as}
              className="font-semibold hover:opacity-80"
            >
              {label}
            </Link>
          ) : (
            <span className="text-gray-900">{label}</span>
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;
