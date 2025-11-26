import { useState, useCallback, memo } from 'react';
import { HookDemo } from '@/components/HookDemo';
import { CodeBlock } from '@/components/CodeBlock';

// 메모이제이션된 자식 컴포넌트
const Button = memo(function Button({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}): React.ReactElement {
  console.log(`${label} 버튼 렌더링`);
  return (
    <button
      onClick={onClick}
      className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      type="button"
    >
      {label}
    </button>
  );
});

// 리스트 아이템 컴포넌트
const ListItem = memo(function ListItem({
  item,
  onRemove,
}: {
  item: string;
  onRemove: (item: string) => void;
}): React.ReactElement {
  console.log(`ListItem ${item} 렌더링`);
  return (
    <li className="flex items-center justify-between rounded bg-gray-100 px-4 py-2 dark:bg-gray-800">
      <span>{item}</span>
      <button
        onClick={() => onRemove(item)}
        className="text-red-600 hover:text-red-800"
        type="button"
      >
        삭제
      </button>
    </li>
  );
});

function UseCallbackPage(): React.ReactElement {
  const [count, setCount] = useState(0);
  const [otherCount, setOtherCount] = useState(0);
  const [items, setItems] = useState(['사과', '바나나', '체리']);
  const [newItem, setNewItem] = useState('');

  // useCallback으로 메모이제이션된 함수
  const increment = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  // useCallback 없이 생성된 함수 (매번 새로 생성)
  const incrementWithoutCallback = () => {
    setOtherCount((c) => c + 1);
  };

  // 아이템 제거 함수
  const removeItem = useCallback((item: string) => {
    setItems((prevItems) => prevItems.filter((i) => i !== item));
  }, []);

  // 아이템 추가 함수
  const addItem = useCallback(() => {
    if (newItem.trim()) {
      setItems((prevItems) => [...prevItems, newItem]);
      setNewItem('');
    }
  }, [newItem]);

  const basicUsageCode = `import { useState, useCallback, memo } from 'react';

const Button = memo(function Button({ onClick }: { onClick: () => void }) {
  console.log('Button 렌더링');
  return <button onClick={onClick}>Click</button>;
});

function Parent() {
  const [count, setCount] = useState(0);

  // 함수가 메모이제이션됨
  const handleClick = useCallback(() => {
    setCount((c) => c + 1);
  }, []); // 의존성 배열이 비어있으므로 함수는 변경되지 않음

  return (
    <>
      <p>Count: {count}</p>
      <Button onClick={handleClick} />
    </>
  );
}`;

  const withDependencyCode = `function Component({ userId }: { userId: string }) {
  const [data, setData] = useState(null);

  // userId가 변경될 때만 함수가 재생성됨
  const fetchData = useCallback(async () => {
    const response = await fetch(\`/api/user/\${userId}\`);
    const json = await response.json();
    setData(json);
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return <div>{/* ... */}</div>;
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          useCallback
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          함수를 메모이제이션하여 불필요한 재생성을 방지하는 React Hook
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
        title="자식 컴포넌트 리렌더링 방지"
        description="useCallback과 React.memo를 함께 사용하여 최적화"
      >
        <div className="space-y-4">
          <div className="rounded bg-gray-100 p-4 dark:bg-gray-800">
            <p className="mb-2 text-sm font-medium">
              Count (useCallback 사용): {count}
            </p>
            <Button onClick={increment} label="Increment (useCallback)" />
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              콘솔 확인: 버튼 컴포넌트가 리렌더링되지 않습니다
            </p>
          </div>

          <div className="rounded bg-gray-100 p-4 dark:bg-gray-800">
            <p className="mb-2 text-sm font-medium">
              Other Count (useCallback 미사용): {otherCount}
            </p>
            <Button
              onClick={incrementWithoutCallback}
              label="Increment (without useCallback)"
            />
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              콘솔 확인: 매번 새로운 함수가 생성되어 버튼이 리렌더링됩니다
            </p>
          </div>

          <div className="rounded bg-yellow-100 p-3 dark:bg-yellow-900/30">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              💡 콘솔을 열어서 렌더링 로그를 확인해보세요!
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
        title="리스트 아이템 관리"
        description="각 아이템의 삭제 핸들러를 메모이제이션"
        variant="info"
      >
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
              placeholder="새 항목..."
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
            {items.map((item) => (
              <ListItem key={item} item={item} onRemove={removeItem} />
            ))}
          </ul>

          <p className="text-xs text-gray-600 dark:text-gray-400">
            콘솔 확인: 아이템을 추가하거나 삭제할 때 변경된 아이템만 리렌더링됩니다
          </p>
        </div>
      </HookDemo>

      <CodeBlock
        code={withDependencyCode}
        title="의존성이 있는 useCallback"
        language="typescript"
      />

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          💡 useCallback vs useMemo
        </h3>
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <strong>useCallback:</strong>
            <pre className="mt-1 rounded bg-gray-800 p-2 text-xs text-gray-100">
              {`useCallback(fn, deps) === useMemo(() => fn, deps)`}
            </pre>
            <p className="mt-1">함수 자체를 메모이제이션</p>
          </div>
          <div>
            <strong>useMemo:</strong>
            <pre className="mt-1 rounded bg-gray-800 p-2 text-xs text-gray-100">
              {`useMemo(() => computeValue(), deps)`}
            </pre>
            <p className="mt-1">함수의 반환값을 메모이제이션</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ✅ useCallback 사용 시점
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• React.memo로 감싼 자식 컴포넌트에 props로 전달할 때</li>
          <li>• useEffect의 의존성 배열에 포함될 때</li>
          <li>• 커스텀 Hook에서 함수를 반환할 때</li>
          <li>• 컨텍스트 값으로 함수를 제공할 때</li>
        </ul>
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-900 dark:bg-yellow-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ⚠️ 주의사항
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• 모든 함수에 useCallback을 사용하지 마세요 (불필요한 오버헤드)</li>
          <li>• 자식 컴포넌트가 React.memo로 감싸지지 않았다면 효과가 없습니다</li>
          <li>• 의존성 배열을 정확하게 지정하세요</li>
          <li>• 인라인 함수 자체는 성능 문제가 아닙니다 - 최적화가 필요한 경우에만 사용</li>
          <li>• ESLint의 exhaustive-deps 규칙을 따르세요</li>
        </ul>
      </div>
    </div>
  );
}

export default UseCallbackPage;
