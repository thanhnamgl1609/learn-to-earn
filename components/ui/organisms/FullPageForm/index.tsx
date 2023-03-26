import { FC, FormEvent, memo, PropsWithChildren } from 'react';
import Form from '../Form';

type Props = {
  title: string;
  description: string;
  submitText: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

const FullPageForm: FC<PropsWithChildren<Props>> = ({
  children,
  title,
  description,
  onSubmit,
  submitText,
}) => {
  return (
    <div className="md:grid md:grid-cols-3 md:gap-6">
      <div className="md:col-span-1">
        <div className="px-4 sm:px-0">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        </div>
      </div>

      <div className="mt-5 md:mt-0 md:col-span-2">
        <Form submitText={submitText} onSubmit={onSubmit}>
          {children}
        </Form>
      </div>
    </div>
  );
};

export default memo(FullPageForm);
