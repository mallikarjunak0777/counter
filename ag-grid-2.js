import React, { useState } from 'react';

const Table = () => {
  const [data, setData] = useState([
    { id: 1, name: 'John', age: 25 },
    { id: 2, name: 'Jane', age: 30 },
    { id: 3, name: 'Bob', age: 35 },
    { id: 4, name: 'Alice', age: null },
  ]);
  const [showNameId, setShowNameId] = useState(true);

  const toggleNameId = () => {
    setShowNameId(!showNameId);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    setData((prevData) =>
      prevData.map((row, i) => (i === index ? { ...row, [name]: value } : row))
    );
  };
  function validateThreshold(data) {
  const filteredData = data.filter((obj, index) => {
    if (index === data.length - 1) {
      return false; // Exclude the last object
    }

    if (obj.highthreshValue === '') {
      return false; // Exclude objects with empty highthreshValue
    }

    const currhighthreshValue = parseFloat(obj.highthreshValue);
    const currlowthreshlod = parseFloat(obj.lowthreshValue);

    return currhighthreshValue !== undefined && currhighthreshValue >= currlowthreshlod;
  });

  return filteredData;
}

// Example usage
const arr = [
  { id: 1, highthreshValue: '10', lowthreshValue: '5' },
  { id: 2, highthreshValue: '8', lowthreshValue: '6' },
  { id: 3, highthreshValue: '', lowthreshValue: '7' }
];

const filteredArr = validateThreshold(arr);
console.log(filteredArr);


  return (
    <div>
      <table>
        <thead>
          <tr>
            {showNameId && (
              <>
                <th>ID</th>
                <th>Name</th>
              </>
            )}
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
              showNameId={showNameId}
            />
          ))}
        </tbody>
      </table>
      <button onClick={toggleNameId}>
        {showNameId ? 'Hide Name/ID' : 'Show Name/ID'}
      </button>
    </div>
  );
};

const TableRow = ({ data, index, handleInputChange, showNameId }) => {
  const { id, name, age } = data;

  return (
    <tr>
      {showNameId && (
        <>
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
        </>
      )}
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
