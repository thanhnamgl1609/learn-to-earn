import { Image } from '@atoms';
import { useAppSelector } from '@hooks/stores';
import { selectUser } from '@store/userSlice';
import { BaseLayout } from '@templates';
import { RegistrationDetail } from '@organisms';
import { Box } from '@molecules';

const ApplicationDetail = () => {
  const { registration } = useAppSelector(selectUser);

  return (
    <BaseLayout>
      <h2 className="text-lg font-medium leading-6 text-gray-900">
        Your Application Detail
      </h2>
      <Box>
        <RegistrationDetail registration={registration} />
      </Box>
    </BaseLayout>
  );
};

export default ApplicationDetail;
