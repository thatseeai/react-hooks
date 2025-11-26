import { useState, useMemo } from 'react';
import { HookDemo } from '@/components/HookDemo';
import { CodeBlock } from '@/components/CodeBlock';

// 비용이 큰 계산 함수
function expensiveCalculation(num: number): number {
  console.log('비용이 큰 계산 실행 중...');
  let result = 0;
  for (let i = 0; i < 100000000; i++) {
    result += num;
  }
  return result;
}

// 필터링 함수
function filterItems(items: string[], searchTerm: string): string[] {
  console.log('필터링 실행 중...');
  return items.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

function UseMemoPage(): React.ReactElement {
  const [number, setNumber] = useState(1);
  const [counter, setCounter] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // useMemo를 사용하여 비용이 큰 계산 메모이제이션
  const expensiveResult = useMemo(() => {
    return expensiveCalculation(number);
  }, [number]);

  // useMemo 없이 매번 계산 (비교용) - 사용하지 않음

  // 아이템 목록
  const items = [
    'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry',
    'Fig', 'Grape', 'Honeydew', 'Kiwi', 'Lemon',
    'Mango', 'Orange', 'Papaya', 'Quince', 'Raspberry'
  ];

  // 필터링된 결과 메모이제이션
  const filteredItems = useMemo(() => {
    return filterItems(items, searchTerm);
  }, [searchTerm]);

  // 복잡한 객체 생성 메모이제이션
  const themeStyles = useMemo(() => {
    console.log('테마 스타일 계산 중...');
    return {
      backgroundColor: theme === 'light' ? '#ffffff' : '#1a1a1a',
      color: theme === 'light' ? '#000000' : '#ffffff',
      padding: '1rem',
      borderRadius: '0.5rem',
      border: theme === 'light' ? '1px solid #e5e7eb' : '1px solid #374151',
    };
  }, [theme]);

  const basicUsageCode = `import { useMemo } from 'react';

function expensiveCalculation(num: number): number {
  // 비용이 큰 계산...
  let result = 0;
  for (let i = 0; i < 100000000; i++) {
    result += num;
  }
  return result;
}

function Component({ number }: { number: number }) {
  // number가 변경될 때만 재계산
  const result = useMemo(() => {
    return expensiveCalculation(number);
  }, [number]);

  return <div>Result: {result}</div>;
}`;

  const filteringCode = `function Component() {
  const [searchTerm, setSearchTerm] = useState('');

  const items = ['Apple', 'Banana', 'Cherry', /* ... */];

  // searchTerm이 변경될 때만 필터링
  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </>
  );
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          useMemo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          계산 비용이 높은 값을 메모이제이션하는 React Hook
        </p>
        <div className="mt-2 flex items-center space-x-2 text-sm">
          <span className="rounded bg-blue-100 px-2 py-1 font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            React 16.8+
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600 dark:text-gray-400">성능 최적화</span>
        </div>
      </div>

      <HookDemo
        title="비용이 큰 계산 메모이제이션"
        description="useMemo를 사용하여 불필요한 재계산을 방지합니다"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Number (useMemo 사용): {number}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={number}
              onChange={(e) => setNumber(Number(e.target.value))}
              className="w-full"
            />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              결과: {expensiveResult}
            </p>
            <p className="text-xs text-gray-500">
              콘솔을 확인하세요 - number 변경 시에만 계산됩니다
            </p>
          </div>

          <div className="border-t pt-4">
            <p className="mb-2 text-sm font-medium">
              Counter (리렌더링 트리거용): {counter}
            </p>
            <button
              onClick={() => setCounter(counter + 1)}
              className="rounded bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700"
              type="button"
            >
              Counter 증가
            </button>
            <p className="mt-2 text-xs text-gray-500">
              이 버튼은 리렌더링만 발생시킵니다. useMemo 덕분에 재계산이 일어나지 않습니다.
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
        title="배열 필터링 메모이제이션"
        description="검색어가 변경될 때만 필터링이 실행됩니다"
        variant="info"
      >
        <div className="space-y-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="과일 이름을 검색하세요..."
            className="w-full rounded border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
          />
          <div>
            <p className="mb-2 text-sm font-medium">
              결과 ({filteredItems.length}개):
            </p>
            <ul className="space-y-1">
              {filteredItems.map((item) => (
                <li
                  key={item}
                  className="rounded bg-gray-100 px-3 py-2 dark:bg-gray-800"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </HookDemo>

      <CodeBlock
        code={filteringCode}
        title="배열 필터링"
        language="typescript"
      />

      <HookDemo
        title="객체 메모이제이션"
        description="스타일 객체를 메모이제이션하여 참조 동일성 유지"
      >
        <div className="space-y-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setTheme('light')}
              className={`rounded px-4 py-2 font-medium ${
                theme === 'light'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              type="button"
            >
              Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`rounded px-4 py-2 font-medium ${
                theme === 'dark'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              type="button"
            >
              Dark
            </button>
          </div>
          <div style={themeStyles}>
            <p>이 영역의 스타일은 메모이제이션되었습니다.</p>
            <p className="mt-2 text-sm opacity-75">
              테마가 변경될 때만 스타일 객체가 재생성됩니다.
            </p>
          </div>
        </div>
      </HookDemo>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          💡 useMemo 사용 시점
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• 계산 비용이 높은 연산 (복잡한 루프, 정렬, 필터링 등)</li>
          <li>• 참조 동일성이 중요한 경우 (의존성 배열, React.memo 등)</li>
          <li>• 큰 배열이나 객체의 변환</li>
          <li>• 매 렌더링마다 새 객체/배열을 생성하는 경우</li>
        </ul>
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-900 dark:bg-yellow-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ⚠️ 주의사항
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• 단순한 계산에는 useMemo를 사용하지 마세요 (오버헤드)</li>
          <li>• 의존성 배열을 올바르게 지정하세요</li>
          <li>• useMemo는 성능 최적화일 뿐 의미론적 보장이 아닙니다</li>
          <li>• 모든 값을 메모이제이션하지 마세요 - 필요한 곳에만 사용</li>
          <li>• 먼저 프로파일링으로 병목을 확인한 후 최적화하세요</li>
        </ul>
      </div>
    </div>
  );
}

export default UseMemoPage;
