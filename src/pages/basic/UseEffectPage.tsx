import { useState, useEffect } from 'react';
import { HookDemo } from '@/components/HookDemo';
import { CodeBlock } from '@/components/CodeBlock';

function UseEffectPage(): React.ReactElement {
  const [count, setCount] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [data, setData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  // 기본 useEffect - count가 변경될 때마다 실행
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  // 타이머 효과 - cleanup 함수 예제
  useEffect(() => {
    let intervalId: number | undefined;

    if (isRunning) {
      intervalId = window.setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning]);

  // 윈도우 리사이즈 이벤트 리스너
  useEffect(() => {
    function handleResize(): void {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 비동기 데이터 페칭
  async function fetchData(): Promise<void> {
    setIsLoading(true);
    setData(null);

    // 실제로는 API 호출
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setData(`데이터가 로드되었습니다! (${new Date().toLocaleTimeString()})`);
    setIsLoading(false);
  }

  const basicUsageCode = `import { useState, useEffect } from 'react';

function Component() {
  const [count, setCount] = useState(0);

  // count가 변경될 때마다 실행
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]); // 의존성 배열

  return (
    <button onClick={() => setCount(count + 1)}>
      Increment
    </button>
  );
}`;

  const cleanupCode = `useEffect(() => {
  // 타이머 시작
  const intervalId = setInterval(() => {
    console.log('Tick');
  }, 1000);

  // Cleanup 함수
  return () => {
    clearInterval(intervalId);
  };
}, []); // 빈 배열 = 마운트 시에만 실행`;

  const eventListenerCode = `useEffect(() => {
  function handleResize() {
    console.log('Window resized');
  }

  // 이벤트 리스너 등록
  window.addEventListener('resize', handleResize);

  // Cleanup: 이벤트 리스너 제거
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []); // 마운트/언마운트 시에만`;

  const asyncCode = `useEffect(() => {
  let cancelled = false;

  async function fetchData() {
    const response = await fetch('/api/data');
    const data = await response.json();

    // 컴포넌트가 언마운트되지 않았을 때만 상태 업데이트
    if (!cancelled) {
      setData(data);
    }
  }

  fetchData();

  return () => {
    cancelled = true; // Cleanup
  };
}, []); // 마운트 시에만`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          useEffect
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          컴포넌트를 외부 시스템과 동기화하는 React Hook
        </p>
        <div className="mt-2 flex items-center space-x-2 text-sm">
          <span className="rounded bg-blue-100 px-2 py-1 font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            React 16.8+
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600 dark:text-gray-400">부수 효과</span>
        </div>
      </div>

      <HookDemo
        title="기본 사용법 - 문서 타이틀 변경"
        description="count가 변경될 때마다 문서 제목이 업데이트됩니다"
      >
        <div className="space-y-4">
          <p className="text-lg">
            Count: <strong>{count}</strong>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            현재 문서 제목: "Count: {count}"
          </p>
          <button
            onClick={() => setCount(count + 1)}
            className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            type="button"
          >
            Increment
          </button>
        </div>
      </HookDemo>

      <CodeBlock
        code={basicUsageCode}
        title="기본 사용법"
        language="typescript"
      />

      <HookDemo
        title="Cleanup 함수 - 타이머"
        description="setInterval을 사용하고 cleanup 함수에서 정리합니다"
        variant="info"
      >
        <div className="space-y-4">
          <p className="text-3xl font-bold">
            {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`rounded px-4 py-2 font-medium text-white ${
                isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              }`}
              type="button"
            >
              {isRunning ? '정지' : '시작'}
            </button>
            <button
              onClick={() => {
                setSeconds(0);
                setIsRunning(false);
              }}
              className="rounded bg-gray-600 px-4 py-2 font-medium text-white hover:bg-gray-700"
              type="button"
            >
              리셋
            </button>
          </div>
        </div>
      </HookDemo>

      <CodeBlock
        code={cleanupCode}
        title="Cleanup 함수"
        language="typescript"
      />

      <HookDemo
        title="이벤트 리스너"
        description="윈도우 리사이즈 이벤트를 추적합니다"
      >
        <div>
          <p className="text-lg">
            현재 윈도우 너비: <strong>{windowWidth}px</strong>
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            브라우저 창 크기를 조절해보세요
          </p>
        </div>
      </HookDemo>

      <CodeBlock
        code={eventListenerCode}
        title="이벤트 리스너 등록 및 정리"
        language="typescript"
      />

      <HookDemo
        title="비동기 데이터 페칭"
        description="비동기 작업을 useEffect에서 수행하는 예제"
        variant="success"
      >
        <div className="space-y-4">
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="rounded bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700 disabled:opacity-50"
            type="button"
          >
            {isLoading ? '로딩 중...' : '데이터 가져오기'}
          </button>
          {data && (
            <div className="rounded bg-green-100 p-4 dark:bg-green-900">
              <p className="text-sm text-green-800 dark:text-green-200">{data}</p>
            </div>
          )}
        </div>
      </HookDemo>

      <CodeBlock
        code={asyncCode}
        title="비동기 작업 처리"
        language="typescript"
      />

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          💡 의존성 배열
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• <code>[]</code>: 마운트 시에만 실행</li>
          <li>• <code>[dep1, dep2]</code>: dep1 또는 dep2가 변경될 때 실행</li>
          <li>• <code>생략</code>: 매 렌더링마다 실행 (권장하지 않음)</li>
          <li>• Effect 내부에서 사용하는 모든 반응형 값을 의존성 배열에 포함해야 합니다</li>
        </ul>
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-900 dark:bg-yellow-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ⚠️ 주의사항
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• Effect 내부에서 사용하는 모든 props와 state를 의존성 배열에 포함하세요</li>
          <li>• Effect는 동기적으로 실행되지 않습니다 (화면 업데이트 후 실행)</li>
          <li>• Effect 내부에서 직접 async 함수를 사용할 수 없습니다</li>
          <li>• Cleanup 함수는 컴포넌트 언마운트 시와 Effect 재실행 전에 호출됩니다</li>
          <li>• 무한 루프 주의: Effect에서 상태를 변경하고 그 상태가 의존성 배열에 있으면 무한 루프 발생</li>
        </ul>
      </div>
    </div>
  );
}

export default UseEffectPage;
