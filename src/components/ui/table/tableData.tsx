import { Columns } from "@/interfaces";

interface Props {
  columns: Columns[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}
export const TableData = ({ columns, renderRow, data }: Props) => {
  return (
    <table className="w-full mt-4 border-separate border-spacing-5 border-black">
      <thead>
        <tr className="text-left text-gray-500 text-s">
          {columns.map((column) => (
            <th className={column.className} key={column.accesor}>
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{data.map((item) => renderRow(item))}</tbody>
    </table>
  );
};
