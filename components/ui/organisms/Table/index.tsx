import { FC, PropsWithChildren } from 'react';
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
  onRowClick: (idx: number) => void;
};

const Table: FC<PropsWithChildren<Props>> = (props) => {
  const { data, headers, onRowClick } = props;

  return (
    <table>
      <tr>
        <tr>No</tr>
        {headers.map(({ name }) => (
          <th key={name}>{name}</th>
        ))}
      </tr>
      {data.map(({ id, ...item }, idx) => (
        <tr key={id}>
          <td>{idx + 1}</td>
          {headers.map(({ field }) => (
            <td>{_.get(item, field)}</td>
          ))}
        </tr>
      ))}
    </table>
  );
};

export default Table;
