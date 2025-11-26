import { useState, useRef, useEffect } from 'react';
import { HookDemo } from '@/components/HookDemo';
import { CodeBlock } from '@/components/CodeBlock';

function UseRefPage(): React.ReactElement {
  const [count, setCount] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const renderCount = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousValue = useRef<string>('');

  // 렌더링 횟수 카운트 (리렌더링을 발생시키지 않음)
  useEffect(() => {
    renderCount.current += 1;
  });

  // input value 변경 추적
  useEffect(() => {
    previousValue.current = inputValue;
  }, [inputValue]);

  function focusInput(): void {
    inputRef.current?.focus();
  }

  const basicUsageCode = `import { useRef } from 'react';

function Component() {
  // DOM 요소에 대한 참조
  const inputRef = useRef<HTMLInputElement>(null);

  function focusInput() {
    inputRef.current?.focus();
  }

  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus Input</button>
    </>
  );
}`;

  const mutableValueCode = `function Component() {
  const renderCount = useRef(0);

  useEffect(() => {
    // 렌더링 횟수를 추적 (리렌더링 발생 안 함)
    renderCount.current += 1;
  });

  return <div>Renders: {renderCount.current}</div>;
}`;

  const previousValueCode = `function Component() {
  const [value, setValue] = useState('');
  const previousValue = useRef('');

  useEffect(() => {
    // 이전 값을 저장
    previousValue.current = value;
  }, [value]);

  return (
    <div>
      <p>현재 값: {value}</p>
      <p>이전 값: {previousValue.current}</p>
    </div>
  );
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          useRef
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          렌더링에 필요하지 않은 값을 참조할 수 있는 React Hook
        </p>
        <div className="mt-2 flex items-center space-x-2 text-sm">
          <span className="rounded bg-blue-100 px-2 py-1 font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            React 16.8+
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600 dark:text-gray-400">DOM 접근</span>
        </div>
      </div>

      <HookDemo
        title="DOM 요소 접근 - Input Focus"
        description="ref를 사용하여 DOM 요소에 직접 접근합니다"
      >
        <div className="space-y-4">
          <input
            ref={inputRef}
            type="text"
            className="w-full rounded border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
            placeholder="여기를 클릭하거나 버튼을 눌러보세요"
          />
          <button
            onClick={focusInput}
            className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            type="button"
          >
            Input에 포커스
          </button>
        </div>
      </HookDemo>

      <CodeBlock
        code={basicUsageCode}
        title="기본 사용법 - DOM 참조"
        language="typescript"
      />

      <HookDemo
        title="가변 값 저장 - 렌더링 횟수 추적"
        description="ref.current 변경은 리렌더링을 트리거하지 않습니다"
        variant="info"
      >
        <div className="space-y-4">
          <p className="text-lg">
            렌더링 횟수: <strong>{renderCount.current}</strong>
          </p>
          <p className="text-lg">
            Count: <strong>{count}</strong>
          </p>
          <button
            onClick={() => setCount(count + 1)}
            className="rounded bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700"
            type="button"
          >
            Count 증가 (리렌더링 발생)
          </button>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            버튼을 클릭할 때마다 렌더링 횟수가 증가합니다
          </p>
        </div>
      </HookDemo>

      <CodeBlock
        code={mutableValueCode}
        title="가변 값 저장"
        language="typescript"
      />

      <HookDemo
        title="이전 값 추적"
        description="useRef로 이전 상태 값을 저장합니다"
      >
        <div className="space-y-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full rounded border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
            placeholder="텍스트를 입력하세요"
          />
          <div className="space-y-2 text-sm">
            <p>
              <strong>현재 값:</strong> {inputValue || '(없음)'}
            </p>
            <p>
              <strong>이전 값:</strong> {previousValue.current || '(없음)'}
            </p>
          </div>
        </div>
      </HookDemo>

      <CodeBlock
        code={previousValueCode}
        title="이전 값 추적"
        language="typescript"
      />

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          💡 useRef vs useState
        </h3>
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <strong>useRef:</strong>
            <ul className="ml-4 mt-1 list-disc space-y-1">
              <li>값 변경 시 리렌더링이 발생하지 않음</li>
              <li>컴포넌트 생명주기 동안 값이 유지됨</li>
              <li>DOM 요소 접근, 타이머 ID 저장 등에 사용</li>
            </ul>
          </div>
          <div>
            <strong>useState:</strong>
            <ul className="ml-4 mt-1 list-disc space-y-1">
              <li>값 변경 시 리렌더링이 발생함</li>
              <li>UI에 반영되어야 하는 데이터에 사용</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-900 dark:bg-yellow-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ⚠️ 주의사항
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• ref.current를 렌더링 중에 읽거나 쓰지 마세요</li>
          <li>• ref는 일반 JavaScript 객체이므로 변경 감지가 되지 않습니다</li>
          <li>• DOM 조작은 최후의 수단으로만 사용하세요</li>
          <li>• ref.current는 초기 렌더링 시 null일 수 있으므로 옵셔널 체이닝을 사용하세요</li>
        </ul>
      </div>
    </div>
  );
}

export default UseRefPage;
