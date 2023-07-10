import React, { useState } from 'react';

const Table = () => {
  const [data, setData] = useState([
    { id: 1, name: '', age: '' },
    { id: 2, name: '', age: '' },
    { id: 3, name: '', age: '' },
    { id: 4, name: '', age: '' },
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
    return name.trim().length === 0 || name.length >= 3;
  };

  const validateAge = (age, currentIndex) => {
    // Example validation: Age must be greater than the previous row's age
    if (age === '') {
      return true; // Allow empty value
    }
    const previousAge = data[currentIndex - 1]?.age;
    return previousAge === undefined || (previousAge !== '' && parseInt(age) > parseInt(previousAge));
  };

  const hasError = (value, columnName, currentIndex) => {
    switch (columnName) {
      case 'name':
        return !validateName(value);
      case 'age':
        return !validateAge(value, currentIndex);
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
            hasError={hasError}
          />
        ))}
      </tbody>
    </table>
  );
};

const TableRow = ({ data, index, handleInputChange, hasError }) => {
  const { id, name, age } = data;

  return (
    <tr>
      <td>{id}</td>
      <td>
        <input
          type="text"
          value={name}
          onChange={(e) => handleInputChange(e, index, 'name')}
          className={hasError(name, 'name', index) ? 'error' : ''}
        />
        {hasError(name, 'name', index) && name.trim().length > 0 && (
          <span className="error-message">Invalid Name</span>
        )}
      </td>
      <td>
        <input
          type="text"
          value={age}
          onChange={(e) => handleInputChange(e, index, 'age')}
          className={hasError(age, 'age', index) ? 'error' : ''}
        />
        {hasError(age, 'age', index) && (
          <span className="error-message">Invalid Age</span>
        )}
      </td>
    </tr>
  );
};

export default Table;
