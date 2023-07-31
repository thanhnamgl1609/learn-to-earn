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
  title?: string | JSX.Element;
  subheader?: JSX.Element;
  data: Data[];
  headers: {
    field?: string;
    name: string;
    textCenter?: boolean;
    hideOnTablet?: boolean;
    custom?: FC<CustomProp>;
  }[];
  autoOrderId?: boolean;
  fullWidth?: boolean;
  onRowClick?: (idx: number) => void;
  customProps?: Record<string, any>;
};

const Table: FC<PropsWithChildren<Props>> = (props) => {
  const {
    autoOrderId,
    title,
    subheader,
    data,
    headers,
    fullWidth,
    onRowClick = (idx: number) => {},
    customProps = {},
  } = props;

  const _onRowClick = useCallback(
    (idx: number) => () => onRowClick(idx),
    []
  );

  return (
    <>
      {title && (
        <h3 className="font-bold uppercase text-gray-700">{title}</h3>
      )}
      {subheader}
      <table
        className={`${title ? 'mt-[24px]' : 'mt-0'} ${
          fullWidth ? 'w-full' : ''
        }`}
      >
        <thead>
          <tr>
            {autoOrderId && (
              <th className="table-heading text-center">No</th>
            )}
            {headers.map(({ name, hideOnTablet }) => (
              <th
                className={`${'table-heading'} ${
                  hideOnTablet ? 'hidden lg:table-cell' : ''
                }`}
                key={name}
              >
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr
              key={`item_${item.id ?? idx}`}
              onClick={_onRowClick(idx)}
            >
              {autoOrderId && (
                <td className="table-data text-center">{idx + 1}</td>
              )}
              {headers.map(
                (
                  {
                    field,
                    textCenter = false,
                    hideOnTablet = false,
                    custom: Custom,
                  },
                  itemIdx
                ) => (
                  <td
                    className={`table-data ${
                      textCenter ? 'text-center' : ''
                    } ${hideOnTablet ? 'hidden lg:table-cell' : ''}`}
                    key={`item_${item.id}_${itemIdx}_${field ?? ''}`}
                  >
                    {Custom ? (
                      <Custom item={item} {...customProps} />
                    ) : (
                      _.get(item, field)
                    )}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Table;
