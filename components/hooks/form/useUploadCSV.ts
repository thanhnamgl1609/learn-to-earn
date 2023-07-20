import { ChangeEvent, useCallback } from 'react';
import Papa from 'papaparse';
import { toast } from 'react-toastify';

type Option<D> = {
  header: boolean;
};

export const useUploadCSV = <D = any>(
  onComplete: (data: D[]) => void,
  deps: any[] = [],
  { header = true }: Option<D> = {
    header: true,
  }
) => {
  return useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (!files?.length) {
      onComplete([]);
      return;
    }

    Papa.parse<D>(files[0], {
      header,
      skipEmptyLines: true,
      complete: (result) => {
        onComplete(result.data);
        e.target.value = null;
      },
    });
  }, deps);
};
