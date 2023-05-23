import { ChangeEvent, useCallback, useState } from 'react';

type SetState = ReturnType<typeof useState>[1];

export const useInputCheckChange = <State>(setFormData: SetState) =>
  useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setFormData((form: State) => ({ ...form, [name]: checked }));
  }, []);
