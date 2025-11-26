import { Link } from 'react-router-dom';

function Header(): React.ReactElement {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-blue-600">⚛️</span>
          <span className="text-xl font-semibold">React Hooks 완벽 가이드</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/hooks/useState"
            className="text-sm font-medium hover:text-blue-600 transition-colors"
          >
            기본 Hooks
          </Link>
          <Link
            to="/hooks/useActionState"
            className="text-sm font-medium hover:text-blue-600 transition-colors"
          >
            React 19
          </Link>
          <a
            href="https://github.com/thatseeai/react-hooks"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium hover:text-blue-600 transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
