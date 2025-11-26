import { useState, useEffect, useCallback, useRef } from 'react';
import HookDemo from '../../../components/HookDemo/HookDemo';
import CodeBlock from '../../../components/CodeBlock/CodeBlock';

// Custom Hook 예제들
function useToggle(initialValue = false): [boolean, () => void] {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle];
}

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  }, [key]);

  return [storedValue, setValue];
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

// 데모 컴포넌트들
function ToggleDemo() {
  const [isOn, toggle] = useToggle(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className={`w-16 h-8 rounded-full relative cursor-pointer transition-colors ${
          isOn ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
        }`} onClick={toggle}>
          <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
            isOn ? 'translate-x-9' : 'translate-x-1'
          }`} />
        </div>
        <span className="font-medium">{isOn ? 'ON' : 'OFF'}</span>
      </div>
      <button
        onClick={toggle}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        토글
      </button>
    </div>
  );
}

function LocalStorageDemo() {
  const [name, setName] = useLocalStorage('user-name', '');

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="이름을 입력하세요"
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
      />
      <p className="text-sm text-gray-600 dark:text-gray-400">
        저장된 값: {name || '(없음)'}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-500">
        💡 페이지를 새로고침해도 값이 유지됩니다
      </p>
    </div>
  );
}

function DebounceDemo() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [searchCount, setSearchCount] = useState(0);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setSearchCount((c) => c + 1);
    }
  }, [debouncedSearchTerm]);

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="검색어를 입력하세요"
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
      />
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded space-y-2 text-sm">
        <p>입력한 값: <strong>{searchTerm}</strong></p>
        <p>디바운스된 값 (500ms 지연): <strong>{debouncedSearchTerm}</strong></p>
        <p className="text-gray-600 dark:text-gray-400">API 호출 횟수: {searchCount}</p>
      </div>
    </div>
  );
}

function IntervalDemo() {
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState(1000);
  const [isRunning, setIsRunning] = useState(true);

  useInterval(
    () => setCount((c) => c + 1),
    isRunning ? delay : null
  );

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-4xl font-bold">{count}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {delay}ms마다 증가
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`flex-1 px-4 py-2 text-white rounded ${
            isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isRunning ? '정지' : '시작'}
        </button>
        <button
          onClick={() => setCount(0)}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          리셋
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          간격: {delay}ms
        </label>
        <input
          type="range"
          min="100"
          max="2000"
          step="100"
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}

export default function CustomHookPatterns(): React.ReactElement {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">커스텀 Hook 패턴</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
        재사용 가능한 로직을 커스텀 Hook으로 추출하는 다양한 패턴들
      </p>

      {/* useToggle */}
      <HookDemo title="useToggle - 상태 토글" description="boolean 상태를 간편하게 토글하는 Hook입니다.">
        <ToggleDemo />
      </HookDemo>

      <CodeBlock
        code={`import { useState, useCallback } from 'react';

function useToggle(initialValue = false): [boolean, () => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);

  return [value, toggle];
}

// 사용 예제
function ToggleExample() {
  const [isOn, toggle] = useToggle(false);

  return (
    <div>
      <p>상태: {isOn ? 'ON' : 'OFF'}</p>
      <button onClick={toggle}>토글</button>
    </div>
  );
}

// 더 다양한 기능을 가진 버전
function useToggleWithReset(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const reset = useCallback(() => setValue(initialValue), [initialValue]);

  return { value, toggle, setTrue, setFalse, reset };
}`}
        language="typescript"
        showLineNumbers
      />

      {/* useLocalStorage */}
      <HookDemo title="useLocalStorage - 로컬 스토리지 동기화" description="상태를 localStorage와 자동으로 동기화하는 Hook입니다." variant="info">
        <LocalStorageDemo />
      </HookDemo>

      <CodeBlock
        code={`import { useState, useCallback } from 'react';

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  // 초기값 로드
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return initialValue;
    }
  });

  // 값 설정
  const setValue = useCallback((value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing localStorage:', error);
    }
  }, [key]);

  return [storedValue, setValue];
}

// 사용 예제
function UserSettings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [language, setLanguage] = useLocalStorage('language', 'ko');

  return (
    <div>
      <select value={theme} onChange={e => setTheme(e.target.value)}>
        <option value="light">라이트</option>
        <option value="dark">다크</option>
      </select>

      <select value={language} onChange={e => setLanguage(e.target.value)}>
        <option value="ko">한국어</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}

// SSR 지원 버전
function useLocalStorageSSR<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      console.error(error);
    }
  }, [key, initialValue]);

  const setValue = useCallback((value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key]);

  return [storedValue, setValue];
}`}
        language="typescript"
      />

      {/* useDebounce */}
      <HookDemo title="useDebounce - 값 디바운싱" description="빠르게 변경되는 값을 지연시켜 API 호출을 최적화합니다." variant="warning">
        <DebounceDemo />
      </HookDemo>

      <CodeBlock
        code={`import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // delay 후에 값 업데이트
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 클린업: 이전 타이머 취소
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 사용 예제 - 검색 자동완성
function SearchBox() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // API 호출 (500ms 지연 후)
      fetch(\`/api/search?q=\${debouncedSearchTerm}\`)
        .then(res => res.json())
        .then(data => console.log(data));
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
      placeholder="검색..."
    />
  );
}

// 디바운스 콜백 버전
function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}`}
        language="typescript"
      />

      {/* useInterval */}
      <HookDemo title="useInterval - 안전한 인터벌" description="컴포넌트 언마운트 시 자동으로 정리되는 setInterval Hook입니다.">
        <IntervalDemo />
      </HookDemo>

      <CodeBlock
        code={`import { useEffect, useRef } from 'react';

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  // 최신 콜백 저장
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // 인터벌 설정
  useEffect(() => {
    // delay가 null이면 인터벌 중지
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);

    // 클린업: 인터벌 제거
    return () => clearInterval(id);
  }, [delay]);
}

// 사용 예제 - 카운터
function Counter() {
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState(1000);
  const [isRunning, setIsRunning] = useState(true);

  useInterval(
    () => setCount(c => c + 1),
    isRunning ? delay : null  // null이면 정지
  );

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? '정지' : '시작'}
      </button>
      <input
        type="range"
        value={delay}
        onChange={e => setDelay(Number(e.target.value))}
        min="100"
        max="2000"
      />
    </div>
  );
}

// Dan Abramov의 useInterval 패턴
// https://overreacted.io/making-setinterval-declarative-with-react-hooks/`}
        language="typescript"
      />

      {/* 커스텀 Hook 패턴 정리 */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">커스텀 Hook 작성 가이드</h2>

        <div className="space-y-6">
          <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-bold text-lg mb-3">1. 명명 규칙</h3>
            <ul className="space-y-2 text-sm">
              <li>• <strong>use 접두사 필수:</strong> <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded">useCustomHook</code></li>
              <li>• <strong>의미있는 이름:</strong> <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded">useDebounce</code>, <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded">useLocalStorage</code></li>
              <li>• <strong>동사 + 명사 조합:</strong> <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded">useFetchData</code>, <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded">useToggleState</code></li>
            </ul>
          </div>

          <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h3 className="font-bold text-lg mb-3">2. 단일 책임 원칙</h3>
            <ul className="space-y-2 text-sm">
              <li>• 하나의 Hook은 하나의 기능만 수행</li>
              <li>• 너무 많은 기능을 담지 말고 작게 분리</li>
              <li>• 조합 가능하도록 설계</li>
            </ul>
          </div>

          <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h3 className="font-bold text-lg mb-3">3. 일관된 API 설계</h3>
            <ul className="space-y-2 text-sm">
              <li>• 반환 타입 일관성: 배열 <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded">[value, setValue]</code> 또는 객체 <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded">{'{value, toggle}'}</code></li>
              <li>• useState와 유사한 패턴 따르기</li>
              <li>• 선택적 파라미터는 마지막에 배치</li>
            </ul>
          </div>

          <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <h3 className="font-bold text-lg mb-3">4. 타입 안정성</h3>
            <ul className="space-y-2 text-sm">
              <li>• 제네릭을 활용하여 타입 안전성 보장</li>
              <li>• 명시적인 반환 타입 선언</li>
              <li>• null/undefined 처리 명확히</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <HookDemo title="Best Practices" description="커스텀 Hook 작성 시 권장사항입니다." variant="success">
        <div className="space-y-3 text-sm">
          <div>
            <strong className="text-green-700 dark:text-green-400">✅ useCallback/useMemo 활용:</strong>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              반환하는 함수나 객체는 메모이제이션하여 불필요한 리렌더링 방지
            </p>
          </div>
          <div>
            <strong className="text-green-700 dark:text-green-400">✅ 클린업 함수 작성:</strong>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              타이머, 이벤트 리스너, 구독 등은 반드시 정리
            </p>
          </div>
          <div>
            <strong className="text-green-700 dark:text-green-400">✅ 문서화:</strong>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              JSDoc으로 파라미터, 반환값, 사용 예제 문서화
            </p>
          </div>
          <div>
            <strong className="text-green-700 dark:text-green-400">✅ 테스트 작성:</strong>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              @testing-library/react-hooks로 단위 테스트 작성
            </p>
          </div>
        </div>
      </HookDemo>

      {/* 주의사항 */}
      <HookDemo title="주의사항" description="커스텀 Hook 작성 시 피해야 할 패턴들입니다." variant="warning">
        <ul className="space-y-2 text-sm">
          <li>• <strong>조건부 Hook 호출 금지:</strong> Hook은 항상 같은 순서로 호출되어야 함</li>
          <li>• <strong>과도한 추상화 지양:</strong> 단순한 로직은 굳이 Hook으로 만들지 않기</li>
          <li>• <strong>순환 의존성 주의:</strong> 커스텀 Hook끼리 순환 참조 방지</li>
          <li>• <strong>use 접두사 남용 금지:</strong> Hook을 호출하지 않는 함수는 use 접두사 사용 금지</li>
        </ul>
      </HookDemo>

      {/* 관련 리소스 */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">추가 커스텀 Hook 패턴</h2>
        <ul className="space-y-2">
          <li>
            <code className="text-blue-600 dark:text-blue-400">usePrevious</code>
            {' '}- 이전 값 추적
          </li>
          <li>
            <code className="text-blue-600 dark:text-blue-400">useWindowSize</code>
            {' '}- 윈도우 크기 추적
          </li>
          <li>
            <code className="text-blue-600 dark:text-blue-400">useMediaQuery</code>
            {' '}- 미디어 쿼리 매칭
          </li>
          <li>
            <code className="text-blue-600 dark:text-blue-400">useOnClickOutside</code>
            {' '}- 외부 클릭 감지
          </li>
          <li>
            <code className="text-blue-600 dark:text-blue-400">useAsync</code>
            {' '}- 비동기 작업 관리
          </li>
        </ul>
      </section>
    </div>
  );
}
