import { useState } from "react";

type Props<T> = {
  data: T[];
  rows: {
    header: string;
    accessorKey: keyof T;
    cell: (obj: {
      item: T;
      key: keyof T;
      meta: {
        onUpdate: (data: { index: number; key: keyof T; value: any }) => void;
      };
      row: any;
    }) => React.ReactNode;
  }[];
  meta: {
    onUpdate: (data: { index: number; key: keyof T; value: any }) => void;
  };
};

type Data = {
  name: string;
  age: number;
  city: string;
  termDate?: string | null;
};

const useReactTable = <T,>(props: Props<T>) => {
  const { data } = props;

  return {
    getRowData() {},
    getHeaderGroups() {
      return {
        headers: props.rows.map((column) => {
          return {
            id: column.accessorKey,
            render() {
              return column.header;
            },
          };
        }),
      };
    },
    getRowModel() {
      return {
        rows: props.rows.map((row) => {
          return {
            header: row.header,
            getCells() {
              return data.map((item) => {
                return {
                  id: "",
                  cell: (args: { rowIndex: number; colIndex: number }) =>
                    row.cell({
                      item,
                      key: row.accessorKey,
                      meta: props.meta,
                      row: args,
                    }),
                };
              });
            },
          };
        }),
      };
    },
  };
};

const Table = () => {
  const [data, setData] = useState([
    {
      name: "John",
      age: 20,
      city: "London",
      termDate: null,
    },
    {
      name: "Peter",
      age: 30,
      city: "",
      termDate: "2023-11-01T15:15:32.850Z",
    },
    {
      name: "Mary",
      age: 40,
      city: "Tokyo",
    },
    {
      name: "John",
      age: 20,
      city: "London",
    },
    {
      name: "Peter",
      age: 30,
      city: "Paris",
    },
    {
      name: "Mary",
      age: 40,
      city: "Tokyo",
    },
    {
      name: "John",
      age: 20,
      city: "London",
    },
    {
      name: "Peter",
      age: 30,
      city: "Paris",
    },
    {
      name: "Mary",
      age: 40,
      city: "Tokyo",
    },
  ]);

  /**
   * const rowData=[
   * {
   *  header:"Name",
   *  accessorKey: "name",
   * }]

  const optionsData={
    name:  [{
     label:"Tokyo",
    value:"Tokyo"
    }],
    city:[]
  }
   * 
   * rowa: rowData.map((row)=>{
   *  return {
        header: "Name",
        accessorKey: "name",
        cell: ({ item: obj, key }) => {
          // this should be called for cell
          if (!obj.termDate) {
            return (
              <select value={obj[key]}>
                {
                  optionsData[key].map((option)=>{
                    return <option key={option.value}>{option.label}</option>
                  })
                }
              </select>
            );
          }

          return obj[key];
        },
      },
   * })
   *
   *
   */

  const table = useReactTable<Data>({
    data,
    // map the keys array here to return this object instead of hardcoding
    rows: [
      {
        header: "Name",
        accessorKey: "name",
        cell: ({ item: obj, key }) => {
          // this should be called for cell
          if (!obj.termDate || !obj[key]) {
            return (
              <select name="" id="">
                <option value="">Amar</option>
              </select>
            );
          }

          return obj[key];
        },
      },
      {
        header: "Age",
        accessorKey: "age",
        cell: ({ item: obj, key }) => {
          // this should be called for cell
          if (!obj.termDate) {
            return (
              <select name="" id="">
                <option value="">12</option>
              </select>
            );
          }

          return obj[key];
        },
      },
      {
        header: "City",
        accessorKey: "city",
        cell: ({ item: obj, key, row, meta }) => {
          // this should be called for cell
          if (!obj.termDate || !obj[key]) {
            return (
              <select
                name={key}
                onChange={(e) => {
                  const value = e.target.value;
                  meta.onUpdate({
                    index: row.colIndex,
                    value,
                    key,
                  });
                }}
                value={obj[key]!}
              >
                <option value="Paris">Paris</option>
                <option value="Newyork">Newyork</option>
                <option value="London">London</option>
                <option value="Tokyo">Tokyo</option>
              </select>
            );
          }

          return obj[key];
        },
      },
      {
        header: "TermDate",
        accessorKey: "termDate",
        cell: ({ item: obj, key }) => {
          // this should be called for cell
          if (!obj.termDate) {
            return (
              <select name="" id="">
                <option value="">123</option>
              </select>
            );
          }

          return obj[key];
        },
      },
    ],
    meta: {
      onUpdate: (payload) => {
        console.log(payload);
        setData((prevData) => {
          return prevData.map((d, i) => {
            if (i === payload.index) {
              return {
                ...d,
                [payload.key]: payload.value,
              };
            }

            return d;
          });
        });
      },
    },
  });
  console.log(data);

  // NOTE: this is how you add new column
  // setData)[
  //   ...data,
  //   {

  //   }
  // ]

  return (
    <div className="container">
      <table>
        <tbody>
          {table.getRowModel().rows.map((row, index) => {
            return (
              <tr key={index}>
                <th>{row.header}</th>
                {row.getCells().map((cell, cindex) => {
                  return (
                    <td key={cindex}>
                      {cell.cell({
                        colIndex: cindex,
                        rowIndex: index,
                      })}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
