import { useRouter } from 'next/router';

import { NftIdentity } from '@_types/nftIdentity';
import ROUTES from '@config/routes.json';
import { useAppDispatch } from '@hooks/stores';
import { useGrantNftIdentity } from '@hooks/common';
import { BaseLayout, FormClassDetail } from '@templates';
import { Breadcrumb } from '@organisms';
import { Box } from '@molecules';
import { Button, Heading, LinkText } from '@atoms';
import { openConfirmModal } from '@store/appSlice';
import { useClassDetailApi } from '@hooks/api/classes';
import { classEntity } from 'domain/models';

type IdentityColumnProps = {
  item: Omit<NftIdentity, 'tokenId'> & { id: number };
};

const ActionColumns = ({ item }: IdentityColumnProps) => {
  const dispatch = useAppDispatch();
  const grantNftIdentity = useGrantNftIdentity();
  const { id, ...pNftIdentity } = item;

  const onRegisterClick = () => {
    dispatch(
      openConfirmModal({
        content: `Cấp chứng chỉ cho sinh viên ${item.meta.fullName} - #${id}`,
        onAccept: () =>
          grantNftIdentity({
            tokenId: id,
            ...pNftIdentity,
          }),
      })
    );
  };

  return (
    <div>
      <Button
        onClick={onRegisterClick}
        className="bg-indigo-900 px-2 py-1 text-white rounded-[4px] hover:opacity-80"
        disabled
      >
        Cấp chứng chỉ
      </Button>
    </div>
  );
};

const SchoolClassDetail = () => {
  const router = useRouter();
  const { id: qid } = router.query;
  const id = parseInt(qid as string);
  if (!id || Number.isNaN(id)) return null;

  const { data: classDetail } = useClassDetailApi(id);
  const displayClassDetail = classEntity.displayClassDetail(
    classDetail || classEntity.createLoadingState()
  );

  const links = [
    {
      label: 'Danh sách học phần',
      route: ROUTES.schoolClassList,
    },
    {
      label: `Lớp #${id}`,
    },
  ];

  return (
    <BaseLayout containerClassName="max-w-[640px]">
      <Breadcrumb links={links} />

      <Box autoLayout>
        <LinkText
          href={displayClassDetail?.chainURI ?? ''}
          theme="heading"
          target="_blank"
        >
          Class #{displayClassDetail?.onChainId}
        </LinkText>
        <FormClassDetail formState={displayClassDetail} edit />
      </Box>
    </BaseLayout>
  );
};

export default SchoolClassDetail;
