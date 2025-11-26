import { useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { HookDemo } from '@/components/HookDemo';
import { CodeBlock } from '@/components/CodeBlock';

interface FancyInputRef {
  focus: () => void;
  shake: () => void;
  getValue: () => string;
}

const FancyInput = forwardRef<FancyInputRef, { placeholder?: string }>(
  function FancyInput({ placeholder }, ref) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isShaking, setIsShaking] = useState(false);

    useImperativeHandle(ref, () => ({
      focus() {
        inputRef.current?.focus();
      },
      shake() {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
      },
      getValue() {
        return inputRef.current?.value || '';
      },
    }));

    return (
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className={`w-full rounded border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-800 ${
          isShaking ? 'animate-shake' : ''
        }`}
      />
    );
  }
);

interface VideoRef {
  play: () => void;
  pause: () => void;
  getCurrentTime: () => number;
}

const VideoPlayer = forwardRef<VideoRef>(function VideoPlayer(_props, ref) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useImperativeHandle(ref, () => ({
    play() {
      videoRef.current?.play();
    },
    pause() {
      videoRef.current?.pause();
    },
    getCurrentTime() {
      return videoRef.current?.currentTime || 0;
    },
  }));

  return (
    <div className="rounded bg-gray-900 p-4">
      <div className="text-center text-white">
        <p className="text-sm">비디오 플레이어 (시뮬레이션)</p>
        <div className="mt-2 h-32 rounded bg-gray-800 flex items-center justify-center">
          <span className="text-4xl">▶️</span>
        </div>
      </div>
    </div>
  );
});

function UseImperativeHandlePage(): React.ReactElement {
  const fancyInputRef = useRef<FancyInputRef>(null);
  const videoRef = useRef<VideoRef>(null);

  function handleFocus(): void {
    fancyInputRef.current?.focus();
  }

  function handleShake(): void {
    fancyInputRef.current?.shake();
  }

  function handleGetValue(): void {
    const value = fancyInputRef.current?.getValue();
    alert(`입력 값: ${value || '(없음)'}`);
  }

  const basicUsageCode = `import { useRef, useImperativeHandle, forwardRef } from 'react';

interface InputRef {
  focus: () => void;
  getValue: () => string;
}

const FancyInput = forwardRef<InputRef>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // ref로 노출할 메서드 정의
  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus();
    },
    getValue() {
      return inputRef.current?.value || '';
    },
  }));

  return <input ref={inputRef} />;
});

// 사용
function Parent() {
  const ref = useRef<InputRef>(null);

  return (
    <>
      <FancyInput ref={ref} />
      <button onClick={() => ref.current?.focus()}>
        Focus
      </button>
    </>
  );
}`;

  const customMethodsCode = `interface VideoRef {
  play: () => void;
  pause: () => void;
  getCurrentTime: () => number;
}

const VideoPlayer = forwardRef<VideoRef>((props, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useImperativeHandle(ref, () => ({
    play() {
      videoRef.current?.play();
    },
    pause() {
      videoRef.current?.pause();
    },
    getCurrentTime() {
      return videoRef.current?.currentTime || 0;
    },
  }));

  return <video ref={videoRef}>{/* ... */}</video>;
});`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          useImperativeHandle
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          ref로 노출할 핸들을 커스터마이징하는 React Hook
        </p>
        <div className="mt-2 flex items-center space-x-2 text-sm">
          <span className="rounded bg-blue-100 px-2 py-1 font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            React 16.8+
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600 dark:text-gray-400">DOM 접근</span>
        </div>
      </div>

      <HookDemo
        title="커스텀 Input 컴포넌트"
        description="부모가 자식의 커스텀 메서드를 호출할 수 있습니다"
      >
        <div className="space-y-4">
          <FancyInput ref={fancyInputRef} placeholder="텍스트를 입력하세요..." />

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleFocus}
              className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
              type="button"
            >
              포커스
            </button>
            <button
              onClick={handleShake}
              className="rounded bg-orange-600 px-4 py-2 font-medium text-white hover:bg-orange-700"
              type="button"
            >
              흔들기
            </button>
            <button
              onClick={handleGetValue}
              className="rounded bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
              type="button"
            >
              값 가져오기
            </button>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            💡 부모 컴포넌트는 ref를 통해 자식의 커스텀 메서드를 호출합니다
          </p>
        </div>
      </HookDemo>

      <CodeBlock
        code={basicUsageCode}
        title="기본 사용법"
        language="typescript"
      />

      <HookDemo
        title="비디오 플레이어 제어"
        description="복잡한 컴포넌트의 public API 정의"
        variant="info"
      >
        <div className="space-y-4">
          <VideoPlayer ref={videoRef} />

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => videoRef.current?.play()}
              className="rounded bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
              type="button"
            >
              재생
            </button>
            <button
              onClick={() => videoRef.current?.pause()}
              className="rounded bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
              type="button"
            >
              일시정지
            </button>
            <button
              onClick={() => {
                const time = videoRef.current?.getCurrentTime();
                alert(`현재 시간: ${time}초`);
              }}
              className="rounded bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700"
              type="button"
            >
              현재 시간
            </button>
          </div>
        </div>
      </HookDemo>

      <CodeBlock
        code={customMethodsCode}
        title="커스텀 메서드 노출"
        language="typescript"
      />

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          💡 사용 사례
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• 입력 필드에 포커스 주기</li>
          <li>• 미디어 플레이어 제어 (재생, 일시정지 등)</li>
          <li>• 스크롤 위치 제어</li>
          <li>• 모달 열기/닫기</li>
          <li>• 폼 유효성 검사 트리거</li>
        </ul>
      </div>

      <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ✅ 모범 사례
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• 명령형 API만 노출하세요 (focus, play 등)</li>
          <li>• forwardRef와 함께 사용하세요</li>
          <li>• TypeScript interface로 ref 타입을 명시하세요</li>
          <li>• 부모가 직접 DOM을 조작하지 않도록 하세요</li>
        </ul>
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-900 dark:bg-yellow-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ⚠️ 주의사항
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• ref를 과도하게 사용하지 마세요 - 가능하면 props 사용</li>
          <li>• DOM 노드 전체를 노출하지 말고 필요한 메서드만 노출하세요</li>
          <li>• 렌더링 중에는 ref.current를 읽거나 쓰지 마세요</li>
          <li>• React가 관리하는 데이터를 ref를 통해 조작하지 마세요</li>
        </ul>
      </div>
    </div>
  );
}

export default UseImperativeHandlePage;
