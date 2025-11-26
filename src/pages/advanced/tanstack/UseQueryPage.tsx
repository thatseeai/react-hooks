import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import HookDemo from '../../../components/HookDemo/HookDemo';
import CodeBlock from '../../../components/CodeBlock/CodeBlock';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

// Mock API 함수
async function fetchPosts(): Promise<Post[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [
    { id: 1, title: 'React Query 완벽 가이드', body: 'TanStack Query는 강력한 서버 상태 관리 라이브러리입니다.', userId: 1 },
    { id: 2, title: 'useQuery Hook 마스터하기', body: '데이터 페칭과 캐싱을 쉽게 관리할 수 있습니다.', userId: 1 },
    { id: 3, title: 'React 19와 TanStack Query', body: '최신 React와 함께 사용하는 방법을 알아봅니다.', userId: 2 },
  ];
}

async function fetchUser(userId: number): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const users = [
    { id: 1, name: '김개발', email: 'kim@example.com' },
    { id: 2, name: '이코딩', email: 'lee@example.com' },
  ];
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error('User not found');
  return user;
}

function BasicQueryDemo() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 5000, // 5초간 fresh 상태 유지
    gcTime: 10000, // 10초 후 캐시 삭제 (구 cacheTime)
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isFetching ? '새로고침 중...' : '새로고침'}
        </button>
        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded">
          상태: {isLoading ? '⏳ 로딩 중' : isFetching ? '🔄 페칭 중' : '✅ 완료'}
        </div>
      </div>

      {isLoading && <p className="text-gray-600 dark:text-gray-400">데이터를 불러오는 중...</p>}

      {isError && (
        <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
          오류 발생: {error instanceof Error ? error.message : '알 수 없는 오류'}
        </div>
      )}

      {data && (
        <div className="space-y-2">
          {data.map((post) => (
            <div key={post.id} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
              <h3 className="font-bold text-lg">{post.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{post.body}</p>
              <p className="text-sm text-gray-500 mt-2">작성자 ID: {post.userId}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DependentQueryDemo() {
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  const selectedPost = postsQuery.data?.find((p) => p.id === selectedPostId);

  const userQuery = useQuery({
    queryKey: ['user', selectedPost?.userId],
    queryFn: () => fetchUser(selectedPost!.userId),
    enabled: !!selectedPost, // selectedPost가 있을 때만 실행
  });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">게시글 선택:</label>
        <select
          value={selectedPostId ?? ''}
          onChange={(e) => setSelectedPostId(Number(e.target.value) || null)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
        >
          <option value="">-- 게시글을 선택하세요 --</option>
          {postsQuery.data?.map((post) => (
            <option key={post.id} value={post.id}>
              {post.title}
            </option>
          ))}
        </select>
      </div>

      {selectedPost && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
          <h4 className="font-bold">{selectedPost.title}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{selectedPost.body}</p>
        </div>
      )}

      {userQuery.isLoading && <p className="text-gray-600 dark:text-gray-400">작성자 정보 로딩 중...</p>}

      {userQuery.data && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded">
          <h4 className="font-bold">작성자 정보</h4>
          <p className="text-sm mt-2">이름: {userQuery.data.name}</p>
          <p className="text-sm">이메일: {userQuery.data.email}</p>
        </div>
      )}
    </div>
  );
}

function QueryInvalidationDemo() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  function handleInvalidate() {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  }

  function handleSetData() {
    queryClient.setQueryData(['posts'], (old: Post[] | undefined) => {
      if (!old) return old;
      return [
        ...old,
        {
          id: Date.now(),
          title: '새로 추가된 게시글',
          body: 'setQueryData로 캐시를 직접 업데이트했습니다.',
          userId: 1,
        },
      ];
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={handleInvalidate}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
        >
          쿼리 무효화 (refetch)
        </button>
        <button
          onClick={handleSetData}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          캐시 직접 업데이트
        </button>
      </div>

      {isLoading && <p>로딩 중...</p>}

      <div className="text-sm text-gray-600 dark:text-gray-400">
        게시글 수: {data?.length ?? 0}
      </div>

      {data && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {data.map((post) => (
            <div key={post.id} className="p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm">
              <p className="font-medium">{post.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function UseQueryPage(): React.ReactElement {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">useQuery</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
        TanStack Query의 핵심 Hook - 서버 상태를 쉽게 페칭하고 캐싱합니다
      </p>

      {/* 기본 사용법 */}
      <HookDemo title="기본 데이터 페칭" description="useQuery를 사용하여 데이터를 페칭하고 로딩, 에러 상태를 처리하는 기본 예제입니다.">
        <BasicQueryDemo />
      </HookDemo>

      <CodeBlock
        code={`import { useQuery } from '@tanstack/react-query';

interface Post {
  id: number;
  title: string;
  body: string;
}

async function fetchPosts(): Promise<Post[]> {
  const response = await fetch('/api/posts');
  return response.json();
}

function PostList() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['posts'],           // 고유 식별자
    queryFn: fetchPosts,           // 데이터 페칭 함수
    staleTime: 5000,               // 5초간 fresh 상태 유지
    gcTime: 10000,                 // 10초 후 캐시 삭제
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>오류: {error.message}</div>;

  return (
    <div>
      <button onClick={() => refetch()} disabled={isFetching}>
        새로고침
      </button>
      {data.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}`}
        language="typescript"
        showLineNumbers
      />

      {/* 종속 쿼리 */}
      <HookDemo title="종속 쿼리 (Dependent Queries)" description="한 쿼리의 결과가 다른 쿼리의 실행 조건이 되는 패턴입니다." variant="info">
        <DependentQueryDemo />
      </HookDemo>

      <CodeBlock
        code={`function PostWithAuthor({ postId }: { postId: number }) {
  // 먼저 게시글 조회
  const postQuery = useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPost(postId),
  });

  // 게시글이 로드되면 작성자 조회
  const authorQuery = useQuery({
    queryKey: ['user', postQuery.data?.userId],
    queryFn: () => fetchUser(postQuery.data!.userId),
    enabled: !!postQuery.data,  // postQuery 성공 후에만 실행
  });

  if (postQuery.isLoading) return <div>게시글 로딩 중...</div>;
  if (authorQuery.isLoading) return <div>작성자 로딩 중...</div>;

  return (
    <div>
      <h2>{postQuery.data.title}</h2>
      <p>작성자: {authorQuery.data?.name}</p>
    </div>
  );
}`}
        language="typescript"
      />

      {/* 쿼리 무효화 및 캐시 업데이트 */}
      <HookDemo title="쿼리 무효화 및 캐시 업데이트" description="데이터를 강제로 다시 불러오거나(invalidate), 캐시를 직접 수정(setQueryData)하는 방법입니다." variant="warning">
        <QueryInvalidationDemo />
      </HookDemo>

      <CodeBlock
        code={`import { useQuery, useQueryClient } from '@tanstack/react-query';

function DataManager() {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  // 방법 1: 쿼리 무효화 (자동 refetch)
  function invalidateData() {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  }

  // 방법 2: 캐시 직접 업데이트 (refetch 없음)
  function updateCache() {
    queryClient.setQueryData(['posts'], (old: Post[]) => [
      ...old,
      newPost,
    ]);
  }

  // 방법 3: 특정 쿼리만 무효화
  function invalidateSpecific() {
    queryClient.invalidateQueries({
      queryKey: ['posts'],
      refetchType: 'active',  // 활성 쿼리만 refetch
    });
  }

  return (
    <div>
      <button onClick={invalidateData}>무효화</button>
      <button onClick={updateCache}>캐시 업데이트</button>
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
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">기본값</th>
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">설명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">queryKey</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">unknown[]</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">필수</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">쿼리를 식별하는 고유 키</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">queryFn</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">() =&gt; Promise</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">필수</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">데이터를 반환하는 Promise 함수</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">staleTime</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">number</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">0</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">데이터가 fresh 상태로 유지되는 시간 (ms)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">gcTime</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">number</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">5분</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">사용하지 않는 캐시를 삭제하기까지의 시간</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">enabled</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">boolean</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">true</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">쿼리 자동 실행 여부</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">retry</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">number | boolean</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">3</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">실패 시 재시도 횟수</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">refetchOnWindowFocus</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">boolean</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">true</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">창 포커스 시 refetch 여부</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 반환값 */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">반환값</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">속성</th>
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">타입</th>
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">설명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">data</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">TData | undefined</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">쿼리 함수가 반환한 데이터</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">error</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">TError | null</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">에러 객체</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">isLoading</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">boolean</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">첫 로딩 중 (캐시 없음)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">isFetching</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">boolean</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">데이터 페칭 중 (백그라운드 포함)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">isError</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">boolean</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">에러 상태</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">isSuccess</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">boolean</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">성공 상태</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">refetch</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">() =&gt; Promise</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">수동으로 쿼리 다시 실행</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Best Practices */}
      <HookDemo title="Best Practices" description="TanStack Query 사용 시 권장되는 패턴들입니다." variant="success">
        <div className="space-y-3 text-sm">
          <div>
            <strong className="text-green-700 dark:text-green-400">✅ QueryKey 설계:</strong>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              계층적 구조로 설계 - <code>['posts', postId, 'comments']</code>
            </p>
          </div>
          <div>
            <strong className="text-green-700 dark:text-green-400">✅ staleTime 활용:</strong>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              자주 변경되지 않는 데이터는 staleTime을 길게 설정하여 불필요한 refetch 방지
            </p>
          </div>
          <div>
            <strong className="text-green-700 dark:text-green-400">✅ enabled 옵션:</strong>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              종속 쿼리나 조건부 페칭에 활용
            </p>
          </div>
          <div>
            <strong className="text-green-700 dark:text-green-400">✅ Error Boundary:</strong>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              전역 에러 처리를 위해 Error Boundary와 함께 사용
            </p>
          </div>
        </div>
      </HookDemo>

      {/* 주의사항 */}
      <HookDemo title="주의사항" description="사용 시 주의해야 할 점들입니다." variant="warning">
        <ul className="space-y-2 text-sm">
          <li>• <strong>gcTime vs staleTime:</strong> gcTime(구 cacheTime)은 캐시 삭제 시간, staleTime은 fresh 유지 시간</li>
          <li>• <strong>QueryKey 불변성:</strong> 동일한 데이터에는 동일한 queryKey를 사용해야 캐싱이 올바르게 작동</li>
          <li>• <strong>refetchOnWindowFocus:</strong> 프로덕션에서는 기본값(true) 유지 권장</li>
          <li>• <strong>retry:</strong> 네트워크 요청 실패 시 자동 재시도하므로, API 서버 부하 고려</li>
        </ul>
      </HookDemo>

      {/* 관련 Hooks */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">관련 Hooks</h2>
        <ul className="space-y-2">
          <li>
            <a href="/advanced/tanstack/use-mutation" className="text-blue-600 dark:text-blue-400 hover:underline">
              useMutation
            </a>
            {' '}- 데이터 변경(Create, Update, Delete)
          </li>
          <li>
            <a href="/advanced/tanstack/use-infinite-query" className="text-blue-600 dark:text-blue-400 hover:underline">
              useInfiniteQuery
            </a>
            {' '}- 무한 스크롤 데이터 페칭
          </li>
          <li>
            <a href="/advanced/tanstack/use-queries" className="text-blue-600 dark:text-blue-400 hover:underline">
              useQueries
            </a>
            {' '}- 여러 쿼리 병렬 실행
          </li>
        </ul>
      </section>
    </div>
  );
}
