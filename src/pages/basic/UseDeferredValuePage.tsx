import { useState, useDeferredValue, memo } from 'react';
import { HookDemo } from '@/components/HookDemo';
import { CodeBlock } from '@/components/CodeBlock';

// 무거운 리스트 컴포넌트
const SlowList = memo(function SlowList({ text }: { text: string }): React.ReactElement {
  const items = Array.from({ length: 250 }, (_, i) => `${text} - ${i + 1}`);

  return (
    <ul className="max-h-60 space-y-1 overflow-y-auto">
      {items.map((item, i) => (
        <li key={i} className="rounded bg-gray-100 px-3 py-2 text-sm dark:bg-gray-800">
          {item}
        </li>
      ))}
    </ul>
  );
});

function UseDeferredValuePage(): React.ReactElement {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  const isStale = text !== deferredText;

  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  // 검색 결과 필터링
  const allItems = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);
  const filteredItems = allItems.filter((item) =>
    item.toLowerCase().includes(deferredQuery.toLowerCase())
  );

  const basicUsageCode = `import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  // deferredQuery는 query보다 "뒤처질" 수 있음
  return (
    <>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <SearchResults query={deferredQuery} />
    </>
  );
}`;

  const withMemoCode = `import { memo } from 'react';

// 무거운 컴포넌트를 memo로 감싸기
const SlowList = memo(function SlowList({ text }) {
  // ... 무거운 렌더링 로직
  return <ul>{/* ... */}</ul>;
});

function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);

  return (
    <>
      {/* 입력은 즉시 업데이트 */}
      <input value={text} onChange={(e) => setText(e.target.value)} />

      {/* SlowList는 deferredText가 변경될 때만 리렌더링 */}
      <SlowList text={deferredText} />
    </>
  );
}`;

  const staleIndicatorCode = `function Component() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);

  // text와 deferredText가 다르면 업데이트 중
  const isStale = text !== deferredText;

  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <div style={{ opacity: isStale ? 0.5 : 1 }}>
        <Results query={deferredText} />
      </div>
    </>
  );
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          useDeferredValue
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          UI의 일부 업데이트를 지연시킬 수 있는 React Hook
        </p>
        <div className="mt-2 flex items-center space-x-2 text-sm">
          <span className="rounded bg-blue-100 px-2 py-1 font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            React 18+
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600 dark:text-gray-400">성능 최적화</span>
        </div>
      </div>

      <HookDemo
        title="입력 지연 처리"
        description="입력 필드는 즉시 업데이트되고, 무거운 리스트는 지연 렌더링됩니다"
      >
        <div className="space-y-4">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="텍스트를 입력하세요..."
            className="w-full rounded border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
          />

          <div className="flex items-center space-x-4 text-sm">
            <div>
              <strong>현재 값:</strong> {text || '(없음)'}
            </div>
            <div>
              <strong>지연된 값:</strong> {deferredText || '(없음)'}
            </div>
            {isStale && (
              <span className="rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                업데이트 중
              </span>
            )}
          </div>

          <div className={`transition-opacity ${isStale ? 'opacity-50' : 'opacity-100'}`}>
            {deferredText ? (
              <SlowList text={deferredText} />
            ) : (
              <p className="text-sm text-gray-500">텍스트를 입력하면 리스트가 표시됩니다</p>
            )}
          </div>

          <div className="rounded bg-blue-100 p-3 dark:bg-blue-900/30">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 입력하는 동안 UI가 부드럽게 유지됩니다
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
        title="검색 필터링"
        description="실시간 검색에서 입력 응답성 유지"
        variant="info"
      >
        <div className="space-y-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색어를 입력하세요..."
            className="w-full rounded border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
          />

          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredItems.length}개의 결과 찾음
            {query !== deferredQuery && ' (검색 중...)'}
          </div>

          <div className="max-h-60 space-y-1 overflow-y-auto">
            {filteredItems.map((item) => (
              <div
                key={item}
                className="rounded bg-gray-100 px-3 py-2 text-sm dark:bg-gray-800"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </HookDemo>

      <CodeBlock
        code={withMemoCode}
        title="React.memo와 함께 사용"
        language="typescript"
      />

      <CodeBlock
        code={staleIndicatorCode}
        title="업데이트 상태 표시"
        language="typescript"
      />

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          💡 useDeferredValue vs useTransition
        </h3>
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <strong>useDeferredValue:</strong>
            <ul className="ml-4 mt-1 list-disc">
              <li>값 자체를 지연시킴</li>
              <li>상태 업데이트 코드를 변경할 수 없을 때 사용</li>
              <li>서드파티 라이브러리와 함께 사용하기 좋음</li>
            </ul>
          </div>
          <div>
            <strong>useTransition:</strong>
            <ul className="ml-4 mt-1 list-disc">
              <li>상태 업데이트 자체를 transition으로 표시</li>
              <li>상태 업데이트 코드를 직접 제어할 수 있을 때 사용</li>
              <li>isPending 플래그 제공</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ✅ 사용 사례
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• 실시간 검색 필터링</li>
          <li>• 자동완성 입력</li>
          <li>• 대용량 리스트 렌더링</li>
          <li>• 무거운 차트나 그래프 업데이트</li>
          <li>• 서드파티 컴포넌트 최적화</li>
        </ul>
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-900 dark:bg-yellow-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ⚠️ 주의사항
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• 지연된 값을 받는 컴포넌트는 React.memo로 감싸야 효과적입니다</li>
          <li>• 원시 값(문자열, 숫자 등)에만 사용하세요</li>
          <li>• 객체를 전달하면 매번 새로 생성되어 최적화가 무효화됩니다</li>
          <li>• Concurrent 모드를 지원하는 환경에서만 작동합니다</li>
        </ul>
      </div>
    </div>
  );
}

export default UseDeferredValuePage;
