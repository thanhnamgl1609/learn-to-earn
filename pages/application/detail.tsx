import { Image } from '@atoms';
import { useAppSelector } from '@hooks/stores';
import { selectUser } from '@store/userSlice';
import { BaseLayout } from '@templates';

const ApplicationDetail = () => {
  const { registration } = useAppSelector(selectUser);

  return (
    <BaseLayout>
      <h2 className="text-lg font-medium leading-6 text-gray-900">
        Your Application Detail
      </h2>
      <div className="shadow sm:rounded-md sm:overflow-hidden">
        <div className="p-6 bg-white space-y-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {registration.fullName}
          </h3>
          <div>
            <h4 className="mb-2 font-medium">Documents</h4>
            <div className="grid grid-cols-1 md:grid-cols-2">
              {registration.documentURIs.map((uri) => (
                <Image src={uri} alt="" key={uri} canZoomIn />
              ))}
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default ApplicationDetail;
