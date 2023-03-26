import { Button } from '@atoms';
import {
  FC,
  FormHTMLAttributes,
  memo,
  PropsWithChildren,
  useMemo,
} from 'react';

type Props = {
  submitText: string;
} & FormHTMLAttributes<HTMLFormElement>;

const Form: FC<PropsWithChildren<Props>> = ({
  className,
  children,
  onSubmit,
  submitText,
}) => {
  const _className = useMemo(
    () =>
      ['shadow sm:rounded-md sm:overflow-hidden', className]
        .filter(Boolean)
        .join(' '),
    [className]
  );

  return (
    <form className={_className} onSubmit={onSubmit}>
      <div className="p-6 bg-white space-y-6">
        {children}
        <div className="text-right">
          <Button
            type="submit"
            className="inline-flex justify-center  text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {submitText ?? 'Submit'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default memo(Form);
