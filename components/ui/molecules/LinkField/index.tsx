import { LinkBox } from '@atoms';
import Link, { LinkProps } from 'next/link';
import { memo, AnchorHTMLAttributes } from 'react';

type Props = {
  label: string;
  containerClassName?: string;
  text: string;
  theme?: 'main' | 'sub' | 'disabled';
} & LinkProps &
  AnchorHTMLAttributes<HTMLAnchorElement>;

const SelectField = ({ label, containerClassName, text, ...props }: Props) => (
  <div className={containerClassName}>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <LinkBox {...props}>{text}</LinkBox>
  </div>
);

export default memo(SelectField);
