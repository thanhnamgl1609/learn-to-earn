import { useAppSelector } from '@hooks/stores';
import { selectUser } from '@store/userSlice';
import { BaseLayout } from '@templates';
import { RegistrationDetail } from '@organisms';

const ApplicationDetail = () => {
  const { registration } = useAppSelector(selectUser);

  return (
    <BaseLayout>
      <h2 className="text-lg font-medium leading-6 text-gray-900">
        Your Application Detail
      </h2>
      <RegistrationDetail registration={registration} />
    </BaseLayout>
  );
};

export default ApplicationDetail;
