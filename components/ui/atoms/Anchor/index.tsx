import Link from 'next/link';
import { AnchorHTMLAttributes, FC, memo, PropsWithChildren } from 'react';
import withStyles from '../Styles';

type AnchorProps = PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>>;

const Anchor: FC<AnchorProps> = ({ children, className, href, ...props }) => (
  <Link
    className={[
      className,
      `text-sm px-4 py-2 rounded-md
       hover:opacity-80 active:opacity-60
       font-medium
       border border-transparent shadow-sm
      `,
    ].join(' ')}
    href={href || ''}
    {...props}
  >
    {children}
  </Link>
);

export default memo(withStyles<AnchorProps>(Anchor));
