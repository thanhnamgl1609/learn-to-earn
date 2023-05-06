import { FC, memo } from 'react';

import { Heading } from '@atoms';
import { Box } from '@molecules';
import Link from 'next/link';

type BoxLink = {
  url: string;
  label: string;
  badge?: number | null;
};

type Box = {
  header: string;
  links: BoxLink[];
};

type Props = {
  box: Box;
};

export const BoxLinks: FC<Props> = memo(({ box }) => (
  <Box className="px-8 py-6">
    <Heading className="text-indigo-900">{box.header}</Heading>

    <div className="mt-4 space-y-6 md:space-y-0 md:space-x-6">
      {box.links.map(({ url, label, badge = null }) => (
        <Link
          className="relative inline-block bg-gray-500 text-white border rounded p-4 hover:opacity-80 active:opacity-60"
          href={url}
          key={url}
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
