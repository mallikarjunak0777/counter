import React, { useState, useEffect } from 'react';

const initialData = [
  { rate: '10', low: '1', high: '2' },
  { rate: '20', low: '3', high: '4' },
  { rate: '30', low: '5', high: '6' }
];

const App = () => {
  const [data, setData] = useState(initialData);
  const [initialErrors, setInitialErrors] = useState(
    initialData.map(() => ({
      rate: '',
      high: ''
    }))
  );
  const [errors, setErrors] = useState(initialData.map(() => ({
    rate: '',
    high: ''
  }))
);
  const [isSaveDisabled, setSaveDisabled] = useState(true);

  useEffect(() => {
    checkSaveButtonDisabled();
  }, [data]);

  const handleRateChange = (index, value) => {
    const newData = [...data];
    newData[index] = { ...newData[index], rate: value };
    setData(newData);
    validateCell(index, 'rate', value,newData);
  };

  const handleHighChange = (index, value) => {
    const newData = [...data];
    newData[index] = { ...newData[index], high: value };
    if (index < newData.length - 1) {
      newData[index + 1] = { ...newData[index + 1], low: (parseInt(value, 10) + 1).toString() };
    }
    setData(newData);
    validateCell(index, 'high', newData[index].low);
  };

  const handleClearRate = () => {
    const newData = data.map(row => ({ ...row, rate: '' }));
    setData(newData);
  };

  const handleClearLowHigh = () => {
    const newData = data.map(row => ({ ...row, low: '', high: '' }));
    setData(newData);
  };

  const handleClearAll = () => {
    setData(initialData);
    setErrors(initialErrors);
  };

  const handleSave = () => {
    // Handle save functionality here
    console.log('Data saved:', data);
  };

  const checkSaveButtonDisabled = () => {
    const isAnyCellEmpty = data.some(row => row.rate === '' || row.low === '' || row.high === '');
    const isAnyCellInvalid = data.some(
      row => row.rate > 100 || (row.high !== '' && parseInt(row.high, 10) <= parseInt(row.low, 10))
    );
    const isDataUpdated = JSON.stringify(data) !== JSON.stringify(initialData);
    setSaveDisabled(isAnyCellEmpty || isAnyCellInvalid || !isDataUpdated);
  };

  const validateCell = (index, field, compareValue,newdata) => {
    const newErrors = [...errors];

    if (newdata[index][field] === '') {
      newErrors[index][field] = `${field.toUpperCase()} is missing`;
    } else if (field === 'rate' && (newdata[index][field] < 0 || newdata[index][field] > 100)) {
      newErrors[index][field] = `${field.toUpperCase()} should be between 0 and 100`;
    } else if (field === 'rate' && newdata[index][field] === initialData[index][field]) {
      newErrors[index][field] = 'Current data is the same as initial data';
    } else if (field === 'high' && (newdata[index][field] !== '' && newdata[index][field] <= compareValue)) {
      newErrors[index][field] = `${field.toUpperCase()} should be greater than Low`;
    } else {
      newErrors[index][field] = '';
    }
    console.log("==>initialData",initialData[index][field] );
  console.log("==>data",newdata[index].rate);
    setErrors(newErrors);
  };

  

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Rate</th>
            <th>Low</th>
            <th>High</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  type="number"
                  value={row.rate}
                  onChange={e => handleRateChange(index, e.target.value)}
                />
                <div className="error">{errors[index].rate}</div>
              </td>
              <td>{row.low}</td>
              <td>
                <input
                  type="number"
                  value={row.high}
                  onChange={e => handleHighChange(index, e.target.value)}
                />
                <div className="error">{errors[index].high}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleClearRate}>Clear Rate</button>
      <button
        onClick={handleClearLowHigh}
        disabled={data.some(row => row.low === '' || row.high === '')}
      >
        Clear Low/High
      </button>
      <button onClick={handleClearAll}>Clear All</button>
      <button onClick={handleSave} disabled={isSaveDisabled}>
        Save
      </button>
    </div>
  );
};

export default App;

