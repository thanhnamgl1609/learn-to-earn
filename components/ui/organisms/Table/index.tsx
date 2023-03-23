import { FC, PropsWithChildren, useCallback } from 'react';
import _ from 'lodash';

type Props = {
  data: {
    id: number;
    [key: string]: any;
  }[];
  headers: {
    field: string;
    name: string;
  }[];
  onRowClick?: (idx: number) => void;
};

const Table: FC<PropsWithChildren<Props>> = (props) => {
  const { data, headers, onRowClick = (idx: number) => {} } = props;

  const _onRowClick = useCallback((idx: number) => () => onRowClick(idx), []);

  return (
    <table>
      <tr>
        <tr>No</tr>
        {headers.map(({ name }) => (
          <th key={name}>{name}</th>
        ))}
      </tr>
      {data.map(({ id, ...item }, idx) => (
        <tr key={`item_${id}`} onClick={_onRowClick(idx)}>
          <td>{idx + 1}</td>
          {headers.map(({ field }) => (
            <td key={`item_${id}_${field}`}>{_.get(item, field)}</td>
          ))}
        </tr>
      ))}
    </table>
  );
};

export default Table;
