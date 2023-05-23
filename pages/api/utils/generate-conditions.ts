import _ from 'lodash';

import db from 'models';

type ConditionParams = {
  $equal?: string[];
  $in?: (string | string[])[];
  $notIn?: (string | string[])[];
  $like?: (string | string[])[];
  $substring?: (string | string[])[];
  $gte?: (string | string[])[];
  $lte?: (string | string[])[];
};

type TransformOptions = { key: string; fn: (value: string) => string }[];

type Options = { transformOptions: TransformOptions };

export const transform = (
  data: Record<string, any>,
  options: TransformOptions
) =>
  options.reduce(
    (prev, { key, fn }) => ({ ...prev, [key]: fn(data[key]) }),
    {}
  );

export const generateCondition = (
  data: Record<string, any>,
  conditions: ConditionParams,
  options?: Options
) => {
  let value = data;
  const { transformOptions } = options || {};
  if (transformOptions) value = transform(data, transformOptions);

  return generate(value, conditions);
};

const generate = (data: Record<string, any>, conditions: ConditionParams) => {
  const {
    $equal = [],
    $in = [],
    $notIn = [],
    $like = [],
    $substring = [],
    $gte = [],
    $lte = [],
  } = conditions;

  const equalCondition = _.pickBy(
    data,
    (value, key) => (!!value || value === null) && $equal.includes(key)
  );
  const inCondition = _generateCondition(data, $in, db.Op.in);
  const notInCondition = _generateCondition(data, $notIn, db.Op.notIn);
  const likeCondition = _generateCondition(data, $like, db.Op.like);
  const gteCondition = _generateCondition(data, $gte, db.Op.gte);
  const lteCondition = _generateCondition(data, $lte, db.Op.lte);
  const substringCondition = _generateCondition(
    data,
    $substring,
    db.Op.substring
  );

  return [
    inCondition,
    notInCondition,
    likeCondition,
    substringCondition,
    gteCondition,
    lteCondition,
  ].reduce(
    (prev, currentCondition) =>
      Object.keys(currentCondition).reduce(
        (prevItem, currentKey) => ({
          ...prevItem,
          [currentKey]: {
            ...prev[currentKey],
            ...currentCondition[currentKey],
          },
        }),
        prev
      ),
    equalCondition
  );
};

const _generateCondition = (
  data: Record<string, any>,
  fields: (string | string[])[],
  op: any
) => {
  return fields.reduce((prev, key) => {
    const [queryKey, dbKey] = Array.isArray(key) ? key : [key, key];

    return data[queryKey]
      ? {
          ...prev,
          [dbKey]: {
            [op]: data[queryKey],
          },
        }
      : prev;
  }, {});
};
