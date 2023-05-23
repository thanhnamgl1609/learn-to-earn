import _ from 'lodash';
import { useMemo } from 'react';

type Option = {
  label: string;
  value: string | number;
};

export const useSelectOptions = <D>(
  data: D[] | undefined,
  options: {
    noSelectLabel?: string | null;
    labelField?: string;
    valueField?: string;
    customLabel?: (item: D) => string;
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
      customLabel,
    } = options || {};

    const _data =
      data?.map((item) => ({
        label: customLabel ? customLabel(item) : _.get(item, labelField),
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
