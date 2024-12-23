import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar';

describe('Navbar Component', () => {
  const renderWithRouter = () => {
    return render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
  };

  it('renders website title', () => {
    renderWithRouter();
    expect(screen.getByText('Bulletin Board')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderWithRouter();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('has correct navigation links', () => {
    renderWithRouter();
    expect(screen.getByText('Contact')).toHaveAttribute('href', '/contact');
  });
});
