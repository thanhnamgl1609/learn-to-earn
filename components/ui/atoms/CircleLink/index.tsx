import Link from 'next/link';
import {
  AnchorHTMLAttributes,
  FC,
  memo,
  PropsWithChildren,
} from 'react';
import withStyles from '../Styles';

type Props = PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>> & {
  className?: string;
};

const CircleLink: FC<Props> = ({
  children,
  href = '',
  className,
  ...props
}) => (
  <Link
    className={[
      className,
      `block text-sm px-4 py-2 rounded-[50%]
       hover:opacity-80 active:opacity-60
       font-medium
       border border-transparent shadow-sm
      `,
    ].join(' ')}
    href={href}
    {...props}
  >
    {children}
  </Link>
);

export default memo(withStyles<Props>(CircleLink));
