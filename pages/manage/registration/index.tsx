import Link from 'next/link';
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'next/router';

import { RegistrationInfo } from '@_types/nftIdentity';
import { useRegistrationList } from '@hooks/web3';
import CONST from '@config/constants.json';
import Routes from '@config/routes.json';
import { useAppDispatch } from '@hooks/stores';
import { updateRegistrations } from '@store/manageSlice';
import { BaseLayout } from '@templates';
import { Table, Breadcrumb } from '@organisms';
import { Box, InputField, SearchBar, SelectField } from '@molecules';
import { formatDate } from 'utils';

type ActionColumnsProps = {
  item: RegistrationInfo & { id: number };
};

type RouteQuery = {
  r?: string;
};

const { ROLES, GENDER, ROLE_LABELS_VI: ROLE_LABELS } = CONST;

const AVAILABLE_ROLES = [ROLES.STUDENT, ROLES.TEACHER];

const ActionColumns = ({ item }: ActionColumnsProps) => (
  <div className="flex items-center justify-center">
    <Link
      href={`${Routes.manageRegistration.name}/${item.applicant}`}
      className="bg-indigo-900 px-2 py-1 text-white rounded-[4px] hover:opacity-80"
    >
      Chi tiết
    </Link>
  </div>
);

const tableHeaders = [
  {
    field: 'meta.fullName',
    name: 'Họ tên',
    textCenter: true,
  },
  {
    field: 'meta.phone',
    name: 'SĐT',
    textCenter: true,
  },
  {
    field: 'meta.identityNumber',
    name: 'CCCD/CMND',
    hideOnTablet: true,
    textCenter: true,
  },
  {
    name: 'Ngày sinh',
    hideOnTablet: true,
    custom: ({ item }) => (
      <p className="text-center">
        {formatDate(item.meta.dateOfBirth)}
      </p>
    ),
  },
  {
    custom: ({ item }) => (
      <p className="text-center">{GENDER[item.meta.gender]}</p>
    ),
    name: 'Giới tính',
  },
  {
    custom: ActionColumns,
    name: 'Hành động',
  },
];

const RegistrationList = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { r }: RouteQuery = router.query;
  const [currentRole, setCurrentRole] = useState(
    r ? parseInt(r) : ROLES.TEACHER
  );
  const [nameKeyword, setNameKeyword] = useState('');
  const listRoles = [
    {
      label: ROLE_LABELS[ROLES.TEACHER],
      value: ROLES.TEACHER,
    },
    {
      label: ROLE_LABELS[ROLES.STUDENT],
      value: ROLES.STUDENT,
    },
  ];

  const {
    registrationList: { data: applications },
  } = useRegistrationList({ role: currentRole });

  const tableItems = useMemo(
    () =>
      applications?.map((application, id) => ({
        id,
        ...application,
      })) || [],
    [applications]
  );

  const displayItems = useMemo(() => {
    if (!nameKeyword || nameKeyword.length < 3) return tableItems;

    return tableItems.filter(({ meta: { fullName } }) =>
      fullName.toLowerCase().includes(nameKeyword.toLowerCase())
    );
  }, [nameKeyword, tableItems]);

  const onChangeNameKeyword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      setNameKeyword(e.target.value),
    []
  );

  const breadcrumbs = [
    {
      label: 'Dashboard',
      route: Routes.manage,
    },
    {
      label: `Danh sách đăng ký`,
    },
  ];

  useEffect(() => {
    if (AVAILABLE_ROLES.every((role) => role !== currentRole)) {
      router.push(Routes.manageRegistration.name);
    }
  }, []);

  useEffect(() => {
    dispatch(updateRegistrations(applications));
  }, [applications]);

  return (
    <BaseLayout>
      <Breadcrumb links={breadcrumbs} />
      <Box autoLayout>
        <Table
          title={`Danh sách ${ROLE_LABELS[currentRole]}`}
          subheader={
            <div className="flex gap-[16px]">
              <InputField
                containerClassName="flex-1"
                label="Họ tên"
                value={nameKeyword}
                onChange={onChangeNameKeyword}
                placeholder="Nhập họ tên để tìm kiếm (ít nhất 3 ký tự)..."
              />
              <SelectField
                containerClassName="flex-1"
                label={'Vai trò'}
                options={listRoles}
                value={currentRole}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setCurrentRole(parseInt(e.target.value))
                }
              />
            </div>
          }
          data={displayItems}
          headers={tableHeaders}
          fullWidth
          autoOrderId
        />
      </Box>
    </BaseLayout>
  );
};

export default RegistrationList;
