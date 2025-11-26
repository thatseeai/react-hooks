import { useState, useMemo, createContext, useContext, ReactNode } from 'react';
import HookDemo from '../../../components/HookDemo/HookDemo';
import CodeBlock from '../../../components/CodeBlock/CodeBlock';

// Hook 조합 패턴 1: useState + useMemo
function useFilteredList<T>(items: T[], filterFn: (item: T) => boolean) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter(filterFn);
  }, [items, filterFn]);

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
    count: filteredItems.length,
  };
}

// Hook 조합 패턴 2: Context + Custom Hook
interface FormState {
  values: Record<string, string>;
  errors: Record<string, string>;
}

interface FormContextValue {
  state: FormState;
  setValue: (name: string, value: string) => void;
  setError: (name: string, error: string) => void;
  reset: () => void;
}

const FormContext = createContext<FormContextValue | null>(null);

function useForm(initialValues: Record<string, string> = {}) {
  const [state, setState] = useState<FormState>({
    values: initialValues,
    errors: {},
  });

  const setValue = (name: string, value: string) => {
    setState((prev) => ({
      ...prev,
      values: { ...prev.values, [name]: value },
      errors: { ...prev.errors, [name]: '' },
    }));
  };

  const setError = (name: string, error: string) => {
    setState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [name]: error },
    }));
  };

  const reset = () => {
    setState({
      values: initialValues,
      errors: {},
    });
  };

  return { state, setValue, setError, reset };
}

function FormProvider({ children, initialValues }: { children: ReactNode; initialValues?: Record<string, string> }) {
  const form = useForm(initialValues);

  return (
    <FormContext.Provider value={form}>
      {children}
    </FormContext.Provider>
  );
}

function useFormField(name: string) {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormField must be used within FormProvider');
  }

  const value = context.state.values[name] || '';
  const error = context.state.errors[name] || '';

  return {
    value,
    error,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      context.setValue(name, e.target.value);
    },
    hasError: !!error,
  };
}

// 데모 컴포넌트들
function FilteredListDemo() {
  const items = [
    { id: 1, name: 'React', category: 'framework' },
    { id: 2, name: 'TypeScript', category: 'language' },
    { id: 3, name: 'Vite', category: 'tool' },
    { id: 4, name: 'TailwindCSS', category: 'framework' },
  ];

  const { filteredItems, count } = useFilteredList(
    items,
    (item) => item.category === 'framework'
  );

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        필터링된 항목 수: {count}
      </div>
      <div className="space-y-2">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded"
          >
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{item.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FormWithContextDemo() {
  return (
    <FormProvider initialValues={{ username: '', email: '' }}>
      <FormContent />
    </FormProvider>
  );
}

function FormContent() {
  const context = useContext(FormContext);
  const usernameField = useFormField('username');
  const emailField = useFormField('email');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 간단한 유효성 검사
    if (!usernameField.value) {
      context?.setError('username', '사용자 이름을 입력하세요');
      return;
    }
    if (!emailField.value.includes('@')) {
      context?.setError('email', '올바른 이메일을 입력하세요');
      return;
    }

    alert(`제출 완료!\n사용자: ${usernameField.value}\n이메일: ${emailField.value}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">사용자 이름</label>
        <input
          type="text"
          value={usernameField.value}
          onChange={usernameField.onChange}
          className={`w-full px-4 py-2 border rounded bg-white dark:bg-gray-800 ${
            usernameField.hasError
              ? 'border-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {usernameField.error && (
          <p className="text-red-600 dark:text-red-400 text-sm mt-1">{usernameField.error}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">이메일</label>
        <input
          type="email"
          value={emailField.value}
          onChange={emailField.onChange}
          className={`w-full px-4 py-2 border rounded bg-white dark:bg-gray-800 ${
            emailField.hasError
              ? 'border-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {emailField.error && (
          <p className="text-red-600 dark:text-red-400 text-sm mt-1">{emailField.error}</p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          제출
        </button>
        <button
          type="button"
          onClick={() => context?.reset()}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          초기화
        </button>
      </div>
    </form>
  );
}

export default function CompositionPatterns(): React.ReactElement {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Hook 조합 패턴</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
        여러 Hook을 조합하여 복잡한 로직을 우아하게 구성하는 패턴들
      </p>

      {/* 패턴 1: useState + useMemo */}
      <HookDemo title="패턴 1: useState + useMemo 조합" description="상태 관리와 메모이제이션을 결합하여 파생 상태를 효율적으로 계산합니다.">
        <FilteredListDemo />
      </HookDemo>

      <CodeBlock
        code={`import { useState, useMemo } from 'react';

function useFilteredList<T>(
  items: T[],
  filterFn: (item: T) => boolean
) {
  const [searchTerm, setSearchTerm] = useState('');

  // useMemo로 필터링 결과 캐싱
  const filteredItems = useMemo(() => {
    return items.filter(filterFn);
  }, [items, filterFn]);

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
    count: filteredItems.length,
  };
}

// 사용 예제
function ProductList({ products }: { products: Product[] }) {
  const { filteredItems, count } = useFilteredList(
    products,
    (product) => product.inStock
  );

  return (
    <div>
      <p>재고 있는 상품: {count}개</p>
      {filteredItems.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}

// 고급 버전 - 검색어 필터링 포함
function useSearchableList<T>(
  items: T[],
  searchKeys: (keyof T)[]
) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;

    return items.filter(item =>
      searchKeys.some(key =>
        String(item[key])
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [items, searchTerm, searchKeys]);

  return { searchTerm, setSearchTerm, filteredItems };
}`}
        language="typescript"
        showLineNumbers
      />

      {/* 패턴 2: Context + Custom Hook */}
      <HookDemo title="패턴 2: Context + Custom Hook 조합" description="Context API와 커스텀 Hook을 결합하여 전역 상태와 로직을 캡슐화합니다." variant="info">
        <FormWithContextDemo />
      </HookDemo>

      <CodeBlock
        code={`import { createContext, useContext, useState, ReactNode } from 'react';

// 1. Context 정의
interface FormContextValue {
  values: Record<string, string>;
  errors: Record<string, string>;
  setValue: (name: string, value: string) => void;
  setError: (name: string, error: string) => void;
  reset: () => void;
}

const FormContext = createContext<FormContextValue | null>(null);

// 2. Provider 컴포넌트
function FormProvider({ children, initialValues }: {
  children: ReactNode;
  initialValues?: Record<string, string>;
}) {
  const [values, setValues] = useState(initialValues || {});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setValue = (name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const setError = (name: string, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const reset = () => {
    setValues(initialValues || {});
    setErrors({});
  };

  return (
    <FormContext.Provider value={{ values, errors, setValue, setError, reset }}>
      {children}
    </FormContext.Provider>
  );
}

// 3. 커스텀 Hook으로 Context 추상화
function useFormField(name: string) {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error('useFormField must be used within FormProvider');
  }

  return {
    value: context.values[name] || '',
    error: context.errors[name] || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      context.setValue(name, e.target.value);
    },
    hasError: !!context.errors[name],
  };
}

// 4. 사용
function LoginForm() {
  const email = useFormField('email');
  const password = useFormField('password');

  return (
    <form>
      <input
        type="email"
        value={email.value}
        onChange={email.onChange}
      />
      {email.error && <span>{email.error}</span>}

      <input
        type="password"
        value={password.value}
        onChange={password.onChange}
      />
      {password.error && <span>{password.error}</span>}
    </form>
  );
}

// App에서 사용
function App() {
  return (
    <FormProvider initialValues={{ email: '', password: '' }}>
      <LoginForm />
    </FormProvider>
  );
}`}
        language="typescript"
      />

      {/* 패턴 3: useReducer + useContext */}
      <HookDemo title="패턴 3: useReducer + useContext 조합" description="복잡한 전역 상태 관리를 위한 Redux 스타일 패턴입니다." variant="warning">
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            이 패턴은 대규모 애플리케이션에서 예측 가능한 상태 관리를 가능하게 합니다.
          </p>
        </div>
      </HookDemo>

      <CodeBlock
        code={`import { createContext, useContext, useReducer, ReactNode } from 'react';

// 1. 액션 타입 정의
type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SET'; payload: number };

// 2. State 타입 정의
interface State {
  count: number;
  history: number[];
}

// 3. Reducer 함수
function counterReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT':
      return {
        count: state.count + 1,
        history: [...state.history, state.count + 1],
      };
    case 'DECREMENT':
      return {
        count: state.count - 1,
        history: [...state.history, state.count - 1],
      };
    case 'SET':
      return {
        count: action.payload,
        history: [...state.history, action.payload],
      };
    default:
      return state;
  }
}

// 4. Context 생성
interface CounterContextValue {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const CounterContext = createContext<CounterContextValue | null>(null);

// 5. Provider 컴포넌트
function CounterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(counterReducer, {
    count: 0,
    history: [0],
  });

  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      {children}
    </CounterContext.Provider>
  );
}

// 6. 커스텀 Hook
function useCounter() {
  const context = useContext(CounterContext);

  if (!context) {
    throw new Error('useCounter must be used within CounterProvider');
  }

  return {
    count: context.state.count,
    history: context.state.history,
    increment: () => context.dispatch({ type: 'INCREMENT' }),
    decrement: () => context.dispatch({ type: 'DECREMENT' }),
    setCount: (value: number) => context.dispatch({ type: 'SET', payload: value }),
  };
}

// 7. 사용
function Counter() {
  const { count, increment, decrement, history } = useCounter();

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <div>History: {history.join(', ')}</div>
    </div>
  );
}`}
        language="typescript"
      />

      {/* 패턴 4: 여러 Hook 조합 */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">패턴 4: 다중 Hook 조합</h2>

        <CodeBlock
          code={`import { useState, useEffect, useCallback, useRef } from 'react';

// 복잡한 비동기 작업을 관리하는 Hook
function useAsync<T>(
  asyncFn: () => Promise<T>,
  immediate = true
) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // 컴포넌트 언마운트 시 상태 업데이트 방지
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // 실행 함수
  const execute = useCallback(async () => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFn();

      if (isMountedRef.current) {
        setData(response);
        setStatus('success');
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err as Error);
        setStatus('error');
      }
    }
  }, [asyncFn]);

  // 즉시 실행 옵션
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    execute,
    status,
    data,
    error,
    isLoading: status === 'pending',
    isError: status === 'error',
    isSuccess: status === 'success',
  };
}

// 사용 예제
function UserProfile({ userId }: { userId: number }) {
  const {
    data: user,
    isLoading,
    isError,
    error,
    execute: refetch,
  } = useAsync(
    () => fetch(\`/api/users/\${userId}\`).then(res => res.json()),
    true
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div>
      <h1>{user?.name}</h1>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}`}
          language="typescript"
          showLineNumbers
        />
      </section>

      {/* 조합 패턴 가이드 */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Hook 조합 가이드</h2>

        <div className="space-y-6">
          <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-bold text-lg mb-3">1. 단일 책임 원칙</h3>
            <ul className="space-y-2 text-sm">
              <li>• 각 Hook은 하나의 명확한 책임만 가져야 함</li>
              <li>• 너무 많은 기능을 하나의 Hook에 담지 말기</li>
              <li>• 작은 Hook들을 조합하여 복잡한 기능 구현</li>
            </ul>
          </div>

          <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h3 className="font-bold text-lg mb-3">2. 계층적 구조</h3>
            <ul className="space-y-2 text-sm">
              <li>• Low-level Hook: 기본 Hook (useState, useEffect 등)</li>
              <li>• Mid-level Hook: 재사용 가능한 커스텀 Hook</li>
              <li>• High-level Hook: 도메인 특화 Hook</li>
            </ul>
          </div>

          <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h3 className="font-bold text-lg mb-3">3. 의존성 관리</h3>
            <ul className="space-y-2 text-sm">
              <li>• Hook 간 의존성을 명확히 파악</li>
              <li>• 순환 의존성 피하기</li>
              <li>• 필요한 경우 의존성 주입 패턴 활용</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <HookDemo title="Best Practices" description="Hook 조합 시 권장사항입니다." variant="success">
        <div className="space-y-3 text-sm">
          <div>
            <strong className="text-green-700 dark:text-green-400">✅ Context는 최소한으로:</strong>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              모든 상태를 Context에 넣지 말고, 정말 전역적인 것만 사용
            </p>
          </div>
          <div>
            <strong className="text-green-700 dark:text-green-400">✅ 작은 Hook들로 분리:</strong>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              큰 Hook보다 작고 조합 가능한 Hook들이 재사용성 높음
            </p>
          </div>
          <div>
            <strong className="text-green-700 dark:text-green-400">✅ 타입 안전성:</strong>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              TypeScript 제네릭을 활용하여 타입 안전한 조합 구현
            </p>
          </div>
          <div>
            <strong className="text-green-700 dark:text-green-400">✅ 문서화:</strong>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              복잡한 Hook 조합은 사용 예제와 함께 문서화
            </p>
          </div>
        </div>
      </HookDemo>

      {/* 주의사항 */}
      <HookDemo title="주의사항" description="Hook 조합 시 피해야 할 안티패턴입니다." variant="warning">
        <ul className="space-y-2 text-sm">
          <li>• <strong>과도한 추상화:</strong> 필요 이상으로 복잡한 조합은 오히려 유지보수를 어렵게 함</li>
          <li>• <strong>Props Drilling 대안으로만 Context 사용:</strong> 모든 props drilling을 Context로 해결하려 하지 말기</li>
          <li>• <strong>불필요한 리렌더링:</strong> Context 값 변경 시 모든 consumer가 리렌더링되므로 분리 고려</li>
          <li>• <strong>Hook 규칙 위반:</strong> 조합하더라도 Hook 규칙(최상위, 순서)은 반드시 준수</li>
        </ul>
      </HookDemo>

      {/* 관련 패턴 */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">추가 조합 패턴</h2>
        <ul className="space-y-2">
          <li>
            <strong>Compound Components:</strong> 여러 컴포넌트가 상태를 공유하는 패턴
          </li>
          <li>
            <strong>Render Props with Hooks:</strong> Render Props 패턴을 Hook으로 대체
          </li>
          <li>
            <strong>HOC to Hooks:</strong> Higher-Order Component를 커스텀 Hook으로 전환
          </li>
          <li>
            <strong>State Machine Hook:</strong> useReducer + XState를 활용한 상태 머신
          </li>
        </ul>
      </section>
    </div>
  );
}
