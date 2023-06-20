import { FC, PropsWithChildren, useCallback } from 'react';
import _ from 'lodash';

type Data = {
  id?: number;
  [key: string]: any;
};
type CustomProp = {
  item: Data;
};
type Props = {
  title?: string;
  data: Data[];
  headers: {
    field?: string;
    name: string;
    custom?: FC<CustomProp>;
  }[];
  autoOrderId?: boolean;
  onRowClick?: (idx: number) => void;
  customProps?: Record<string, any>;
};

const Table: FC<PropsWithChildren<Props>> = (props) => {
  const {
    autoOrderId,
    title,
    data,
    headers,
    onRowClick = (idx: number) => {},
    customProps = {},
  } = props;

  const _onRowClick = useCallback((idx: number) => () => onRowClick(idx), []);

  return (
    <>
      {title && <h3 className="font-bold uppercase text-gray-700">{title}</h3>}
      <table className={`${title ? 'mt-[24px]' : 'mt-0'}`}>
        <thead>
          <tr>
            {autoOrderId && <th className="table-heading text-center">No</th>}
            {headers.map(({ name }) => (
              <th className="table-heading" key={name}>
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={`item_${item.id ?? idx}`} onClick={_onRowClick(idx)}>
              {autoOrderId && (
                <td className="table-data text-center">{idx + 1}</td>
              )}
              {headers.map(({ field, custom: Custom }, itemIdx) => (
                <td
                  className="table-data"
                  key={`item_${item.id}_${itemIdx}_${field ?? ''}`}
                >
                  {Custom ? (
                    <Custom item={item} {...customProps} />
                  ) : (
                    _.get(item, field)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Table;
