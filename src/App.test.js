import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the landing hero heading', () => {
  render(<App />);
  const heading = screen.getByText(/Inventory Control for the Modern/i);
  expect(heading).toBeInTheDocument();
});
