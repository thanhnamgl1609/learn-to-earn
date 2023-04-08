import { ChangeEvent, useCallback, useState } from 'react';

import { useUploadFile } from '@hooks/common';

type SetState = ReturnType<typeof useState>[1];

export const useInputImageChange = <State>(setFormData: SetState) => {
  const uploadFile = useUploadFile();

  return (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;

    uploadFile(e, (url: string) =>
      setFormData((form: State) => {
        const value = Array.isArray(form[name]) ? [...form[name], url] : url;

        return {
          ...form,
          [name]: value,
        };
      })
    );
  };
};
