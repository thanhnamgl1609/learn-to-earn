import { FC, memo } from 'react';

import { Heading, Link } from '@atoms';
import { Box } from '@molecules';

type BoxLink = {
  url: string;
  label: string;
  badge?: number | null;
  disabled?: boolean;
  disabledTag?: string;
};

type Box = {
  header: string | JSX.Element;
  links: BoxLink[];
};

type Props = {
  box: Box;
};

export const BoxLinks: FC<Props> = memo(({ box }) => (
  <Box className="px-8 py-6">
    <Heading className="text-indigo-900">{box.header}</Heading>

    <div className="mt-4 space-y-6 md:space-y-0 md:space-x-6">
      {box.links.map(({ url, label, disabled, disabledTag, badge = null }) => (
        <Link
          className="relative inline-block bg-gray-500 text-white border rounded p-4 hover:opacity-80 active:opacity-60"
          disabledContainerClassName="inline-block"
          disabledClassName="opacity-50 cursor-default hover:opacity-50 active:opacity-50"
          disabledTag={disabledTag}
          href={url}
          key={url}
          disabled={disabled}
        >
          {label}
          {badge !== null && (
            <span className="absolute top-0 right-0 rounded-[50%] translate-x-[50%] translate-y-[-50%] bg-red-600 px-3 py-1">
              {badge ?? 0}
            </span>
          )}
        </Link>
      ))}
    </div>
  </Box>
));
