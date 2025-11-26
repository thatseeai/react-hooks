import { useSyncExternalStore } from 'react';
import { HookDemo } from '@/components/HookDemo';
import { CodeBlock } from '@/components/CodeBlock';

// 외부 스토어 예제: 온라인 상태
function subscribe(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true // SSR용 초기값
  );
}

// 윈도우 크기 스토어
function subscribeToWindowSize(callback: () => void) {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}

function useWindowSize() {
  return useSyncExternalStore(
    subscribeToWindowSize,
    () => ({ width: window.innerWidth, height: window.innerHeight }),
    () => ({ width: 0, height: 0 })
  );
}

// 간단한 카운터 스토어
let count = 0;
const listeners = new Set<() => void>();

const counterStore = {
  getSnapshot() {
    return count;
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  increment() {
    count++;
    listeners.forEach((listener) => listener());
  },
  decrement() {
    count--;
    listeners.forEach((listener) => listener());
  },
};

function useCounterStore() {
  return useSyncExternalStore(
    counterStore.subscribe,
    counterStore.getSnapshot
  );
}

function UseSyncExternalStorePage(): React.ReactElement {
  const isOnline = useOnlineStatus();
  const windowSize = useWindowSize();
  const count = useCounterStore();

  const basicUsageCode = `import { useSyncExternalStore } from 'react';

function subscribe(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,                    // 구독 함수
    () => navigator.onLine,       // 클라이언트 스냅샷
    () => true                    // 서버 스냅샷 (옵션)
  );
}`;

  const externalStoreCode = `// 외부 스토어 정의
let count = 0;
const listeners = new Set<() => void>();

const store = {
  getSnapshot() {
    return count;
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  increment() {
    count++;
    // 모든 리스너에게 알림
    listeners.forEach((l) => l());
  },
};

// Hook으로 사용
function useStore() {
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot
  );
}`;

  const windowSizeCode = `function subscribeToWindowSize(callback: () => void) {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}

function useWindowSize() {
  return useSyncExternalStore(
    subscribeToWindowSize,
    () => ({
      width: window.innerWidth,
      height: window.innerHeight,
    }),
    () => ({ width: 0, height: 0 }) // SSR
  );
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          useSyncExternalStore
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          외부 스토어를 구독하는 React Hook
        </p>
        <div className="mt-2 flex items-center space-x-2 text-sm">
          <span className="rounded bg-blue-100 px-2 py-1 font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            React 18+
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600 dark:text-gray-400">기타</span>
        </div>
      </div>

      <HookDemo
        title="온라인 상태 감지"
        description="브라우저의 온라인/오프라인 상태를 추적합니다"
      >
        <div className="space-y-4">
          <div
            className={`rounded p-6 text-center text-white ${
              isOnline ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            <p className="text-2xl font-bold">
              {isOnline ? '🟢 온라인' : '🔴 오프라인'}
            </p>
            <p className="mt-2 text-sm">
              {isOnline
                ? '인터넷에 연결되어 있습니다'
                : '인터넷 연결이 끊어졌습니다'}
            </p>
          </div>

          <div className="rounded bg-blue-100 p-3 dark:bg-blue-900/30">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 개발자 도구의 Network 탭에서 "Offline"을 선택하여 테스트해보세요
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
        title="윈도우 크기 감지"
        description="브라우저 창 크기 변화를 실시간으로 추적합니다"
        variant="info"
      >
        <div className="space-y-4">
          <div className="rounded bg-purple-100 p-6 dark:bg-purple-900/30">
            <p className="text-lg font-semibold text-purple-900 dark:text-purple-100">
              현재 윈도우 크기
            </p>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-purple-700 dark:text-purple-300">너비</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {windowSize.width}px
                </p>
              </div>
              <div>
                <p className="text-sm text-purple-700 dark:text-purple-300">높이</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {windowSize.height}px
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            브라우저 창 크기를 조절해보세요
          </p>
        </div>
      </HookDemo>

      <CodeBlock
        code={windowSizeCode}
        title="윈도우 크기 감지"
        language="typescript"
      />

      <HookDemo
        title="커스텀 스토어"
        description="외부 스토어를 만들고 구독합니다"
      >
        <div className="space-y-4">
          <div className="rounded bg-gray-100 p-6 dark:bg-gray-800">
            <p className="text-3xl font-bold text-center">{count}</p>
          </div>

          <div className="flex justify-center gap-2">
            <button
              onClick={() => counterStore.increment()}
              className="rounded bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700"
              type="button"
            >
              +1
            </button>
            <button
              onClick={() => counterStore.decrement()}
              className="rounded bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700"
              type="button"
            >
              -1
            </button>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            이 카운터는 React 외부의 스토어에 저장되어 있습니다
          </p>
        </div>
      </HookDemo>

      <CodeBlock
        code={externalStoreCode}
        title="외부 스토어 구현"
        language="typescript"
      />

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          💡 useSyncExternalStore가 필요한 이유
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• <strong>티어링 방지:</strong> Concurrent 렌더링 중 UI 불일치 방지</li>
          <li>• <strong>외부 데이터:</strong> React 외부의 mutable 데이터 구독</li>
          <li>• <strong>브라우저 API:</strong> navigator, window 등의 상태 추적</li>
          <li>• <strong>서드파티 스토어:</strong> Redux, MobX 등과 통합</li>
        </ul>
      </div>

      <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ✅ 사용 사례
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• 브라우저 API 구독 (navigator.onLine, matchMedia 등)</li>
          <li>• 전역 상태 라이브러리 통합 (Redux, Zustand 등)</li>
          <li>• WebSocket 연결 상태</li>
          <li>• LocalStorage 변경 감지</li>
          <li>• 커스텀 이벤트 시스템</li>
        </ul>
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-900 dark:bg-yellow-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ⚠️ 주의사항
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• getSnapshot은 반드시 동일한 값에 대해 동일한 참조를 반환해야 합니다</li>
          <li>• subscribe 함수는 cleanup 함수를 반환해야 합니다</li>
          <li>• React 상태는 useSyncExternalStore를 사용하지 마세요 (useState 사용)</li>
          <li>• getSnapshot이 매번 새 객체를 반환하면 무한 리렌더링이 발생합니다</li>
        </ul>
      </div>
    </div>
  );
}

export default UseSyncExternalStorePage;
