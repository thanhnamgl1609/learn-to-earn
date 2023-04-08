import { FormEvent, useCallback } from 'react';

export const useFormSubmit = <SubmitFunction extends Function>(
  submitFunction: SubmitFunction,
  deps,
) => {
  return useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      submitFunction();
    },
    [deps]
  );
};
