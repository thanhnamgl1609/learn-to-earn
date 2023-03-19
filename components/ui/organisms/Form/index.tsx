import { FC, memo, PropsWithChildren } from 'react';

type Props = {
  title: string;
  description: string;
  submitText: string;
  onSubmit: () => void;
};

const Form: FC<PropsWithChildren<Props>> = ({
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
        <form className="shadow sm:rounded-md sm:overflow-hidden">
          <div className="p-6 bg-white space-y-6">
            {children}
            <div className="text-right">
              <button
                onClick={onSubmit}
                type="button"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {submitText ?? 'Submit'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(Form);
