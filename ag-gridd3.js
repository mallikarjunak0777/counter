import React, { useState } from 'react';

const Table = () => {
  const [data, setData] = useState([
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 3, name: 'Bob' },
    { id: 4, name: 'Alice' },
  ]);

  const handleInputChange = (e, index, columnName) => {
    const { value } = e.target;
    setData((prevData) =>
      prevData.map((row, i) => {
        if (i === index) {
          return { ...row, [columnName]: value };
        }
        return row;
      })
    );
  };

  const validateName = (name) => {
    // Example validation: Name must be at least 3 characters long
    return name.length >= 3;
  };

  const validateId = (id) => {
    // Example validation: Id must be a positive integer
    const parsedId = parseInt(id);
    return Number.isInteger(parsedId) && parsedId > 0;
  };

  const hasError = (value, columnName) => {
    switch (columnName) {
      case 'name':
        return !validateName(value);
      case 'id':
        return !validateId(value);
      default:
        return false;
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <TableRow
            key={item.id}
            data={item}
            index={index}
            handleInputChange={handleInputChange}
            hasError={hasError}
          />
        ))}
      </tbody>
    </table>
  );
};

const TableRow = ({ data, index, handleInputChange, hasError }) => {
  const { id, name } = data;

  return (
    <tr>
      <td>
        <input
          type="text"
          value={id}
          onChange={(e) => handleInputChange(e, index, 'id')}
          className={hasError(id, 'id') ? 'error' : ''}
        />
        <br/>
        {hasError(id, 'id') && (
          <span className="error-message">Invalid ID</span>
        )}
      </td>
      <td>
        <input
          type="text"
          value={name}
          onChange={(e) => handleInputChange(e, index, 'name')}
          className={hasError(name, 'name') ? 'error' : ''}
        />
        <br/>
        {hasError(name, 'name') && (
          <span className="error-message">Invalid Name</span>
        )}
      </td>
    </tr>
  );
};

export default Table;
