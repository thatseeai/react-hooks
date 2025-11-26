import { useState, useOptimistic } from 'react';
import { HookDemo } from '@/components/HookDemo';
import { CodeBlock } from '@/components/CodeBlock';

interface Message {
  id: number;
  text: string;
  sending?: boolean;
}

async function sendMessage(text: string): Promise<Message> {
  // 네트워크 요청 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // 10% 확률로 실패
  if (Math.random() < 0.1) {
    throw new Error('메시지 전송 실패');
  }

  return {
    id: Date.now(),
    text,
  };
}

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  updating?: boolean;
}

async function toggleTodo(_id: number, _completed: boolean): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (Math.random() < 0.05) {
    throw new Error('업데이트 실패');
  }
}

function UseOptimisticPage(): React.ReactElement {
  // 메시지 전송 예제
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: '안녕하세요!' },
    { id: 2, text: 'useOptimistic 테스트 중입니다' },
  ]);
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage: string) => [
      ...state,
      { id: Date.now(), text: newMessage, sending: true },
    ]
  );

  async function handleSendMessage(formData: FormData) {
    const text = formData.get('message') as string;
    if (!text.trim()) return;

    addOptimisticMessage(text);

    try {
      const newMessage = await sendMessage(text);
      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      // 실패 시 낙관적 업데이트가 자동으로 롤백됨
      alert('메시지 전송에 실패했습니다');
    }
  }

  // Todo 토글 예제
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, text: '프로젝트 기획', completed: true },
    { id: 2, text: '디자인 작업', completed: false },
    { id: 3, text: '개발 진행', completed: false },
  ]);
  const [optimisticTodos, updateOptimisticTodo] = useOptimistic(
    todos,
    (state, { id, completed }: { id: number; completed: boolean }) =>
      state.map((todo) =>
        todo.id === id ? { ...todo, completed, updating: true } : todo
      )
  );

  async function handleToggleTodo(id: number, completed: boolean) {
    updateOptimisticTodo({ id, completed });

    try {
      await toggleTodo(id, completed);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, completed } : todo))
      );
    } catch (error) {
      alert('Todo 업데이트에 실패했습니다');
    }
  }

  const basicUsageCode = `import { useState, useOptimistic } from 'react';

function MessageThread() {
  const [messages, setMessages] = useState([]);
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage: string) => [
      ...state,
      { id: Date.now(), text: newMessage, sending: true }
    ]
  );

  async function sendMessage(text: string) {
    // 즉시 UI 업데이트 (낙관적)
    addOptimisticMessage(text);

    try {
      // 서버 요청
      const response = await api.sendMessage(text);
      // 성공 시 실제 데이터로 업데이트
      setMessages(prev => [...prev, response.data]);
    } catch (error) {
      // 실패 시 낙관적 업데이트 자동 롤백
      alert('전송 실패');
    }
  }

  return (
    <div>
      {optimisticMessages.map(msg => (
        <div key={msg.id} className={msg.sending ? 'opacity-50' : ''}>
          {msg.text}
        </div>
      ))}
    </div>
  );
}`;

  const todoExampleCode = `function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Task 1', completed: false }
  ]);

  const [optimisticTodos, updateOptimisticTodo] = useOptimistic(
    todos,
    (state, { id, completed }) =>
      state.map(todo =>
        todo.id === id
          ? { ...todo, completed, updating: true }
          : todo
      )
  );

  async function toggleTodo(id: number, completed: boolean) {
    // 즉시 UI 업데이트
    updateOptimisticTodo({ id, completed });

    try {
      await api.updateTodo(id, { completed });
      setTodos(prev =>
        prev.map(todo =>
          todo.id === id ? { ...todo, completed } : todo
        )
      );
    } catch (error) {
      // 실패 시 자동 롤백
    }
  }

  return (
    <ul>
      {optimisticTodos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={(e) => toggleTodo(todo.id, e.target.checked)}
            disabled={todo.updating}
          />
          <span className={todo.updating ? 'opacity-50' : ''}>
            {todo.text}
          </span>
        </li>
      ))}
    </ul>
  );
}`;

  const formActionCode = `import { useOptimistic, useActionState } from 'react';

function LikeButton({ postId, initialLikes }) {
  const [likes, setLikes] = useState(initialLikes);
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    (state) => state + 1
  );

  const [, formAction, isPending] = useActionState(
    async () => {
      addOptimisticLike(null);

      try {
        const newLikes = await api.likePost(postId);
        setLikes(newLikes);
      } catch (error) {
        // 롤백
      }
    },
    null
  );

  return (
    <form action={formAction}>
      <button disabled={isPending}>
        ❤️ {optimisticLikes} {isPending && '...'}
      </button>
    </form>
  );
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          useOptimistic
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          낙관적 UI 업데이트를 위한 React 19 Hook
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
          💡 낙관적 업데이트란?
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          서버 응답을 기다리지 않고 즉시 UI를 업데이트하여 더 나은 사용자 경험을 제공하는 패턴입니다.
          <br />
          요청이 실패하면 자동으로 이전 상태로 롤백됩니다.
        </p>
      </div>

      <HookDemo
        title="메시지 전송"
        description="메시지를 전송하면 즉시 화면에 표시되고, 전송 중임을 나타냅니다"
      >
        <div className="space-y-4">
          <div className="max-h-64 space-y-2 overflow-y-auto rounded border border-gray-300 p-4 dark:border-gray-700">
            {optimisticMessages.map((message) => (
              <div
                key={message.id}
                className={`rounded bg-blue-100 p-3 dark:bg-blue-900/30 ${
                  message.sending ? 'opacity-50' : ''
                }`}
              >
                <p className="text-sm">{message.text}</p>
                {message.sending && (
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    전송 중...
                  </p>
                )}
              </div>
            ))}
          </div>

          <form
            action={handleSendMessage}
            className="flex gap-2"
          >
            <input
              name="message"
              type="text"
              placeholder="메시지를 입력하세요..."
              className="flex-1 rounded border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
            />
            <button
              type="submit"
              className="rounded bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
            >
              전송
            </button>
          </form>

          <p className="text-xs text-gray-600 dark:text-gray-400">
            💡 메시지를 보내면 즉시 목록에 표시되며, 실제 전송이 완료될 때까지 흐릿하게 표시됩니다
          </p>
        </div>
      </HookDemo>

      <CodeBlock
        code={basicUsageCode}
        title="기본 사용법"
        language="typescript"
      />

      <HookDemo
        title="Todo 완료 토글"
        description="체크박스를 클릭하면 즉시 상태가 변경됩니다"
        variant="info"
      >
        <div className="space-y-3">
          {optimisticTodos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center gap-3 rounded border border-gray-300 p-3 dark:border-gray-700 ${
                todo.updating ? 'opacity-50' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={(e) => handleToggleTodo(todo.id, e.target.checked)}
                disabled={todo.updating}
                className="h-5 w-5"
              />
              <span
                className={`flex-1 ${
                  todo.completed ? 'text-gray-500 line-through' : ''
                }`}
              >
                {todo.text}
              </span>
              {todo.updating && (
                <span className="text-xs text-gray-500">업데이트 중...</span>
              )}
            </div>
          ))}
        </div>
      </HookDemo>

      <CodeBlock
        code={todoExampleCode}
        title="Todo 토글 예제"
        language="typescript"
      />

      <CodeBlock
        code={formActionCode}
        title="useActionState와 함께 사용"
        language="typescript"
      />

      <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ✅ useOptimistic의 장점
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• 즉각적인 UI 피드백으로 더 나은 사용자 경험</li>
          <li>• 네트워크 지연 시간 동안 앱이 반응적으로 느껴짐</li>
          <li>• 실패 시 자동 롤백으로 일관된 상태 유지</li>
          <li>• useActionState와 완벽하게 통합</li>
          <li>• 복잡한 롤백 로직을 작성할 필요 없음</li>
        </ul>
      </div>

      <div className="rounded-lg border border-purple-200 bg-purple-50 p-6 dark:border-purple-900 dark:bg-purple-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          🎯 사용 사례
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• <strong>채팅 앱:</strong> 메시지 즉시 표시</li>
          <li>• <strong>좋아요/북마크:</strong> 클릭 즉시 상태 변경</li>
          <li>• <strong>Todo 앱:</strong> 체크박스 즉시 반영</li>
          <li>• <strong>폼 제출:</strong> 제출 즉시 UI 업데이트</li>
          <li>• <strong>댓글 작성:</strong> 작성 즉시 목록에 표시</li>
        </ul>
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-900 dark:bg-yellow-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ⚠️ 주의사항
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• useOptimistic는 비동기 작업 중에만 임시 상태를 유지합니다</li>
          <li>• 실제 상태는 여전히 setState로 관리해야 합니다</li>
          <li>• 낙관적 업데이트는 실패할 수 있음을 고려하세요</li>
          <li>• 사용자에게 업데이트 중임을 시각적으로 표시하세요 (opacity, 로딩 등)</li>
          <li>• React 19 이상에서만 사용 가능합니다</li>
        </ul>
      </div>

      <div className="rounded-lg border border-orange-200 bg-orange-50 p-6 dark:border-orange-900 dark:bg-orange-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          🔄 동작 원리
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>updateFn 호출 → 낙관적 상태 즉시 업데이트 → UI 즉시 반영</li>
          <li>비동기 작업 시작 (API 호출 등)</li>
          <li>성공 시: setState로 실제 상태 업데이트 → 낙관적 상태 자동 제거</li>
          <li>실패 시: 낙관적 상태 자동 롤백 → 원래 상태로 복원</li>
        </ol>
      </div>
    </div>
  );
}

export default UseOptimisticPage;
