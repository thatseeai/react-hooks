import { use, useState, Suspense, createContext } from 'react';
import { HookDemo } from '@/components/HookDemo';
import { CodeBlock } from '@/components/CodeBlock';

// Promise 예제용 데이터 페칭 함수
async function fetchUser(userId: number): Promise<{ id: number; name: string; email: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return {
    id: userId,
    name: `사용자 ${userId}`,
    email: `user${userId}@example.com`,
  };
}

// Context 예제
const MessageContext = createContext<string>('기본 메시지');

// use Hook으로 Promise 읽기
function UserProfile({ userPromise }: { userPromise: Promise<{ id: number; name: string; email: string }> }) {
  const user = use(userPromise);

  return (
    <div className="rounded border border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-2 font-semibold">{user.name}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
    </div>
  );
}

// use Hook으로 Context 읽기
function MessageDisplay() {
  const message = use(MessageContext);
  return (
    <div className="rounded bg-blue-100 p-3 dark:bg-blue-900/30">
      <p className="text-sm">{message}</p>
    </div>
  );
}

// 조건부 데이터 페칭 예제
function ConditionalFetch({ shouldFetch, promise }: { shouldFetch: boolean; promise: Promise<{ id: number; name: string; email: string }> }) {
  // use Hook은 조건부로 호출 가능! (다른 Hook과 다른 점)
  if (!shouldFetch) {
    return <div className="text-gray-500">데이터를 불러오지 않음</div>;
  }

  const data = use(promise);
  return <div className="text-green-600">불러온 데이터: {data.name}</div>;
}

function UsePage(): React.ReactElement {
  const [userId, setUserId] = useState(1);
  const [showUser, setShowUser] = useState(false);
  const [showConditional, setShowConditional] = useState(false);
  const [customMessage, setCustomMessage] = useState('안녕하세요! use Hook 테스트입니다.');

  const basicUsageCode = `import { use, Suspense } from 'react';

function UserProfile({ userPromise }) {
  // Promise에서 데이터 읽기
  const user = use(userPromise);

  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}

function App() {
  const userPromise = fetchUser(1);

  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  );
}`;

  const contextUsageCode = `import { use, createContext } from 'react';

const ThemeContext = createContext('light');

function Button() {
  // Context 값 읽기
  const theme = use(ThemeContext);

  return (
    <button className={theme}>
      버튼
    </button>
  );
}

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Button />
    </ThemeContext.Provider>
  );
}`;

  const conditionalUsageCode = `function Component({ shouldFetch, dataPromise }) {
  // ✅ use Hook은 조건부 호출 가능! (다른 Hook과 다름)
  if (!shouldFetch) {
    return <div>데이터를 불러오지 않음</div>;
  }

  const data = use(dataPromise);
  return <div>{data.title}</div>;
}

// ❌ 다른 Hook들은 조건부 호출 불가
function BadExample({ show }) {
  if (show) {
    const [value, setValue] = useState(0); // Error!
  }
}`;

  const multiplePromisesCode = `function Dashboard() {
  const userPromise = fetchUser();
  const postsPromise = fetchPosts();

  return (
    <div>
      <Suspense fallback={<div>사용자 로딩 중...</div>}>
        <UserInfo userPromise={userPromise} />
      </Suspense>

      <Suspense fallback={<div>게시물 로딩 중...</div>}>
        <PostsList postsPromise={postsPromise} />
      </Suspense>
    </div>
  );
}

function UserInfo({ userPromise }) {
  const user = use(userPromise);
  return <div>{user.name}</div>;
}

function PostsList({ postsPromise }) {
  const posts = use(postsPromise);
  return posts.map(post => <div key={post.id}>{post.title}</div>);
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          use
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Promise와 Context를 읽는 React 19 Hook
        </p>
        <div className="mt-2 flex items-center space-x-2 text-sm">
          <span className="rounded bg-green-100 px-2 py-1 font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
            React 19+
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600 dark:text-gray-400">신규 Hook</span>
        </div>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          🌟 use Hook의 특별한 점
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• <strong>조건부 호출 가능:</strong> if문, 반복문 내에서 호출 가능 (다른 Hook과 다름!)</li>
          <li>• <strong>Promise 읽기:</strong> async/await 없이 Promise 값을 읽을 수 있음</li>
          <li>• <strong>Context 읽기:</strong> useContext의 대체 가능</li>
          <li>• <strong>Suspense 통합:</strong> 자동으로 Suspense와 함께 작동</li>
        </ul>
      </div>

      <HookDemo
        title="Promise로 데이터 페칭"
        description="use Hook으로 Promise를 읽어 사용자 정보를 표시합니다"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">사용자 ID:</label>
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(Number(e.target.value))}
              min="1"
              max="10"
              className="w-20 rounded border border-gray-300 px-3 py-1 dark:border-gray-700 dark:bg-gray-800"
            />
            <button
              onClick={() => setShowUser(!showUser)}
              className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
              type="button"
            >
              {showUser ? '숨기기' : '불러오기'}
            </button>
          </div>

          {showUser && (
            <Suspense fallback={<div className="text-gray-500">사용자 정보 로딩 중...</div>}>
              <UserProfile userPromise={fetchUser(userId)} />
            </Suspense>
          )}

          <p className="text-xs text-gray-600 dark:text-gray-400">
            💡 Suspense가 로딩 상태를 자동으로 처리합니다
          </p>
        </div>
      </HookDemo>

      <CodeBlock
        code={basicUsageCode}
        title="Promise 사용 예제"
        language="typescript"
      />

      <HookDemo
        title="Context 읽기"
        description="use Hook으로 Context 값을 읽습니다"
        variant="info"
      >
        <div className="space-y-4">
          <input
            type="text"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="메시지를 입력하세요"
            className="w-full rounded border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
          />

          <MessageContext.Provider value={customMessage}>
            <MessageDisplay />
          </MessageContext.Provider>

          <p className="text-xs text-gray-600 dark:text-gray-400">
            💡 use(Context)는 useContext(Context)와 동일하게 작동합니다
          </p>
        </div>
      </HookDemo>

      <CodeBlock
        code={contextUsageCode}
        title="Context 사용 예제"
        language="typescript"
      />

      <HookDemo
        title="조건부 데이터 페칭"
        description="use Hook은 조건부로 호출할 수 있습니다 (다른 Hook과 다른 점!)"
      >
        <div className="space-y-4">
          <button
            onClick={() => setShowConditional(!showConditional)}
            className="rounded bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700"
            type="button"
          >
            {showConditional ? '조건 OFF' : '조건 ON'}
          </button>

          <Suspense fallback={<div className="text-gray-500">로딩 중...</div>}>
            <ConditionalFetch
              shouldFetch={showConditional}
              promise={fetchUser(1)}
            />
          </Suspense>

          <div className="rounded bg-yellow-100 p-3 dark:bg-yellow-900/30">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ 다른 Hook들(useState, useEffect 등)은 조건부로 호출할 수 없지만,
              <br />
              use Hook은 조건문 내에서 호출 가능합니다!
            </p>
          </div>
        </div>
      </HookDemo>

      <CodeBlock
        code={conditionalUsageCode}
        title="조건부 호출 예제"
        language="typescript"
      />

      <CodeBlock
        code={multiplePromisesCode}
        title="여러 Promise 동시 처리"
        language="typescript"
      />

      <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ✅ use Hook의 장점
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• async/await 없이 Promise 값을 읽을 수 있음</li>
          <li>• Suspense와 자동으로 통합되어 로딩 상태 처리 간단</li>
          <li>• 조건부 데이터 페칭 가능 (다른 Hook 불가)</li>
          <li>• 반복문에서도 사용 가능</li>
          <li>• useContext를 대체할 수 있음</li>
          <li>• 더 나은 타입 추론 (TypeScript)</li>
        </ul>
      </div>

      <div className="rounded-lg border border-purple-200 bg-purple-50 p-6 dark:border-purple-900 dark:bg-purple-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          🎯 사용 사례
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• <strong>데이터 페칭:</strong> 서버 컴포넌트와 함께 사용</li>
          <li>• <strong>조건부 로딩:</strong> 특정 조건에서만 데이터 로드</li>
          <li>• <strong>병렬 데이터 페칭:</strong> 여러 Promise를 독립적으로 처리</li>
          <li>• <strong>Context 읽기:</strong> useContext 대신 사용</li>
          <li>• <strong>리스트 렌더링:</strong> map 내부에서 Promise 읽기</li>
        </ul>
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-900 dark:bg-yellow-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ⚠️ 주의사항
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• use Hook은 반드시 Suspense 경계 내부에서 사용해야 합니다</li>
          <li>• Promise는 컴포넌트 외부에서 생성하거나 메모이제이션 필요</li>
          <li>• 컴포넌트 내부에서 Promise 생성 시 무한 렌더링 발생 가능</li>
          <li>• 에러 처리는 Error Boundary로 해야 합니다</li>
          <li>• React 19 이상에서만 사용 가능합니다</li>
        </ul>
      </div>

      <div className="rounded-lg border border-orange-200 bg-orange-50 p-6 dark:border-orange-900 dark:bg-orange-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          🆚 use vs 다른 Hook들
        </h3>
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <strong>use vs useContext:</strong>
            <br />
            동일하게 작동하지만, use는 조건부 호출 가능
          </div>
          <div>
            <strong>use vs useEffect + setState:</strong>
            <br />
            use는 Suspense와 자동 통합, 로딩 상태 관리 불필요
          </div>
          <div>
            <strong>use vs async/await:</strong>
            <br />
            use는 컴포넌트 렌더링 중 사용 가능, async/await는 불가
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          🚫 잘못된 사용 예제
        </h3>
        <pre className="mt-2 overflow-x-auto rounded bg-gray-800 p-3 text-xs text-gray-200">
{`// ❌ 컴포넌트 내부에서 Promise 생성 (무한 렌더링!)
function Bad() {
  const data = use(fetchData()); // 매 렌더링마다 새 Promise!
}

// ✅ 외부에서 생성하거나 useMemo 사용
const promise = fetchData();
function Good() {
  const data = use(promise);
}

// ✅ 또는 props로 전달받기
function Good({ dataPromise }) {
  const data = use(dataPromise);
}`}
        </pre>
      </div>
    </div>
  );
}

export default UsePage;
