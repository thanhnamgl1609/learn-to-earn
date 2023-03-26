import { FC, memo, PropsWithChildren, useMemo, HTMLAttributes, ComponentProps } from 'react';
import withStyles from '../Styles';

type DivProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

const FlexDiv: FC<DivProps> = ({ className, ...props }) => (
  <div className={className}>{props.children}</div>
);

export default memo(withStyles<DivProps>(FlexDiv, 'flex'));
