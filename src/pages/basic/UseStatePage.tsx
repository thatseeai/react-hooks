import { useState } from 'react';
import { HookDemo } from '@/components/HookDemo';
import { CodeBlock } from '@/components/CodeBlock';

function UseStatePage(): React.ReactElement {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');

  function increment(): void {
    setCount(count + 1);
  }

  function incrementByTen(): void {
    // 함수형 업데이트 사용
    setCount((prevCount) => prevCount + 10);
  }

  function addItem(): void {
    if (newItem.trim()) {
      setItems((prevItems) => [...prevItems, newItem]);
      setNewItem('');
    }
  }

  function removeItem(index: number): void {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  }

  const basicUsageCode = `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`;

  const functionalUpdateCode = `// 함수형 업데이트 패턴
function Counter() {
  const [count, setCount] = useState(0);

  function incrementByTen() {
    // 이전 상태를 기반으로 업데이트
    setCount((prevCount) => prevCount + 10);
  }

  return (
    <button onClick={incrementByTen}>
      Add 10
    </button>
  );
}`;

  const arrayStateCode = `function TodoList() {
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');

  function addItem() {
    if (newItem.trim()) {
      // 불변성 유지: 새 배열 생성
      setItems((prevItems) => [...prevItems, newItem]);
      setNewItem('');
    }
  }

  function removeItem(index: number) {
    setItems((prevItems) =>
      prevItems.filter((_, i) => i !== index)
    );
  }

  return (/* ... */);
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          useState
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          컴포넌트에 상태 변수를 추가할 수 있는 React Hook
        </p>
        <div className="mt-2 flex items-center space-x-2 text-sm">
          <span className="rounded bg-blue-100 px-2 py-1 font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            React 16.8+
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600 dark:text-gray-400">상태 관리</span>
        </div>
      </div>

      <HookDemo
        title="기본 카운터"
        description="가장 기본적인 useState 사용 예제"
      >
        <div className="flex items-center space-x-4">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Count: {count}
          </p>
          <button
            onClick={increment}
            className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            type="button"
          >
            +1
          </button>
          <button
            onClick={() => setCount(count - 1)}
            className="rounded bg-gray-600 px-4 py-2 font-medium text-white hover:bg-gray-700"
            type="button"
          >
            -1
          </button>
          <button
            onClick={() => setCount(0)}
            className="rounded bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
            type="button"
          >
            Reset
          </button>
        </div>
      </HookDemo>

      <CodeBlock
        code={basicUsageCode}
        title="기본 사용법"
        language="typescript"
      />

      <HookDemo
        title="텍스트 입력 상태"
        description="문자열 상태를 관리하는 예제"
      >
        <div className="space-y-4">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="텍스트를 입력하세요..."
            className="w-full rounded border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
          />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            입력한 텍스트: <span className="font-medium">{text || '(없음)'}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            글자 수: <span className="font-medium">{text.length}</span>
          </p>
        </div>
      </HookDemo>

      <HookDemo
        title="함수형 업데이트"
        description="이전 상태를 기반으로 새 상태를 계산하는 패턴"
        variant="info"
      >
        <div className="flex items-center space-x-4">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Count: {count}
          </p>
          <button
            onClick={incrementByTen}
            className="rounded bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700"
            type="button"
          >
            +10 (함수형 업데이트)
          </button>
        </div>
      </HookDemo>

      <CodeBlock
        code={functionalUpdateCode}
        title="함수형 업데이트 패턴"
        language="typescript"
      />

      <HookDemo
        title="배열 상태 관리"
        description="불변성을 유지하면서 배열 상태를 업데이트하는 예제"
      >
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
              placeholder="항목을 입력하세요..."
              className="flex-1 rounded border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
            />
            <button
              onClick={addItem}
              className="rounded bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
              type="button"
            >
              추가
            </button>
          </div>
          <ul className="space-y-2">
            {items.length === 0 ? (
              <li className="text-sm text-gray-500">항목이 없습니다</li>
            ) : (
              items.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between rounded bg-gray-100 px-4 py-2 dark:bg-gray-800"
                >
                  <span>{item}</span>
                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400"
                    type="button"
                  >
                    삭제
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </HookDemo>

      <CodeBlock
        code={arrayStateCode}
        title="배열 상태 관리"
        language="typescript"
      />

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-900 dark:bg-yellow-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ⚠️ 주의사항
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• setState는 비동기적으로 동작합니다</li>
          <li>• 객체나 배열 상태는 반드시 불변성을 유지해야 합니다</li>
          <li>• 함수형 업데이트는 이전 상태에 의존할 때 사용하세요</li>
          <li>• 초기 상태 계산이 비용이 크다면 함수를 전달하세요</li>
        </ul>
      </div>
    </div>
  );
}

export default UseStatePage;
