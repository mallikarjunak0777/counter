// MyComponent.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import MyComponent from './MyComponent';

test('useEffect displays "Data Fetched Successfully" message when button is clicked and user is authenticated', () => {
  // Arrange
  const { getByText, getByTestId } = render(<MyComponent isAuthenticated={true} />);

  // Act
  fireEvent.click(getByText('Fetch Data')); // Click the "Fetch Data" button

  // Assert
  // Verify that the "Data Fetched Successfully" message is displayed
  expect(getByTestId('message')).toHaveTextContent('Data Fetched Successfully');
});

test('useEffect displays "Authentication Required" message when button is clicked and user is not authenticated', () => {
  // Arrange
  const { getByText, getByTestId } = render(<MyComponent isAuthenticated={false} />);

  // Act
  fireEvent.click(getByText('Fetch Data')); // Click the "Fetch Data" button

  // Assert
  // Verify that the "Authentication Required" message is displayed
  expect(getByTestId('message')).toHaveTextContent('Authentication Required');
});

test('useEffect does not display a message when button is not clicked', () => {
  // Arrange
  const { queryByTestId } = render(<MyComponent isAuthenticated={true} />);

  // Assert
  // Ensure that no message is displayed initially
  expect(queryByTestId('message')).toBeNull();
});
