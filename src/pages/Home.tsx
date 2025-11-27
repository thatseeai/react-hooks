import { Link } from 'react-router-dom';
import { HOOKS_DATA } from '@/utils/hooks';

function Home(): React.ReactElement {
  const categories = [
    { id: 'state', name: '상태 관리', icon: '📦', description: 'useState, useReducer, useContext' },
    { id: 'effect', name: '부수 효과', icon: '⚡', description: 'useEffect, useLayoutEffect, useInsertionEffect' },
    { id: 'performance', name: '성능 최적화', icon: '🚀', description: 'useMemo, useCallback, useDeferredValue, useTransition' },
    { id: 'dom', name: 'DOM 접근', icon: '🎯', description: 'useRef, useImperativeHandle' },
    { id: 'other', name: '기타', icon: '🔧', description: 'useId, useDebugValue, useSyncExternalStore' },
    { id: 'react19', name: 'React 19 신규', icon: '✨', description: 'useActionState, useFormStatus, useOptimistic, use' },
    { id: 'tanstack', name: 'TanStack Query', icon: '🔄', description: 'useQuery, useMutation, useInfiniteQuery, useQueries' },
    { id: 'patterns', name: '고급 패턴', icon: '🎨', description: '커스텀 Hook, Hook 조합 패턴' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
          ⚛️ React Hooks 완벽 가이드
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          React 19의 모든 Hook을 실제 사용 예제와 함께 학습하세요
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const hooks = HOOKS_DATA.filter(hook => hook.category === category.id);
          const firstHook = hooks[0];

          return (
            <Link
              key={category.id}
              to={firstHook?.path ?? '/'}
              className="group block rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-blue-500 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-400"
            >
              <div className="mb-3 flex items-center space-x-3">
                <span className="text-3xl">{category.icon}</span>
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                  {category.name}
                </h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {category.description}
              </p>
              <div className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400">
                {hooks.length}개의 Hook →
              </div>
            </Link>
          );
        })}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
          프로젝트 특징
        </h2>
        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
          <li className="flex items-start space-x-2">
            <span className="mt-1">✅</span>
            <span>React 19의 모든 Hook (25개 Hook 포함)</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="mt-1">✅</span>
            <span>실제 동작하는 인터랙티브 예제</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="mt-1">✅</span>
            <span>TypeScript로 작성된 타입 안전 코드</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="mt-1">✅</span>
            <span>TanStack Query 통합 예제</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="mt-1">✅</span>
            <span>커스텀 Hook 패턴 및 Best Practices</span>
          </li>
        </ul>
      </div>

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>왼쪽 사이드바에서 원하는 Hook을 선택하여 학습을 시작하세요</p>
      </div>
    </div>
  );
}

export default Home;
