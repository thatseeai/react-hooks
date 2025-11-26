import { Fragment } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import HookDemo from '../../../components/HookDemo/HookDemo';
import CodeBlock from '../../../components/CodeBlock/CodeBlock';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface PostsPage {
  posts: Post[];
  nextCursor: number | null;
  hasMore: boolean;
}

// Mock API 함수
async function fetchPostsPage({ pageParam = 0 }: { pageParam: number }): Promise<PostsPage> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const postsPerPage = 5;
  const start = pageParam * postsPerPage;

  const allPosts: Post[] = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    title: `게시글 ${i + 1}`,
    body: `이것은 ${i + 1}번째 게시글의 내용입니다. 무한 스크롤 데모를 위한 샘플 데이터입니다.`,
    userId: (i % 5) + 1,
  }));

  const posts = allPosts.slice(start, start + postsPerPage);
  const hasMore = start + postsPerPage < allPosts.length;

  return {
    posts,
    nextCursor: hasMore ? pageParam + 1 : null,
    hasMore,
  };
}

function BasicInfiniteQueryDemo() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['posts', 'infinite'],
    queryFn: ({ pageParam }) => fetchPostsPage({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  if (isLoading) {
    return <div className="text-center py-8 text-gray-600 dark:text-gray-400">로딩 중...</div>;
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
        오류: {error instanceof Error ? error.message : '알 수 없는 오류'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        로드된 페이지 수: {data?.pages.length ?? 0}
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded p-4">
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.posts.map((post) => (
              <div
                key={post.id}
                className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded"
              >
                <h3 className="font-bold text-lg">{post.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">{post.body}</p>
                <p className="text-xs text-gray-500 mt-2">ID: {post.id}</p>
              </div>
            ))}
          </Fragment>
        ))}
      </div>

      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isFetchingNextPage
          ? '로딩 중...'
          : hasNextPage
            ? '더 보기'
            : '마지막 페이지입니다'}
      </button>
    </div>
  );
}

function InfiniteScrollDemo() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['posts', 'scroll'],
    queryFn: ({ pageParam }) => fetchPostsPage({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    // 스크롤이 하단 100px 이내에 도달하면 다음 페이지 로드
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  }

  if (isLoading) {
    return <div className="text-center py-8 text-gray-600 dark:text-gray-400">로딩 중...</div>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        스크롤을 내리면 자동으로 다음 페이지가 로드됩니다
      </p>

      <div
        className="space-y-2 max-h-96 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded p-4"
        onScroll={handleScroll}
      >
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.posts.map((post) => (
              <div
                key={post.id}
                className="p-3 bg-gray-100 dark:bg-gray-800 rounded"
              >
                <h4 className="font-medium">{post.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{post.body}</p>
              </div>
            ))}
          </Fragment>
        ))}

        {isFetchingNextPage && (
          <div className="text-center py-4 text-gray-600 dark:text-gray-400">
            다음 페이지 로딩 중...
          </div>
        )}

        {!hasNextPage && (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
            모든 게시글을 불러왔습니다
          </div>
        )}
      </div>
    </div>
  );
}

function BidirectionalDemo() {
  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['posts', 'bidirectional'],
    queryFn: ({ pageParam }) => fetchPostsPage({ pageParam }),
    initialPageParam: 2, // 중간부터 시작
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (_firstPage, allPages) => {
      const firstPageNumber = allPages.length > 0 ? 2 - allPages.length : 0;
      return firstPageNumber > 0 ? firstPageNumber - 1 : null;
    },
  });

  if (isLoading) {
    return <div className="text-center py-8 text-gray-600 dark:text-gray-400">로딩 중...</div>;
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => fetchPreviousPage()}
        disabled={!hasPreviousPage || isFetchingPreviousPage}
        className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400"
      >
        {isFetchingPreviousPage
          ? '이전 페이지 로딩 중...'
          : hasPreviousPage
            ? '이전 페이지 로드'
            : '첫 페이지입니다'}
      </button>

      <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded p-4">
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.posts.map((post) => (
              <div
                key={post.id}
                className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-sm"
              >
                <strong>{post.title}</strong>
              </div>
            ))}
          </Fragment>
        ))}
      </div>

      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isFetchingNextPage
          ? '다음 페이지 로딩 중...'
          : hasNextPage
            ? '다음 페이지 로드'
            : '마지막 페이지입니다'}
      </button>
    </div>
  );
}

export default function UseInfiniteQueryPage(): React.ReactElement {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">useInfiniteQuery</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
        무한 스크롤, 페이지네이션 등 점진적 데이터 로딩을 위한 Hook
      </p>

      {/* 기본 사용법 */}
      <HookDemo title="기본 무한 쿼리" description="버튼을 클릭하여 다음 페이지를 로드하는 기본 패턴입니다.">
        <BasicInfiniteQueryDemo />
      </HookDemo>

      <CodeBlock
        code={`import { useInfiniteQuery } from '@tanstack/react-query';

interface PostsPage {
  posts: Post[];
  nextCursor: number | null;
  hasMore: boolean;
}

async function fetchPostsPage({ pageParam = 0 }) {
  const response = await fetch(\`/api/posts?cursor=\${pageParam}\`);
  return response.json();
}

function InfinitePostList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['posts', 'infinite'],
    queryFn: ({ pageParam }) => fetchPostsPage({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div>
      {data?.pages.map((page, i) => (
        <Fragment key={i}>
          {page.posts.map(post => (
            <div key={post.id}>{post.title}</div>
          ))}
        </Fragment>
      ))}

      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage ? '로딩 중...' : '더 보기'}
      </button>
    </div>
  );
}`}
        language="typescript"
        showLineNumbers
      />

      {/* 무한 스크롤 */}
      <HookDemo title="자동 무한 스크롤" description="스크롤 이벤트를 감지하여 자동으로 다음 페이지를 로드합니다." variant="info">
        <InfiniteScrollDemo />
      </HookDemo>

      <CodeBlock
        code={`function InfiniteScrollList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['posts'],
      queryFn: ({ pageParam }) => fetchPostsPage({ pageParam }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    // 하단 100px 이내 도달 시 다음 페이지 로드
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  }

  return (
    <div onScroll={handleScroll} className="overflow-y-auto h-96">
      {data?.pages.map((page, i) => (
        <Fragment key={i}>
          {page.posts.map(post => (
            <div key={post.id}>{post.title}</div>
          ))}
        </Fragment>
      ))}
      {isFetchingNextPage && <div>로딩 중...</div>}
    </div>
  );
}

// Intersection Observer 사용 (더 효율적)
function InfiniteScrollWithObserver() {
  const observerTarget = useRef(null);

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => fetchPostsPage({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  return (
    <div>
      {data?.pages.map((page, i) => (
        <Fragment key={i}>
          {page.posts.map(post => (
            <div key={post.id}>{post.title}</div>
          ))}
        </Fragment>
      ))}
      <div ref={observerTarget} />
    </div>
  );
}`}
        language="typescript"
      />

      {/* 양방향 무한 쿼리 */}
      <HookDemo title="양방향 무한 쿼리" description="이전 페이지와 다음 페이지를 모두 로드할 수 있는 패턴입니다." variant="warning">
        <BidirectionalDemo />
      </HookDemo>

      <CodeBlock
        code={`function BidirectionalList() {
  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => fetchPostsPage({ pageParam }),
    initialPageParam: 5, // 중간부터 시작
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage, allPages) => {
      // 첫 페이지의 이전 커서 계산
      const firstPageNumber = allPages.length > 0
        ? 5 - allPages.length
        : 0;
      return firstPageNumber > 0 ? firstPageNumber - 1 : null;
    },
  });

  return (
    <div>
      <button onClick={() => fetchPreviousPage()} disabled={!hasPreviousPage}>
        이전 페이지
      </button>

      {data?.pages.map((page, i) => (
        <Fragment key={i}>
          {page.posts.map(post => (
            <div key={post.id}>{post.title}</div>
          ))}
        </Fragment>
      ))}

      <button onClick={() => fetchNextPage()} disabled={!hasNextPage}>
        다음 페이지
      </button>
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
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">queryKey</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">unknown[]</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">쿼리 식별자</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">queryFn</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">(context) =&gt; Promise</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">페이지 데이터를 반환하는 함수</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">initialPageParam</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">unknown</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">첫 페이지의 pageParam 값</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">getNextPageParam</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">(lastPage, allPages) =&gt; unknown</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">다음 페이지 파라미터 계산</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">getPreviousPageParam</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">(firstPage, allPages) =&gt; unknown</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">이전 페이지 파라미터 계산</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">maxPages</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">number</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">메모리에 유지할 최대 페이지 수</td>
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
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">{'{ pages: TData[], pageParams: unknown[] }'}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">모든 페이지 데이터 배열</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">fetchNextPage</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">() =&gt; Promise</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">다음 페이지 페칭</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">fetchPreviousPage</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">() =&gt; Promise</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">이전 페이지 페칭</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">hasNextPage</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">boolean</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">다음 페이지 존재 여부</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">hasPreviousPage</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">boolean</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">이전 페이지 존재 여부</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">isFetchingNextPage</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">boolean</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">다음 페이지 페칭 중</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">isFetchingPreviousPage</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">boolean</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">이전 페이지 페칭 중</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Best Practices */}
      <HookDemo title="Best Practices" description="useInfiniteQuery 사용 시 권장되는 패턴들입니다." variant="success">
        <div className="space-y-3 text-sm">
          <div>
            <strong className="text-green-700 dark:text-green-400">✅ Intersection Observer 사용:</strong>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              스크롤 이벤트보다 Intersection Observer API가 더 효율적
            </p>
          </div>
          <div>
            <strong className="text-green-700 dark:text-green-400">✅ maxPages 설정:</strong>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              메모리 관리를 위해 maxPages를 적절히 제한
            </p>
          </div>
          <div>
            <strong className="text-green-700 dark:text-green-400">✅ 커서 기반 페이지네이션:</strong>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              offset보다 cursor 방식이 데이터 일관성 측면에서 유리
            </p>
          </div>
          <div>
            <strong className="text-green-700 dark:text-green-400">✅ 로딩 상태 표시:</strong>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              isFetchingNextPage를 활용하여 사용자에게 로딩 상태 명확히 전달
            </p>
          </div>
        </div>
      </HookDemo>

      {/* 주의사항 */}
      <HookDemo title="주의사항" description="사용 시 주의해야 할 점들입니다." variant="warning">
        <ul className="space-y-2 text-sm">
          <li>• <strong>initialPageParam 필수:</strong> TanStack Query v5부터 initialPageParam은 필수 옵션</li>
          <li>• <strong>Fragment 컴포넌트:</strong> pages.map 사용 시 React Fragment로 감싸서 key 충돌 방지</li>
          <li>• <strong>메모리 관리:</strong> 무한 스크롤은 메모리 누수 위험이 있으므로 maxPages 설정 권장</li>
          <li>• <strong>getNextPageParam 반환값:</strong> undefined 또는 null 반환 시 hasNextPage가 false가 됨</li>
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
            {' '}- 일반 데이터 조회
          </li>
          <li>
            <a href="/basic/use-deferred-value" className="text-blue-600 dark:text-blue-400 hover:underline">
              useDeferredValue
            </a>
            {' '}- 대량 데이터 렌더링 최적화
          </li>
        </ul>
      </section>
    </div>
  );
}
