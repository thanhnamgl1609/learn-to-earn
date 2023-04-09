import { useSelector } from 'react-redux';

import { withAuth } from '@hooks/routes';
import { selectCurrentRegistration } from '@store/userSlice';
import { BaseLayout } from '@templates';
import { RegistrationDetail } from '@organisms';

const RegisterRole = () => {
  const registration = useSelector(selectCurrentRegistration);

  return (
    <BaseLayout>
      <RegistrationDetail registration={registration.meta} />
    </BaseLayout>
  );
};
RegisterRole.displayName = 'RegisterRole';

export default RegisterRole;
