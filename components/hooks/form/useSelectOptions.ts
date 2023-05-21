import _ from 'lodash';
import { useMemo } from 'react';

type Option = {
  label: string;
  value: string | number;
};

export const useSelectOptions = (
  data: Record<string, any>[] | undefined,
  options: {
    noSelectLabel?: string | null;
    labelField?: string;
    valueField?: string;
  } = {
    noSelectLabel: null,
    labelField: 'name',
    valueField: 'id',
  }
): Option[] => {
  return useMemo(() => {
    const {
      labelField = 'name',
      valueField = 'id',
      noSelectLabel,
    } = options || {};

    const _data =
      data?.map((item) => ({
        label: _.get(item, labelField),
        value: _.get(item, valueField),
      })) || [];

    return noSelectLabel
      ? [
          {
            label: noSelectLabel,
            value: 0,
          },
          ..._data,
        ]
      : _data;
  }, [data]);
};
