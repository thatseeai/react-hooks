import { useQueries, useQueryClient } from '@tanstack/react-query';
import HookDemo from '../../../components/HookDemo/HookDemo';
import CodeBlock from '../../../components/CodeBlock/CodeBlock';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  userId: number;
}

// Mock API 함수들
async function fetchUser(userId: number): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const users = [
    { id: 1, name: '김개발', email: 'kim@example.com' },
    { id: 2, name: '이코딩', email: 'lee@example.com' },
    { id: 3, name: '박프론트', email: 'park@example.com' },
  ];
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error(`User ${userId} not found`);
  return user;
}

async function fetchPost(postId: number): Promise<Post> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const posts = [
    { id: 1, title: 'React Query 완벽 가이드', userId: 1 },
    { id: 2, title: 'TypeScript 고급 패턴', userId: 2 },
    { id: 3, title: 'Vite 빌드 최적화', userId: 3 },
  ];
  const post = posts.find((p) => p.id === postId);
  if (!post) throw new Error(`Post ${postId} not found`);
  return post;
}

function BasicUseQueriesDemo() {
  const userIds = [1, 2, 3];

  const results = useQueries({
    queries: userIds.map((id) => ({
      queryKey: ['user', id],
      queryFn: () => fetchUser(id),
    })),
  });

  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        전체 상태: {isLoading ? '⏳ 로딩 중' : isError ? '❌ 에러 발생' : '✅ 완료'}
      </div>

      <div className="space-y-2">
        {results.map((result, i) => (
          <div
            key={i}
            className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">사용자 {userIds[i]}</span>
              <span className={`text-xs px-2 py-1 rounded ${
                result.isLoading
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : result.isError
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
                {result.isLoading ? '로딩' : result.isError ? '에러' : '완료'}
              </span>
            </div>

            {result.data && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <p>이름: {result.data.name}</p>
                <p>이메일: {result.data.email}</p>
              </div>
            )}

            {result.error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {result.error instanceof Error ? result.error.message : '에러 발생'}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CombineDemo() {
  const userIds = [1, 2, 3];

  const { data: combinedData, isLoading, isError } = useQueries({
    queries: userIds.map((id) => ({
      queryKey: ['user', id],
      queryFn: () => fetchUser(id),
    })),
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        isLoading: results.some((result) => result.isLoading),
        isError: results.some((result) => result.isError),
      };
    },
  });

  if (isLoading) {
    return <div className="text-center py-8 text-gray-600 dark:text-gray-400">로딩 중...</div>;
  }

  if (isError) {
    return <div className="text-center py-8 text-red-600 dark:text-red-400">에러 발생</div>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        combine 함수를 사용하여 결과를 하나의 객체로 병합했습니다.
      </p>

      <div className="space-y-2">
        {combinedData.map((user, i) => (
          user && (
            <div
              key={i}
              className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded"
            >
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

function DynamicQueriesDemo() {
  const queryClient = useQueryClient();

  // 동적으로 쿼리 개수 변경
  const postIds = [1, 2, 3];

  const results = useQueries({
    queries: postIds.map((id) => ({
      queryKey: ['post', id],
      queryFn: () => fetchPost(id),
      staleTime: 5000,
    })),
  });

  function handleRefetch(index: number) {
    queryClient.invalidateQueries({ queryKey: ['post', postIds[index]] });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        각 쿼리를 독립적으로 관리할 수 있습니다.
      </p>

      <div className="space-y-2">
        {results.map((result, i) => (
          <div
            key={i}
            className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">게시글 {postIds[i]}</span>
              <button
                onClick={() => handleRefetch(i)}
                disabled={result.isFetching}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {result.isFetching ? '새로고침 중...' : '새로고침'}
              </button>
            </div>

            {result.isLoading && (
              <p className="text-sm text-gray-600 dark:text-gray-400">로딩 중...</p>
            )}

            {result.data && (
              <div className="text-sm">
                <p className="font-medium">{result.data.title}</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  작성자 ID: {result.data.userId}
                </p>
              </div>
            )}

            {result.error && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {result.error instanceof Error ? result.error.message : '에러'}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function UseQueriesPage(): React.ReactElement {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">useQueries</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
        여러 개의 쿼리를 병렬로 실행하고 결과를 배열로 받습니다
      </p>

      {/* 기본 사용법 */}
      <HookDemo title="기본 병렬 쿼리" description="여러 사용자 정보를 동시에 조회하는 예제입니다.">
        <BasicUseQueriesDemo />
      </HookDemo>

      <CodeBlock
        code={`import { useQueries } from '@tanstack/react-query';

function UsersList() {
  const userIds = [1, 2, 3];

  const results = useQueries({
    queries: userIds.map(id => ({
      queryKey: ['user', id],
      queryFn: () => fetchUser(id),
    })),
  });

  const isLoading = results.some(result => result.isLoading);
  const isError = results.some(result => result.isError);

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러 발생</div>;

  return (
    <div>
      {results.map((result, i) => (
        <div key={i}>
          {result.data && (
            <div>
              <h3>{result.data.name}</h3>
              <p>{result.data.email}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// useQuery를 여러 번 호출하는 것과의 차이:
// ❌ 반복문에서 Hook 호출 불가
function BadExample({ userIds }: { userIds: number[] }) {
  userIds.map(id => {
    const { data } = useQuery({ // ❌ Hook 규칙 위반!
      queryKey: ['user', id],
      queryFn: () => fetchUser(id),
    });
  });
}

// ✅ useQueries 사용
function GoodExample({ userIds }: { userIds: number[] }) {
  const results = useQueries({
    queries: userIds.map(id => ({
      queryKey: ['user', id],
      queryFn: () => fetchUser(id),
    })),
  });
}`}
        language="typescript"
        showLineNumbers
      />

      {/* combine 옵션 */}
      <HookDemo title="combine으로 결과 병합" description="combine 함수를 사용하여 여러 쿼리 결과를 하나의 구조로 변환합니다." variant="info">
        <CombineDemo />
      </HookDemo>

      <CodeBlock
        code={`function CombinedQueries() {
  const userIds = [1, 2, 3];

  // combine 함수로 결과를 커스터마이징
  const { data, isLoading, isError, allSucceeded } = useQueries({
    queries: userIds.map(id => ({
      queryKey: ['user', id],
      queryFn: () => fetchUser(id),
    })),
    combine: (results) => {
      return {
        // 모든 데이터를 배열로
        data: results.map(r => r.data),

        // 하나라도 로딩 중이면 true
        isLoading: results.some(r => r.isLoading),

        // 하나라도 에러면 true
        isError: results.some(r => r.isError),

        // 모두 성공했는지
        allSucceeded: results.every(r => r.isSuccess),

        // 에러만 필터링
        errors: results
          .filter(r => r.error)
          .map(r => r.error),
      };
    },
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러 발생</div>;

  return (
    <div>
      {data.map((user, i) => (
        user && <div key={i}>{user.name}</div>
      ))}
    </div>
  );
}

// 더 복잡한 combine 예제
const { users, total, pending } = useQueries({
  queries: userIds.map(id => ({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
  })),
  combine: (results) => ({
    users: results
      .filter(r => r.data)
      .map(r => r.data!),
    total: results.length,
    pending: results.filter(r => r.isPending).length,
  }),
});`}
        language="typescript"
      />

      {/* 동적 쿼리 */}
      <HookDemo title="동적 쿼리 관리" description="각 쿼리를 독립적으로 제어하고 관리하는 패턴입니다." variant="warning">
        <DynamicQueriesDemo />
      </HookDemo>

      <CodeBlock
        code={`function DynamicQueries({ postIds }: { postIds: number[] }) {
  const queryClient = useQueryClient();

  const results = useQueries({
    queries: postIds.map(id => ({
      queryKey: ['post', id],
      queryFn: () => fetchPost(id),
      staleTime: 5000,
      // 각 쿼리에 개별 옵션 설정 가능
      enabled: id > 0,
    })),
  });

  // 특정 쿼리만 refetch
  function refetchPost(postId: number) {
    queryClient.invalidateQueries({ queryKey: ['post', postId] });
  }

  // 모든 쿼리 refetch
  function refetchAll() {
    postIds.forEach(id => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
    });
  }

  return (
    <div>
      <button onClick={refetchAll}>전체 새로고침</button>

      {results.map((result, i) => (
        <div key={i}>
          {result.data && <div>{result.data.title}</div>}
          <button onClick={() => refetchPost(postIds[i])}>
            개별 새로고침
          </button>
        </div>
      ))}
    </div>
  );
}

// 동적으로 쿼리 개수 변경
function VariableQueries() {
  const [count, setCount] = useState(3);

  const results = useQueries({
    queries: Array.from({ length: count }, (_, i) => ({
      queryKey: ['item', i],
      queryFn: () => fetchItem(i),
    })),
  });

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        쿼리 추가
      </button>
      <button onClick={() => setCount(c => Math.max(1, c - 1))}>
        쿼리 제거
      </button>

      {/* results 렌더링 */}
    </div>
  );
}`}
        language="typescript"
      />

      {/* 주요 옵션 */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">주요 옵션</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">옵션</th>
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">타입</th>
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">설명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">queries</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">UseQueryOptions[]</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">실행할 쿼리 옵션 배열</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">combine</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">(results) =&gt; TCombinedResult</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">쿼리 결과를 변환하는 함수</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <p className="text-sm font-medium mb-2">queries 배열의 각 항목은 useQuery의 모든 옵션을 사용할 수 있습니다:</p>
          <ul className="text-sm space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
            <li>queryKey, queryFn (필수)</li>
            <li>enabled, staleTime, gcTime</li>
            <li>retry, retryDelay</li>
            <li>refetchOnWindowFocus, refetchOnMount</li>
            <li>select, placeholderData</li>
          </ul>
        </div>
      </section>

      {/* 반환값 */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">반환값</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">케이스</th>
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">반환 타입</th>
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">설명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">combine 없음</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">UseQueryResult[]</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">각 쿼리 결과 배열</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">combine 사용</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">TCombinedResult</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">combine 함수의 반환값</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <p className="text-sm font-medium mb-2">각 UseQueryResult는 다음 속성을 포함합니다:</p>
          <ul className="text-sm space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
            <li>data, error, isLoading, isError, isSuccess</li>
            <li>isFetching, isPending</li>
            <li>refetch, fetchStatus, status</li>
          </ul>
        </div>
      </section>

      {/* Best Practices */}
      <HookDemo title="Best Practices" description="useQueries 사용 시 권장되는 패턴들입니다." variant="success">
        <div className="space-y-3 text-sm">
          <div>
            <strong className="text-green-700 dark:text-green-400">✅ combine 함수 활용:</strong>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              복잡한 데이터 가공은 combine 함수에서 처리하여 컴포넌트 로직 단순화
            </p>
          </div>
          <div>
            <strong className="text-green-700 dark:text-green-400">✅ 개별 옵션 설정:</strong>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              각 쿼리마다 다른 staleTime, enabled 등 옵션 설정 가능
            </p>
          </div>
          <div>
            <strong className="text-green-700 dark:text-green-400">✅ 에러 처리:</strong>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              일부 쿼리 실패 시에도 성공한 데이터는 표시하는 UX 고려
            </p>
          </div>
          <div>
            <strong className="text-green-700 dark:text-green-400">✅ 메모이제이션:</strong>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              queries 배열은 useMemo로 메모이제이션하여 불필요한 재실행 방지
            </p>
          </div>
        </div>
      </HookDemo>

      {/* 주의사항 */}
      <HookDemo title="주의사항" description="사용 시 주의해야 할 점들입니다." variant="warning">
        <ul className="space-y-2 text-sm">
          <li>• <strong>queries 배열 안정성:</strong> queries 배열이 매번 새로 생성되지 않도록 useMemo 사용 권장</li>
          <li>• <strong>동적 개수:</strong> queries 배열 길이가 변경되면 모든 쿼리가 재실행되므로 주의</li>
          <li>• <strong>combine 최적화:</strong> combine 함수는 쿼리 상태가 변경될 때마다 실행되므로 무거운 연산 지양</li>
          <li>• <strong>대량 쿼리:</strong> 너무 많은 쿼리 (100개 이상)는 성능 이슈 발생 가능</li>
        </ul>
      </HookDemo>

      {/* 관련 Hooks */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">관련 Hooks</h2>
        <ul className="space-y-2">
          <li>
            <a href="/advanced/tanstack/use-query" className="text-blue-600 dark:text-blue-400 hover:underline">
              useQuery
            </a>
            {' '}- 단일 쿼리 실행
          </li>
          <li>
            <a href="/basic/use-memo" className="text-blue-600 dark:text-blue-400 hover:underline">
              useMemo
            </a>
            {' '}- queries 배열 메모이제이션
          </li>
        </ul>
      </section>
    </div>
  );
}
