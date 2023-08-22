// MyComponent.js
import React, { useState, useEffect } from 'react';

function MyComponent({ isAuthenticated }) {
  const [data, setData] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (fetching && isAuthenticated) {
      setMessage('Data Fetched Successfully');
    } else if (fetching && !isAuthenticated) {
      setMessage('Authentication Required');
    } else {
      setMessage('');
    }
  }, [fetching, isAuthenticated]);

  return (
    <div>
      <button onClick={() => setFetching(true)}>Fetch Data</button>
      <div data-testid="message">{message}</div>
    </div>
  );
}

export default MyComponent;
