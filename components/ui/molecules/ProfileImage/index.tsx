import { memo } from 'react';
import { Image } from '@atoms';

type Props = {
  className?: string;
  fullName: string;
  image: string;
};

const ProfileImage = ({ className, fullName, image }: Props) => (
  <div
    className={[className, 'inline-flex items-center gap-[16px]']
      .filter(Boolean)
      .join(' ')}
  >
    <Image
      src={image}
      alt=""
      className="w-[80px] object-cover aspect-square rounded-[50%]"
    />
    <h3 className="text-lg font-medium leading-6 text-gray-900">{fullName}</h3>
  </div>
);

export default memo(ProfileImage);
