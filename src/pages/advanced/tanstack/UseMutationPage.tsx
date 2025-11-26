import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import HookDemo from '../../../components/HookDemo/HookDemo';
import CodeBlock from '../../../components/CodeBlock/CodeBlock';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface CreateTodoInput {
  text: string;
}

// Mock API 함수들
async function fetchTodos(): Promise<Todo[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return JSON.parse(localStorage.getItem('todos') || '[]');
}

async function createTodo(input: CreateTodoInput): Promise<Todo> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const todos = JSON.parse(localStorage.getItem('todos') || '[]');
  const newTodo: Todo = {
    id: Date.now(),
    text: input.text,
    completed: false,
  };

  const updated = [...todos, newTodo];
  localStorage.setItem('todos', JSON.stringify(updated));

  return newTodo;
}

async function updateTodo(todo: Todo): Promise<Todo> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const todos: Todo[] = JSON.parse(localStorage.getItem('todos') || '[]');
  const updated = todos.map((t) => (t.id === todo.id ? todo : t));
  localStorage.setItem('todos', JSON.stringify(updated));

  return todo;
}

async function deleteTodo(id: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const todos: Todo[] = JSON.parse(localStorage.getItem('todos') || '[]');
  const updated = todos.filter((t) => t.id !== id);
  localStorage.setItem('todos', JSON.stringify(updated));
}

function BasicMutationDemo() {
  const [inputText, setInputText] = useState('');
  const queryClient = useQueryClient();

  const { data: todos = [] } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  const createMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      // 쿼리 무효화하여 자동 refetch
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setInputText('');
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inputText.trim()) return;
    createMutation.mutate({ text: inputText });
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="할 일을 입력하세요..."
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
          disabled={createMutation.isPending}
        />
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {createMutation.isPending ? '추가 중...' : '추가'}
        </button>
      </form>

      {createMutation.isError && (
        <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded text-sm">
          오류: {createMutation.error instanceof Error ? createMutation.error.message : '알 수 없는 오류'}
        </div>
      )}

      <div className="space-y-2">
        {todos.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-sm">할 일이 없습니다.</p>
        )}
        {todos.map((todo) => (
          <div key={todo.id} className="p-3 bg-gray-100 dark:bg-gray-800 rounded">
            {todo.text}
          </div>
        ))}
      </div>
    </div>
  );
}

function OptimisticUpdateDemo() {
  const queryClient = useQueryClient();

  const { data: todos = [] } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  const toggleMutation = useMutation({
    mutationFn: updateTodo,
    onMutate: async (updatedTodo) => {
      // 진행 중인 refetch 취소
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // 이전 값 백업
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      // 낙관적 업데이트
      queryClient.setQueryData<Todo[]>(['todos'], (old = []) =>
        old.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
      );

      return { previousTodos };
    },
    onError: (_err, _variables, context) => {
      // 에러 시 롤백
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },
    onSettled: () => {
      // 성공/실패 관계없이 최종 상태 동기화
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      queryClient.setQueryData<Todo[]>(['todos'], (old = []) =>
        old.filter((todo) => todo.id !== deletedId)
      );

      return { previousTodos };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  function handleToggle(todo: Todo) {
    toggleMutation.mutate({ ...todo, completed: !todo.completed });
  }

  function handleDelete(id: number) {
    deleteMutation.mutate(id);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        체크박스를 클릭하면 즉시 UI가 업데이트됩니다 (낙관적 업데이트)
      </p>

      <div className="space-y-2">
        {todos.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            할 일이 없습니다. 위 폼에서 추가해보세요.
          </p>
        )}
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo)}
              disabled={toggleMutation.isPending}
              className="w-4 h-4"
            />
            <span className={todo.completed ? 'line-through text-gray-500' : ''}>
              {todo.text}
            </span>
            <button
              onClick={() => handleDelete(todo.id)}
              disabled={deleteMutation.isPending}
              className="ml-auto px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function MutationCallbacksDemo() {
  const [logs, setLogs] = useState<string[]>([]);
  const queryClient = useQueryClient();

  function addLog(message: string) {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  }

  const mutation = useMutation({
    mutationFn: async (text: string) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (text.toLowerCase().includes('error')) {
        throw new Error('의도적인 에러 발생!');
      }
      return createTodo({ text });
    },
    onMutate: (variables) => {
      addLog(`🔵 onMutate: "${variables}" 뮤테이션 시작`);
    },
    onSuccess: (data, variables) => {
      addLog(`✅ onSuccess: "${variables}" 추가 성공! ID: ${data.id}`);
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: (error, variables) => {
      addLog(`❌ onError: "${variables}" 실패 - ${error.message}`);
    },
    onSettled: (_data, _error, variables) => {
      addLog(`🏁 onSettled: "${variables}" 뮤테이션 완료 (성공/실패 무관)`);
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => mutation.mutate('정상 작업')}
          disabled={mutation.isPending}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          성공 케이스
        </button>
        <button
          onClick={() => mutation.mutate('Error 발생')}
          disabled={mutation.isPending}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
        >
          에러 케이스
        </button>
        <button
          onClick={() => setLogs([])}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          로그 초기화
        </button>
      </div>

      <div className="p-4 bg-gray-900 text-green-400 rounded font-mono text-sm max-h-64 overflow-y-auto">
        {logs.length === 0 && <div className="text-gray-500">로그가 표시됩니다...</div>}
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
    </div>
  );
}

export default function UseMutationPage(): React.ReactElement {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">useMutation</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
        서버 데이터를 생성, 수정, 삭제하는 비동기 작업을 관리합니다
      </p>

      {/* 기본 사용법 */}
      <HookDemo title="기본 Mutation" description="useMutation을 사용하여 데이터를 생성하고 성공/실패를 처리하는 기본 예제입니다.">
        <BasicMutationDemo />
      </HookDemo>

      <CodeBlock
        code={`import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateTodoInput {
  text: string;
}

async function createTodo(input: CreateTodoInput) {
  const response = await fetch('/api/todos', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return response.json();
}

function TodoForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      // 성공 시 todos 쿼리 무효화 (자동 refetch)
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  function handleSubmit(text: string) {
    mutation.mutate({ text });
  }

  return (
    <div>
      <button
        onClick={() => handleSubmit('New Todo')}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? '추가 중...' : '추가'}
      </button>

      {mutation.isError && (
        <div>오류: {mutation.error.message}</div>
      )}
    </div>
  );
}`}
        language="typescript"
        showLineNumbers
      />

      {/* 낙관적 업데이트 */}
      <HookDemo title="낙관적 업데이트 (Optimistic Update)" description="서버 응답을 기다리지 않고 UI를 즉시 업데이트하여 사용자 경험을 향상시키는 패턴입니다." variant="info">
        <OptimisticUpdateDemo />
      </HookDemo>

      <CodeBlock
        code={`function TodoList() {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: updateTodo,

    // 1. 뮤테이션 시작 전
    onMutate: async (updatedTodo) => {
      // 진행 중인 refetch 취소 (race condition 방지)
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // 이전 값 백업
      const previousTodos = queryClient.getQueryData(['todos']);

      // 낙관적 업데이트 (즉시 UI 반영)
      queryClient.setQueryData(['todos'], (old: Todo[]) =>
        old.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo)
      );

      // context로 백업 데이터 반환 (롤백용)
      return { previousTodos };
    },

    // 2. 에러 발생 시 롤백
    onError: (err, variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },

    // 3. 성공/실패 관계없이 최종 동기화
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return (
    <div>
      {todos.map(todo => (
        <div key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleMutation.mutate({
              ...todo,
              completed: !todo.completed
            })}
          />
          {todo.text}
        </div>
      ))}
    </div>
  );
}`}
        language="typescript"
      />

      {/* Mutation 콜백 생명주기 */}
      <HookDemo title="Mutation 생명주기 콜백" description="onMutate, onSuccess, onError, onSettled 등 Mutation의 생명주기 콜백을 확인합니다." variant="warning">
        <MutationCallbacksDemo />
      </HookDemo>

      <CodeBlock
        code={`const mutation = useMutation({
  mutationFn: createTodo,

  // 1️⃣ 뮤테이션 시작 전 (동기)
  onMutate: (variables) => {
    console.log('뮤테이션 시작:', variables);
    // 낙관적 업데이트 수행
    // 백업 데이터 반환 (context로 전달됨)
    return { backup: 'data' };
  },

  // 2️⃣ 성공 시
  onSuccess: (data, variables, context) => {
    console.log('성공!', data);
    // 쿼리 무효화
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  },

  // 3️⃣ 에러 시
  onError: (error, variables, context) => {
    console.error('실패!', error);
    // context.backup으로 롤백
  },

  // 4️⃣ 성공/실패 관계없이 항상 실행
  onSettled: (data, error, variables, context) => {
    console.log('완료!');
    // 최종 정리 작업
  },
});

// 실행 순서:
// onMutate -> API 호출 -> onSuccess/onError -> onSettled`}
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
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">mutationFn</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">(variables) =&gt; Promise</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">뮤테이션을 수행하는 비동기 함수</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">onMutate</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">(variables) =&gt; context</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">뮤테이션 시작 전 실행, 낙관적 업데이트</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">onSuccess</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">(data, variables, context) =&gt; void</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">성공 시 실행</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">onError</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">(error, variables, context) =&gt; void</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">에러 시 실행, 롤백</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">onSettled</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">(data, error, variables, context) =&gt; void</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">성공/실패 관계없이 항상 실행</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">retry</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">number | boolean</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">실패 시 재시도 횟수 (기본값: 0)</td>
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
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">mutate</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">(variables) =&gt; void</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">뮤테이션 실행 (동기)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">mutateAsync</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">(variables) =&gt; Promise</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">뮤테이션 실행 (비동기, Promise 반환)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">data</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">TData | undefined</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">뮤테이션 결과 데이터</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">error</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">TError | null</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">에러 객체</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">isPending</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">boolean</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">뮤테이션 실행 중</td>
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
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">reset</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">() =&gt; void</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">뮤테이션 상태 초기화</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Best Practices */}
      <HookDemo title="Best Practices" description="Mutation 사용 시 권장되는 패턴들입니다." variant="success">
        <div className="space-y-3 text-sm">
          <div>
            <strong className="text-green-700 dark:text-green-400">✅ 낙관적 업데이트:</strong>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              사용자 경험 향상을 위해 즉각적인 UI 업데이트 활용
            </p>
          </div>
          <div>
            <strong className="text-green-700 dark:text-green-400">✅ 에러 처리:</strong>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              onError에서 롤백, onSettled에서 최종 동기화
            </p>
          </div>
          <div>
            <strong className="text-green-700 dark:text-green-400">✅ mutate vs mutateAsync:</strong>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              일반적으로 mutate 사용, async/await 필요 시에만 mutateAsync
            </p>
          </div>
          <div>
            <strong className="text-green-700 dark:text-green-400">✅ 쿼리 무효화:</strong>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              onSuccess에서 관련 쿼리들을 invalidateQueries로 자동 갱신
            </p>
          </div>
        </div>
      </HookDemo>

      {/* 주의사항 */}
      <HookDemo title="주의사항" description="Mutation 사용 시 주의해야 할 점들입니다." variant="warning">
        <ul className="space-y-2 text-sm">
          <li>• <strong>mutate는 Promise를 반환하지 않음:</strong> try/catch가 필요하면 mutateAsync 사용</li>
          <li>• <strong>낙관적 업데이트 시 cancelQueries 필수:</strong> race condition 방지</li>
          <li>• <strong>context 활용:</strong> onMutate에서 반환한 값이 다른 콜백의 context로 전달됨</li>
          <li>• <strong>retry 기본값:</strong> useMutation은 기본적으로 재시도하지 않음 (retry: 0)</li>
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
            {' '}- 데이터 조회
          </li>
          <li>
            <a href="/basic/use-optimistic" className="text-blue-600 dark:text-blue-400 hover:underline">
              useOptimistic
            </a>
            {' '}- React 19 낙관적 업데이트 Hook
          </li>
        </ul>
      </section>
    </div>
  );
}
