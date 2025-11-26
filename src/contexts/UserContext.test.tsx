import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserProvider, useUser } from './UserContext';

function TestComponent() {
  const { user, login, logout } = useUser();

  return (
    <div>
      <div data-testid="logged-in">{user ? 'yes' : 'no'}</div>
      <div data-testid="user-name">{user?.name || 'none'}</div>
      {!user && (
        <button onClick={() => login('TestUser', 'test@test.com')}>
          Login
        </button>
      )}
      {user && <button onClick={logout}>Logout</button>}
    </div>
  );
}

describe('UserContext', () => {
  it('should provide null user by default', () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    expect(screen.getByTestId('logged-in')).toHaveTextContent('no');
    expect(screen.getByTestId('user-name')).toHaveTextContent('none');
  });

  it('should login user', () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    expect(screen.getByTestId('logged-in')).toHaveTextContent('yes');
    expect(screen.getByTestId('user-name')).toHaveTextContent('TestUser');
  });

  it('should logout user', () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    // Login first
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(screen.getByTestId('logged-in')).toHaveTextContent('yes');

    // Then logout
    fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    expect(screen.getByTestId('logged-in')).toHaveTextContent('no');
  });

  it('should throw error when used outside provider', () => {
    const originalError = console.error;
    console.error = () => {};

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useUser must be used within a UserProvider');

    console.error = originalError;
  });
});
