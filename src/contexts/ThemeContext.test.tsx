import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';

function TestComponent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}

describe('ThemeContext', () => {
  it('should provide default theme as light', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
  });

  it('should toggle theme from light to dark', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(toggleButton);

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });

  it('should toggle theme from dark to light', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });

    // Toggle to dark
    fireEvent.click(toggleButton);
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');

    // Toggle back to light
    fireEvent.click(toggleButton);
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
  });

  it('should throw error when useTheme is used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = () => {};

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');

    console.error = originalError;
  });

  it('should provide theme context to multiple children', () => {
    function Child1() {
      const { theme } = useTheme();
      return <div data-testid="child1">{theme}</div>;
    }

    function Child2() {
      const { theme } = useTheme();
      return <div data-testid="child2">{theme}</div>;
    }

    render(
      <ThemeProvider>
        <Child1 />
        <Child2 />
      </ThemeProvider>
    );

    expect(screen.getByTestId('child1')).toHaveTextContent('light');
    expect(screen.getByTestId('child2')).toHaveTextContent('light');
  });
});
