import { useEffect, useState } from 'react';

import ROUTES from '@config/routes.json';
import { Breadcrumb, EditRegisterTimeBox } from '@organisms';
import { BaseLayout } from '@templates';
import { useCurrentYear } from '@hooks/api';
import { SemesterDetailModal } from '@templates/Modal';
import { useModalController } from '@hooks/ui';
import { SemesterDetail } from '@_types/api/semester';
import { SemesterEntity } from '@_types/models/entities';

const RegisterTimeDetail = () => {
  const { data: currentYear } = useCurrentYear();

  const [selectedSemester, setSelectedSemester] =
    useState<SemesterEntity | null>(null);
  const [
    isSemesterDetailModalOpen,
    openSemesterDetailModal,
    closeSemesterDetailModal,
  ] = useModalController();
  const onOpenSemesterDetail = (semester: SemesterEntity) => () => {
    openSemesterDetailModal();
    setSelectedSemester(semester);
  };
  const breadcrumbs = [
    {
      route: ROUTES.manage,
      label: 'Trang chủ',
    },
    {
      label: 'Chỉnh sửa thời gian đăng ký',
    },
  ];

  return (
    <>
      <BaseLayout containerClassName="max-w-[640px]">
        <Breadcrumb links={breadcrumbs} />

        {currentYear &&
          currentYear.map((semester) => (
            <EditRegisterTimeBox
              key={semester.id}
              semester={semester}
              openSemesterDetail={onOpenSemesterDetail}
            />
          ))}
      </BaseLayout>

      <SemesterDetailModal
        isOpen={isSemesterDetailModalOpen}
        onClose={closeSemesterDetailModal}
        semester={selectedSemester}
      />
    </>
  );
};

export default RegisterTimeDetail;
