
import React, { useState } from 'react';

const Table = () => {
  const data = [
    { id: 1, name: 'John', age: 25 },
    { id: 2, name: 'Jane', age: 30 },
    { id: 3, name: 'Bob', age: 35 },
    { id: 4, name: 'Alice', age: null },
  ];

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Age</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <TableRow key={item.id} data={item} />
        ))}
      </tbody>
    </table>
  );
};

const TableRow = ({ data }) => {
  return (
    <tr>
      <TableCell value={data.id} />
      <TableCell value={data.name} />
      <EditableTableCell value={data.age} />
    </tr>
  );
};

const TableCell = ({ value }) => {
  return <td>{value}</td>;
};

const EditableTableCell = ({ value }) => {
  const [editingValue, setEditingValue] = useState(value);
  const [error, setError] = useState(false);
  const [previousValue, setPreviousValue] = useState(value);

  const handleInputChange = (e) => {
    setEditingValue(e.target.value);
  };

  const handleInputBlur = () => {
    if (editingValue !== previousValue) {
      setError(true);
    } else {
      setError(false);
    }
  };

  return (
    <td>
        <input
          type="text"
          value={editingValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
        />
        <br/>
        {error ? (
          <span style={{ color: 'red' }}>Error: Value has changed</span>
        ) :""}
      
    </td>
  );
};

export default Table;
