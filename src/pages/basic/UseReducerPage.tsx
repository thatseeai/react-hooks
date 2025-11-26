import { useReducer } from 'react';
import { HookDemo } from '@/components/HookDemo';
import { CodeBlock } from '@/components/CodeBlock';

// 카운터 타입 정의
interface CounterState {
  count: number;
}

type CounterAction =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'incrementByAmount'; payload: number }
  | { type: 'reset' };

function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'incrementByAmount':
      return { count: state.count + action.payload };
    case 'reset':
      return { count: 0 };
    default:
      return state;
  }
}

// 할 일 목록 타입 정의
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
}

type TodoAction =
  | { type: 'addTodo'; payload: string }
  | { type: 'toggleTodo'; payload: number }
  | { type: 'deleteTodo'; payload: number }
  | { type: 'setFilter'; payload: 'all' | 'active' | 'completed' }
  | { type: 'clearCompleted' };

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'addTodo':
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text: action.payload,
            completed: false,
          },
        ],
      };
    case 'toggleTodo':
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
        ),
      };
    case 'deleteTodo':
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    case 'setFilter':
      return {
        ...state,
        filter: action.payload,
      };
    case 'clearCompleted':
      return {
        ...state,
        todos: state.todos.filter((todo) => !todo.completed),
      };
    default:
      return state;
  }
}

function UseReducerPage(): React.ReactElement {
  const [counterState, counterDispatch] = useReducer(counterReducer, { count: 0 });
  const [todoState, todoDispatch] = useReducer(todoReducer, {
    todos: [],
    filter: 'all',
  });

  const filteredTodos = todoState.todos.filter((todo) => {
    if (todoState.filter === 'active') return !todo.completed;
    if (todoState.filter === 'completed') return todo.completed;
    return true;
  });

  function handleAddTodo(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const text = formData.get('todo') as string;
    if (text.trim()) {
      todoDispatch({ type: 'addTodo', payload: text });
      e.currentTarget.reset();
    }
  }

  const basicUsageCode = `import { useReducer } from 'react';

interface State {
  count: number;
}

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>
        +1
      </button>
    </div>
  );
}`;

  const complexExampleCode = `interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface State {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
}

type Action =
  | { type: 'addTodo'; payload: string }
  | { type: 'toggleTodo'; payload: number }
  | { type: 'deleteTodo'; payload: number }
  | { type: 'setFilter'; payload: 'all' | 'active' | 'completed' };

function todoReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'addTodo':
      return {
        ...state,
        todos: [...state.todos, {
          id: Date.now(),
          text: action.payload,
          completed: false,
        }],
      };
    case 'toggleTodo':
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };
    // ... 다른 액션들
    default:
      return state;
  }
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          useReducer
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          복잡한 상태 로직을 reducer 함수로 관리하는 React Hook
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
        description="useReducer를 사용한 간단한 카운터 예제"
      >
        <div className="space-y-4">
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Count: {counterState.count}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => counterDispatch({ type: 'increment' })}
              className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
              type="button"
            >
              +1
            </button>
            <button
              onClick={() => counterDispatch({ type: 'decrement' })}
              className="rounded bg-gray-600 px-4 py-2 font-medium text-white hover:bg-gray-700"
              type="button"
            >
              -1
            </button>
            <button
              onClick={() =>
                counterDispatch({ type: 'incrementByAmount', payload: 10 })
              }
              className="rounded bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700"
              type="button"
            >
              +10
            </button>
            <button
              onClick={() => counterDispatch({ type: 'reset' })}
              className="rounded bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
              type="button"
            >
              Reset
            </button>
          </div>
        </div>
      </HookDemo>

      <CodeBlock
        code={basicUsageCode}
        title="기본 사용법"
        language="typescript"
      />

      <HookDemo
        title="복잡한 상태 관리 - Todo 앱"
        description="여러 액션 타입과 복잡한 상태를 관리하는 예제"
        variant="info"
      >
        <div className="space-y-4">
          <form onSubmit={handleAddTodo} className="flex space-x-2">
            <input
              type="text"
              name="todo"
              placeholder="할 일을 입력하세요..."
              className="flex-1 rounded border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
            />
            <button
              type="submit"
              className="rounded bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
            >
              추가
            </button>
          </form>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              필터:
            </span>
            {(['all', 'active', 'completed'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => todoDispatch({ type: 'setFilter', payload: filter })}
                className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                  todoState.filter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
                }`}
                type="button"
              >
                {filter === 'all' ? '전체' : filter === 'active' ? '진행중' : '완료'}
              </button>
            ))}
            {todoState.todos.some((t) => t.completed) && (
              <button
                onClick={() => todoDispatch({ type: 'clearCompleted' })}
                className="ml-auto rounded bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
                type="button"
              >
                완료된 항목 삭제
              </button>
            )}
          </div>

          <ul className="space-y-2">
            {filteredTodos.length === 0 ? (
              <li className="text-sm text-gray-500">할 일이 없습니다</li>
            ) : (
              filteredTodos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between rounded bg-gray-100 px-4 py-3 dark:bg-gray-800"
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() =>
                        todoDispatch({ type: 'toggleTodo', payload: todo.id })
                      }
                      className="h-4 w-4 rounded"
                    />
                    <span
                      className={`${
                        todo.completed
                          ? 'text-gray-500 line-through'
                          : 'text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      {todo.text}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      todoDispatch({ type: 'deleteTodo', payload: todo.id })
                    }
                    className="text-red-600 hover:text-red-800 dark:text-red-400"
                    type="button"
                  >
                    삭제
                  </button>
                </li>
              ))
            )}
          </ul>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            전체: {todoState.todos.length} | 진행중:{' '}
            {todoState.todos.filter((t) => !t.completed).length} | 완료:{' '}
            {todoState.todos.filter((t) => t.completed).length}
          </div>
        </div>
      </HookDemo>

      <CodeBlock
        code={complexExampleCode}
        title="복잡한 상태 관리"
        language="typescript"
      />

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          💡 useState vs useReducer
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• <strong>useState 사용</strong>: 단순한 상태, 독립적인 상태 변수</li>
          <li>• <strong>useReducer 사용</strong>: 복잡한 상태 로직, 여러 하위 값을 포함하는 상태, 다음 상태가 이전 상태에 의존적인 경우</li>
          <li>• useReducer는 Redux와 유사한 패턴으로 상태 업데이트를 예측 가능하게 만듭니다</li>
          <li>• 액션 타입을 TypeScript로 정의하면 타입 안전성을 확보할 수 있습니다</li>
        </ul>
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-900 dark:bg-yellow-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ⚠️ 주의사항
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• Reducer 함수는 순수 함수여야 합니다 (부수 효과 없음)</li>
          <li>• 상태 객체는 불변성을 유지해야 합니다</li>
          <li>• dispatch 함수는 리렌더링 간에 동일한 참조를 유지합니다</li>
          <li>• 초기 상태 계산이 비용이 크다면 세 번째 인자로 초기화 함수를 전달하세요</li>
        </ul>
      </div>
    </div>
  );
}

export default UseReducerPage;
