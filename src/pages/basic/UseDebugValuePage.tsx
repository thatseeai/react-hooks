import { useState, useDebugValue } from 'react';
import { HookDemo } from '@/components/HookDemo';
import { CodeBlock } from '@/components/CodeBlock';

// useDebugValue를 사용하는 커스텀 Hook
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  // React DevTools에 표시될 값
  useDebugValue(isOnline ? '🟢 온라인' : '🔴 오프라인');

  return { isOnline, setIsOnline };
}

// 포맷 함수를 사용하는 예제
function useUserData(userId: string) {
  const [user, setUser] = useState({ id: userId, name: 'John Doe' });

  // 비용이 큰 포맷팅은 두 번째 인자로 전달
  useDebugValue(user, (u) => `User: ${u.name} (${u.id})`);

  return { user, setUser };
}

// 여러 useDebugValue 사용
function useFetch(url: string) {
  const [data, setData] = useState<unknown>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useDebugValue(url);
  useDebugValue(status);

  return { data, status, setData, setStatus };
}

function UseDebugValuePage(): React.ReactElement {
  const { isOnline, setIsOnline } = useOnlineStatus();
  const { user } = useUserData('user-123');
  const { status, setStatus } = useFetch('https://api.example.com/data');

  const basicUsageCode = `import { useState, useDebugValue } from 'react';

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  // React DevTools에 커스텀 라벨 표시
  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}

// 사용
function Component() {
  const isOnline = useOnlineStatus();
  return <div>{isOnline ? '온라인' : '오프라인'}</div>;
}`;

  const formatFunctionCode = `function useUserData(userId: string) {
  const [user, setUser] = useState(null);

  // 포맷 함수는 DevTools가 열려있을 때만 호출됨
  useDebugValue(user, (u) => {
    // 비용이 큰 포맷팅 로직
    return \`User: \${u.name} (\${u.id})\`;
  });

  return user;
}`;

  const multipleValuesCode = `function useFetch(url: string) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('idle');

  // 여러 개의 디버그 값 표시 가능
  useDebugValue(url);
  useDebugValue(status);

  return { data, status };
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          useDebugValue
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          React DevTools에서 커스텀 Hook에 라벨을 추가하는 React Hook
        </p>
        <div className="mt-2 flex items-center space-x-2 text-sm">
          <span className="rounded bg-blue-100 px-2 py-1 font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            React 16.8+
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600 dark:text-gray-400">기타</span>
        </div>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          🔍 React DevTools에서 확인하세요
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          이 Hook은 React DevTools의 Components 탭에서 커스텀 Hook의 값을 보기 쉽게 표시합니다.
          <br />
          브라우저의 개발자 도구를 열고 React DevTools를 확인해보세요!
        </p>
      </div>

      <HookDemo
        title="온라인 상태 Hook"
        description="useOnlineStatus Hook의 상태가 DevTools에 표시됩니다"
      >
        <div className="space-y-4">
          <div className="rounded bg-gray-100 p-4 dark:bg-gray-800">
            <p className="text-lg font-semibold">
              현재 상태: {isOnline ? '🟢 온라인' : '🔴 오프라인'}
            </p>
          </div>

          <button
            onClick={() => setIsOnline(!isOnline)}
            className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            type="button"
          >
            상태 토글
          </button>

          <div className="rounded bg-yellow-100 p-3 dark:bg-yellow-900/30">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              💡 React DevTools의 Components 탭에서 "useOnlineStatus" Hook을 찾아보세요
            </p>
          </div>
        </div>
      </HookDemo>

      <CodeBlock
        code={basicUsageCode}
        title="기본 사용법"
        language="typescript"
      />

      <HookDemo
        title="사용자 데이터 Hook"
        description="복잡한 객체를 포맷팅하여 표시"
        variant="info"
      >
        <div className="space-y-4">
          <div className="rounded bg-gray-100 p-4 dark:bg-gray-800">
            <p className="text-sm">
              <strong>User ID:</strong> {user.id}
            </p>
            <p className="text-sm">
              <strong>Name:</strong> {user.name}
            </p>
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-400">
            DevTools에서 포맷팅된 사용자 정보를 확인하세요
          </p>
        </div>
      </HookDemo>

      <CodeBlock
        code={formatFunctionCode}
        title="포맷 함수 사용"
        language="typescript"
      />

      <HookDemo
        title="페칭 상태 Hook"
        description="여러 디버그 값을 동시에 표시"
      >
        <div className="space-y-4">
          <div className="rounded bg-gray-100 p-4 dark:bg-gray-800">
            <p className="text-sm">
              <strong>Status:</strong> {status}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStatus('loading')}
              className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              type="button"
            >
              Loading
            </button>
            <button
              onClick={() => setStatus('success')}
              className="rounded bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
              type="button"
            >
              Success
            </button>
            <button
              onClick={() => setStatus('error')}
              className="rounded bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
              type="button"
            >
              Error
            </button>
          </div>
        </div>
      </HookDemo>

      <CodeBlock
        code={multipleValuesCode}
        title="여러 디버그 값 표시"
        language="typescript"
      />

      <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ✅ 사용 시점
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• 재사용 가능한 커스텀 Hook을 만들 때</li>
          <li>• Hook의 내부 상태가 복잡할 때</li>
          <li>• 라이브러리를 개발할 때</li>
          <li>• 디버깅을 쉽게 하고 싶을 때</li>
        </ul>
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-900 dark:bg-yellow-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ⚠️ 주의사항
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• useDebugValue는 커스텀 Hook 내부에서만 호출하세요</li>
          <li>• 컴포넌트에서 직접 호출하면 안 됩니다</li>
          <li>• 프로덕션 성능에는 영향을 주지 않습니다</li>
          <li>• 포맷 함수는 DevTools가 열려있을 때만 실행됩니다</li>
          <li>• 모든 커스텀 Hook에 사용할 필요는 없습니다</li>
        </ul>
      </div>

      <div className="rounded-lg border border-purple-200 bg-purple-50 p-6 dark:border-purple-900 dark:bg-purple-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          🛠️ React DevTools 사용법
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>브라우저 개발자 도구 열기 (F12)</li>
          <li>React DevTools의 "Components" 탭 선택</li>
          <li>컴포넌트 트리에서 이 컴포넌트 선택</li>
          <li>오른쪽 패널에서 "hooks" 섹션 확인</li>
          <li>커스텀 Hook 옆에 useDebugValue로 설정한 라벨 표시</li>
        </ol>
      </div>
    </div>
  );
}

export default UseDebugValuePage;
