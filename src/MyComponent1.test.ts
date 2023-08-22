// MyComponent.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import MyComponent from './MyComponent';

test('useEffect fetches data when button is clicked', async () => {
  // Arrange
  const { getByText, getByTestId } = render(<MyComponent />);

  // Act
  fireEvent.click(getByText('Fetch Data')); // Click the "Fetch Data" button

  // Assert
  // You can wait for the "Fetched Data" element to appear
  await waitFor(() => getByTestId('fetched-data'));

  // Verify that the data is fetched and displayed
  expect(getByTestId('fetched-data')).toHaveTextContent('sunt aut facere repellat provident occaecati excepturi optio reprehenderit');
});
