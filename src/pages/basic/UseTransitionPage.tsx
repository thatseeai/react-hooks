import { useState, useTransition } from 'react';
import { HookDemo } from '@/components/HookDemo';
import { CodeBlock } from '@/components/CodeBlock';

// 느린 컴포넌트 시뮬레이션
function SlowList({ items }: { items: string[] }): React.ReactElement {
  const startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // 인위적인 지연
  }

  return (
    <ul className="space-y-1">
      {items.map((item, index) => (
        <li key={index} className="rounded bg-gray-100 px-3 py-2 text-sm dark:bg-gray-800">
          {item}
        </li>
      ))}
    </ul>
  );
}

function UseTransitionPage(): React.ReactElement {
  const [input, setInput] = useState('');
  const [list, setList] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const [tabIndex, setTabIndex] = useState(0);
  const [isTabPending, startTabTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const value = e.target.value;
    setInput(value);

    // 비긴급 업데이트를 transition으로 감싸기
    startTransition(() => {
      const newList = Array.from({ length: 100 }, (_, i) => `${value} - Item ${i + 1}`);
      setList(newList);
    });
  }

  function selectTab(index: number): void {
    startTabTransition(() => {
      setTabIndex(index);
    });
  }

  const tabs = ['About', 'Posts', 'Contact'];
  const tabContents = [
    '회사 소개 페이지입니다. 우리는 최고의 제품을 만듭니다.',
    '블로그 포스트 목록입니다. 여기에서 최신 소식을 확인하세요.',
    '연락처 정보입니다. 언제든지 문의해주세요.',
  ];

  const basicUsageCode = `import { useState, useTransition } from 'react';

function SearchPage() {
  const [input, setInput] = useState('');
  const [list, setList] = useState([]);
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    // 긴급 업데이트: 입력 필드는 즉시 업데이트
    setInput(e.target.value);

    // 비긴급 업데이트: 검색 결과는 transition
    startTransition(() => {
      const results = search(e.target.value);
      setList(results);
    });
  }

  return (
    <>
      <input value={input} onChange={handleChange} />
      {isPending && <Spinner />}
      <SearchResults results={list} />
    </>
  );
}`;

  const tabSwitchingCode = `function TabContainer() {
  const [tab, setTab] = useState('about');
  const [isPending, startTransition] = useTransition();

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <>
      <TabButton onClick={() => selectTab('about')}>
        About
      </TabButton>
      <TabButton onClick={() => selectTab('posts')}>
        Posts {isPending && <Spinner />}
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
    </>
  );
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          useTransition
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          UI를 블로킹하지 않고 상태를 업데이트할 수 있는 React Hook
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
        title="검색 입력 최적화"
        description="입력은 즉시 반영되고, 무거운 리스트 업데이트는 transition으로 처리"
      >
        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={input}
              onChange={handleChange}
              placeholder="검색어를 입력하세요..."
              className="w-full rounded border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
            />
            {isPending && (
              <p className="mt-2 text-sm text-blue-600">업데이트 중...</p>
            )}
          </div>

          <div className="max-h-60 overflow-y-auto">
            {list.length > 0 ? (
              <SlowList items={list.slice(0, 20)} />
            ) : (
              <p className="text-sm text-gray-500">검색어를 입력하면 결과가 표시됩니다</p>
            )}
          </div>

          <div className="rounded bg-blue-100 p-3 dark:bg-blue-900/30">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 입력 필드는 즉시 반응하고, 리스트 업데이트는 백그라운드에서 처리됩니다
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
        title="탭 전환 최적화"
        description="무거운 탭 컨텐츠를 transition으로 렌더링"
        variant="info"
      >
        <div className="space-y-4">
          <div className="flex space-x-2">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                onClick={() => selectTab(index)}
                disabled={isTabPending}
                className={`rounded px-4 py-2 font-medium transition-colors ${
                  tabIndex === index
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
                } disabled:opacity-50`}
                type="button"
              >
                {tab}
                {isTabPending && index === tabIndex && ' ⏳'}
              </button>
            ))}
          </div>

          <div className="rounded border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <p className={`${isTabPending ? 'opacity-50' : 'opacity-100'} transition-opacity`}>
              {tabContents[tabIndex]}
            </p>
          </div>
        </div>
      </HookDemo>

      <CodeBlock
        code={tabSwitchingCode}
        title="탭 전환 예제"
        language="typescript"
      />

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          💡 긴급 vs 비긴급 업데이트
        </h3>
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <strong>긴급 업데이트 (Urgent):</strong>
            <ul className="ml-4 mt-1 list-disc">
              <li>사용자 입력 (타이핑, 클릭 등)</li>
              <li>즉각적인 피드백이 필요한 작업</li>
              <li>일반적인 setState 사용</li>
            </ul>
          </div>
          <div>
            <strong>비긴급 업데이트 (Transition):</strong>
            <ul className="ml-4 mt-1 list-disc">
              <li>검색 결과 표시</li>
              <li>무거운 리스트 렌더링</li>
              <li>탭 전환, 페이지 전환</li>
              <li>startTransition으로 감싸기</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ✅ useTransition의 장점
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• UI가 블로킹되지 않고 응답성을 유지합니다</li>
          <li>• 사용자는 즉각적인 피드백을 받을 수 있습니다</li>
          <li>• isPending을 통해 로딩 상태를 표시할 수 있습니다</li>
          <li>• 더 빠른 업데이트가 들어오면 이전 업데이트를 중단합니다</li>
        </ul>
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-900 dark:bg-yellow-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ⚠️ 주의사항
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• startTransition에 전달하는 함수는 동기 함수여야 합니다</li>
          <li>• Transition 중인 상태를 읽으면 transition이 중단될 수 있습니다</li>
          <li>• 텍스트 입력 같은 긴급 업데이트는 transition으로 감싸지 마세요</li>
          <li>• Concurrent 모드를 지원하는 환경에서만 작동합니다</li>
        </ul>
      </div>
    </div>
  );
}

export default UseTransitionPage;
