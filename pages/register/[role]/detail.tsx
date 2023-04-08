import { BaseLayout } from '@templates';
import { selectCurrentRegistration } from '@store/userSlice';

import { RegistrationDetail } from '@organisms';
import { useSelector } from 'react-redux';

const RegisterRole = () => {
  const registration = useSelector(selectCurrentRegistration);
  
  return (
    <BaseLayout>
      <RegistrationDetail registration={registration.meta} />
    </BaseLayout>
  );
};

export default RegisterRole;

