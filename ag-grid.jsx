import React, { useState } from 'react';

const Table = () => {
  const [data, setData] = useState([
    { id: 1, name: 'John', age: 25 },
    { id: 2, name: 'Jane', age: 30 },
    { id: 3, name: 'Bob', age: 35 },
    { id: 4, name: 'Alice', age: null },
  ]);

  const removeData = () => {
    setData((prevData) =>
      prevData.map((row) => ({
        ...row,
        name: '',
        id: '',
      }))
    );
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    setData((prevData) =>
      prevData.map((row, i) => {
        if (name === 'name' || name === 'id') {
          return { ...row, [name]: '' };
        }
        return { ...row, [name]: value };
      })
    );
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <TableRow
              key={item.id}
              data={item}
              index={index}
              handleInputChange={handleInputChange}
            />
          ))}
        </tbody>
      </table>
      <button onClick={removeData}>Remove Data</button>
    </div>
  );
};

const TableRow = ({ data, index, handleInputChange }) => {
  const { id, name, age } = data;

  return (
    <tr>
      <td>
        <input
          type="text"
          name="id"
          value={id}
          onChange={(e) => handleInputChange(e, index)}
        />
      </td>
      <td>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => handleInputChange(e, index)}
        />
      </td>
      <td>
        <input
          type="text"
          name="age"
          value={age}
          onChange={(e) => handleInputChange(e, index)}
        />
      </td>
    </tr>
  );
};

export default Table;
