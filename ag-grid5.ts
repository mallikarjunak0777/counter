import React, { useState } from 'react';

const Table = () => {
  const [data, setData] = useState([
    { id: 1, name: '', age: '' },
    { id: 2, name: '', age: '' },
    { id: 3, name: '', age: '' },
    { id: 4, name: '', age: '' },
  ]);

  const [nameErrors, setNameErrors] = useState([]);
  const [ageErrors, setAgeErrors] = useState([]);

  const handleInputChange = (e, index, columnName) => {
    const { value } = e.target;

    const updatedData = [...data];
    updatedData[index][columnName] = value;
    setData(updatedData);

    if (columnName === 'name') {
      const updatedErrors = [...nameErrors];
      updatedErrors[index] = !validateName(value);
      setNameErrors(updatedErrors);
    }

    if (columnName === 'age') {
      const updatedErrors = [...ageErrors];
      updatedErrors[index] = !validateAge(value, index);
      setAgeErrors(updatedErrors);
    }
  };

  const validateName = (name) => {
    // Example validation: Name must be at least 3 characters long
    return name.trim().length === 0 || name.length >= 3;
  };

  const validateAge = (age, currentIndex) => {
    // Example validation: Age must be greater than or equal to the previous row's age
    if (age === '') {
      return false; // Disallow empty value
    }
    const previousAge = currentIndex > 0 ? data[currentIndex - 1].age : '';
    return previousAge === '' || (previousAge !== '' && parseInt(age) > parseInt(previousAge));
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
            nameError={nameErrors[index]}
            ageError={ageErrors[index]}
          />
        ))}
      </tbody>
    </table>
  );
};

const TableRow = ({ data, index, handleInputChange, nameError, ageError }) => {
  const { id, name, age } = data;

  return (
    <tr>
      <td>{id}</td>
      <td>
        <input
          type="text"
          value={name}
          onChange={(e) => handleInputChange(e, index, 'name')}
          className={nameError ? 'error' : ''}
        />
        {nameError && name.trim().length > 0 && (
          <span className="error-message">Invalid Name</span>
        )}
      </td>
      <td>
        <input
          type="text"
          value={age}
          onChange={(e) => handleInputChange(e, index, 'age')}
          className={ageError ? 'error' : ''}
        />
        {ageError && (
          <span className="error-message">Invalid Age</span>
        )}
        {age === '' && (
          <span className="error-message">Age cannot be empty</span>
        )}
      </td>
    </tr>
  );
};

export default Table;
