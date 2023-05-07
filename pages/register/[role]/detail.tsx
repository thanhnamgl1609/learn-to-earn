import { useSelector } from 'react-redux';

import { selectCurrentRegistration } from '@store/userSlice';
import { BaseLayout } from '@templates';
import { RegistrationDetail } from '@organisms';
import { Heading } from '@atoms';

const RegisterRole = () => {
  const registration = useSelector(selectCurrentRegistration);

  return (
    <BaseLayout>
      {registration?.isUploading ? (
        <Heading>
          Registration application is currently uploading! Please wait for a
          wait!
        </Heading>
      ) : (
        <RegistrationDetail registration={registration?.meta} />
      )}
    </BaseLayout>
  );
};
RegisterRole.displayName = 'RegisterRole';

export default RegisterRole;
