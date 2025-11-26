import React from 'react';
import { HookDemo } from '@/components/HookDemo';
import { CodeBlock } from '@/components/CodeBlock';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { UserProvider, useUser } from '@/contexts/UserContext';

// 테마를 사용하는 컴포넌트
function ThemeDisplay(): React.ReactElement {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`rounded-lg p-6 transition-colors ${
        theme === 'light'
          ? 'bg-white text-gray-900 border border-gray-300'
          : 'bg-gray-800 text-white border border-gray-600'
      }`}
    >
      <h4 className="mb-2 text-lg font-semibold">테마 디스플레이</h4>
      <p className="mb-4">현재 테마: <strong>{theme === 'light' ? '라이트' : '다크'}</strong></p>
      <button
        onClick={toggleTheme}
        className={`rounded px-4 py-2 font-medium transition-colors ${
          theme === 'light'
            ? 'bg-gray-900 text-white hover:bg-gray-700'
            : 'bg-white text-gray-900 hover:bg-gray-200'
        }`}
        type="button"
      >
        테마 전환
      </button>
    </div>
  );
}

// 중첩된 컴포넌트에서도 같은 테마 사용
function NestedThemeComponent(): React.ReactElement {
  const { theme } = useTheme();

  return (
    <div
      className={`rounded-lg p-4 ${
        theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'
      }`}
    >
      <p className="text-sm">중첩된 컴포넌트도 같은 테마를 사용합니다: {theme}</p>
    </div>
  );
}

// 사용자 정보를 표시하는 컴포넌트
function UserProfile(): React.ReactElement {
  const { user, logout } = useUser();

  if (!user) {
    return <p className="text-gray-600 dark:text-gray-400">로그인되지 않음</p>;
  }

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
        프로필
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        <strong>이름:</strong> {user.name}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        <strong>이메일:</strong> {user.email}
      </p>
      <button
        onClick={logout}
        className="mt-3 rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        type="button"
      >
        로그아웃
      </button>
    </div>
  );
}

// 로그인 폼
function LoginForm(): React.ReactElement {
  const { user, login } = useUser();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    if (name && email) {
      login(name, email);
    }
  }

  if (user) {
    return <UserProfile />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          이름
        </label>
        <input
          type="text"
          name="name"
          required
          className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
          placeholder="홍길동"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          이메일
        </label>
        <input
          type="email"
          name="email"
          required
          className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
          placeholder="hong@example.com"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      >
        로그인
      </button>
    </form>
  );
}

function UseContextPage(): React.ReactElement {
  const createContextCode = `import { createContext, useContext, useState } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Context 생성
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider 컴포넌트
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  function toggleTheme() {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom Hook
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}`;

  const useContextCode = `function ThemeDisplay() {
  // Context 값 읽기
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={theme}>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
}

// App에서 Provider로 감싸기
function App() {
  return (
    <ThemeProvider>
      <ThemeDisplay />
    </ThemeProvider>
  );
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          useContext
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Context 값을 구독하고 읽을 수 있는 React Hook
        </p>
        <div className="mt-2 flex items-center space-x-2 text-sm">
          <span className="rounded bg-blue-100 px-2 py-1 font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            React 16.8+
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600 dark:text-gray-400">상태 관리</span>
        </div>
      </div>

      <CodeBlock
        code={createContextCode}
        title="Context 생성 및 Provider 구현"
        language="typescript"
      />

      <HookDemo
        title="테마 전환 예제"
        description="Context를 사용하여 테마를 전체 컴포넌트 트리에 전달"
      >
        <ThemeProvider>
          <div className="space-y-4">
            <ThemeDisplay />
            <NestedThemeComponent />
          </div>
        </ThemeProvider>
      </HookDemo>

      <CodeBlock
        code={useContextCode}
        title="useContext 사용법"
        language="typescript"
      />

      <HookDemo
        title="사용자 인증 예제"
        description="여러 컴포넌트에서 사용자 정보를 공유하는 복잡한 예제"
        variant="info"
      >
        <UserProvider>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">
                로그인 폼
              </h4>
              <LoginForm />
            </div>
            <div>
              <h4 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">
                사용자 프로필
              </h4>
              <UserProfile />
            </div>
          </div>
        </UserProvider>
      </HookDemo>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          💡 Context 사용 시점
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• <strong>테마</strong>: 다크 모드, 라이트 모드 전환</li>
          <li>• <strong>인증</strong>: 현재 로그인한 사용자 정보</li>
          <li>• <strong>언어 설정</strong>: 다국어 지원</li>
          <li>• <strong>라우팅</strong>: 현재 경로 정보</li>
          <li>• Prop drilling을 피하고 싶을 때</li>
        </ul>
      </div>

      <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ✅ 모범 사례
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• 커스텀 Hook을 만들어 Context 사용을 캡슐화하세요</li>
          <li>• Context 값이 undefined일 때 에러를 던지세요</li>
          <li>• Provider를 컴포넌트 트리의 가능한 낮은 위치에 배치하세요</li>
          <li>• 자주 변경되는 값은 여러 Context로 분리하세요</li>
          <li>• useMemo로 Context 값을 메모이제이션하여 불필요한 리렌더링 방지</li>
        </ul>
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-900 dark:bg-yellow-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ⚠️ 주의사항
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• Context 값이 변경되면 구독하는 모든 컴포넌트가 리렌더링됩니다</li>
          <li>• Context는 전역 상태가 아닙니다 (Provider 범위 내에서만 유효)</li>
          <li>• 과도한 Context 사용은 컴포넌트 재사용성을 낮출 수 있습니다</li>
          <li>• 성능이 중요한 경우 Context 대신 상태 관리 라이브러리 고려</li>
        </ul>
      </div>
    </div>
  );
}

export default UseContextPage;
