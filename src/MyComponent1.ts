// MyComponent.js
import React, { useState, useEffect } from 'react';

function MyComponent() {
  const [data, setData] = useState(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (fetching) {
      fetch('https://jsonplaceholder.typicode.com/posts/1')
        .then((response) => response.json())
        .then((result) => setData(result))
        .catch((error) => console.error('Error fetching data:', error));
    }
  }, [fetching]);

  return (
    <div>
      <button onClick={() => setFetching(true)}>Fetch Data</button>
      {data && <div data-testid="fetched-data">{data.title}</div>}
    </div>
  );
}

export default MyComponent;
