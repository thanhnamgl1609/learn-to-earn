import { ChangeEvent, useCallback, useState } from 'react';

type SetState = ReturnType<typeof useState>[1];

export const useInputTextChange = <State>(setFormData: SetState) =>
  useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;

      setFormData((form: State) => ({ ...form, [name]: value }));
    },
    []
  );
