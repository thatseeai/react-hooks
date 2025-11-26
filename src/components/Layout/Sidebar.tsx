import { Link, useLocation } from 'react-router-dom';
import { HOOKS_DATA, getHooksByCategory } from '@/utils/hooks';

const categories = [
  { id: 'state', name: '상태 관리', icon: '📦' },
  { id: 'effect', name: '부수 효과', icon: '⚡' },
  { id: 'performance', name: '성능 최적화', icon: '🚀' },
  { id: 'dom', name: 'DOM 접근', icon: '🎯' },
  { id: 'other', name: '기타', icon: '🔧' },
  { id: 'react19', name: 'React 19', icon: '✨' },
] as const;

function Sidebar(): React.ReactElement {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 overflow-y-auto border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <nav className="space-y-6">
        {categories.map((category) => {
          const hooks = getHooksByCategory(
            category.id as (typeof HOOKS_DATA)[number]['category']
          );

          return (
            <div key={category.id}>
              <h3 className="mb-2 flex items-center space-x-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </h3>
              <ul className="space-y-1">
                {hooks.map((hook) => {
                  const isActive = location.pathname === hook.path;
                  return (
                    <li key={hook.id}>
                      <Link
                        to={hook.path}
                        className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-600 font-medium dark:bg-blue-900/20 dark:text-blue-400'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                        }`}
                      >
                        <code className="text-xs">{hook.name}</code>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
