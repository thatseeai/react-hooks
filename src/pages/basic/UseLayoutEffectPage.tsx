import { useState, useLayoutEffect, useRef } from 'react';
import { HookDemo } from '@/components/HookDemo';
import { CodeBlock } from '@/components/CodeBlock';

function UseLayoutEffectPage(): React.ReactElement {
  const [show, setShow] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  // useLayoutEffect로 DOM 측정 - 화면에 보이기 전에 실행
  useLayoutEffect(() => {
    if (boxRef.current) {
      const rect = boxRef.current.getBoundingClientRect();
      setWidth(rect.width);
      setHeight(rect.height);
    }
  }, [show]);

  // 툴팁 위치 계산
  useLayoutEffect(() => {
    if (buttonRef.current && show) {
      const rect = buttonRef.current.getBoundingClientRect();
      setTooltip({
        top: rect.bottom + 10,
        left: rect.left + rect.width / 2,
      });
    }
  }, [show]);

  const basicUsageCode = `import { useLayoutEffect, useRef } from 'react';

function Component() {
  const ref = useRef(null);

  // DOM이 업데이트된 직후, 브라우저가 화면을 그리기 전에 실행
  useLayoutEffect(() => {
    const element = ref.current;
    // DOM 측정이나 조작
    const height = element.getBoundingClientRect().height;
    console.log('Height:', height);
  }, []);

  return <div ref={ref}>Content</div>;
}`;

  const vsUseEffectCode = `// useEffect: 화면 업데이트 후 비동기적으로 실행
useEffect(() => {
  // 화면이 이미 그려진 후 실행
  // 사용자가 깜빡임을 볼 수 있음
}, []);

// useLayoutEffect: 화면 업데이트 전 동기적으로 실행
useLayoutEffect(() => {
  // 화면이 그려지기 전에 실행
  // 깜빡임 없이 부드러운 UI
}, []);`;

  const tooltipCode = `function Tooltip({ targetRef, content }) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 10,
        left: rect.left + rect.width / 2,
      });
    }
  }, [targetRef]);

  return (
    <div
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        transform: 'translateX(-50%)',
      }}
    >
      {content}
    </div>
  );
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          useLayoutEffect
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          브라우저가 화면을 다시 그리기 전에 실행되는 useEffect 버전
        </p>
        <div className="mt-2 flex items-center space-x-2 text-sm">
          <span className="rounded bg-blue-100 px-2 py-1 font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            React 16.8+
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600 dark:text-gray-400">부수 효과</span>
        </div>
      </div>

      <HookDemo
        title="DOM 측정"
        description="요소의 크기를 깜빡임 없이 측정합니다"
      >
        <div className="space-y-4">
          <button
            onClick={() => setShow(!show)}
            className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            type="button"
          >
            {show ? '숨기기' : '표시하기'}
          </button>

          {show && (
            <>
              <div
                ref={boxRef}
                className="rounded bg-gradient-to-r from-purple-500 to-pink-500 p-8 text-white"
              >
                <p className="text-lg font-bold">측정되는 박스</p>
                <p className="text-sm">useLayoutEffect로 크기를 측정합니다</p>
              </div>

              <div className="rounded bg-gray-100 p-4 dark:bg-gray-800">
                <p className="text-sm">
                  <strong>너비:</strong> {width.toFixed(2)}px
                </p>
                <p className="text-sm">
                  <strong>높이:</strong> {height.toFixed(2)}px
                </p>
              </div>
            </>
          )}
        </div>
      </HookDemo>

      <CodeBlock
        code={basicUsageCode}
        title="기본 사용법"
        language="typescript"
      />

      <HookDemo
        title="툴팁 위치 계산"
        description="버튼 위치를 기반으로 툴팁을 정확하게 배치"
        variant="info"
      >
        <div className="relative space-y-4">
          <button
            ref={buttonRef}
            onClick={() => setShow(!show)}
            className="rounded bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700"
            type="button"
          >
            툴팁 토글
          </button>

          {show && (
            <div
              style={{
                position: 'fixed',
                top: `${tooltip.top}px`,
                left: `${tooltip.left}px`,
                transform: 'translateX(-50%)',
                zIndex: 50,
              }}
              className="rounded bg-gray-900 px-3 py-2 text-sm text-white shadow-lg"
            >
              이것은 툴팁입니다
              <div
                className="absolute left-1/2 top-0 h-0 w-0 -translate-x-1/2 -translate-y-full border-8 border-transparent border-b-gray-900"
              />
            </div>
          )}
        </div>
      </HookDemo>

      <CodeBlock
        code={vsUseEffectCode}
        title="useEffect vs useLayoutEffect"
        language="typescript"
      />

      <CodeBlock
        code={tooltipCode}
        title="툴팁 위치 계산 예제"
        language="typescript"
      />

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          💡 useLayoutEffect 사용 시점
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• DOM 측정 (getBoundingClientRect, scrollHeight 등)</li>
          <li>• 화면 깜빡임 방지가 필요한 DOM 조작</li>
          <li>• 툴팁, 팝오버 등의 위치 계산</li>
          <li>• 애니메이션 시작 전 초기 상태 설정</li>
          <li>• 스크롤 위치 복원</li>
        </ul>
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-900 dark:bg-yellow-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ⚠️ 주의사항
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• useLayoutEffect는 동기적으로 실행되어 렌더링을 블로킹합니다</li>
          <li>• 가능하면 useEffect를 사용하고, 시각적 불일치가 있을 때만 useLayoutEffect 사용</li>
          <li>• 서버 사이드 렌더링에서는 작동하지 않습니다 (경고 발생)</li>
          <li>• 무거운 계산은 useLayoutEffect 안에서 하지 마세요</li>
          <li>• 대부분의 경우 useEffect로 충분합니다</li>
        </ul>
      </div>

      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          🚫 언제 사용하지 말아야 하나요?
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• 데이터 페칭 (useEffect 사용)</li>
          <li>• 이벤트 리스너 등록 (useEffect 사용)</li>
          <li>• 시각적 불일치가 없는 경우 (useEffect 사용)</li>
          <li>• 외부 시스템과의 동기화 (useEffect 사용)</li>
        </ul>
      </div>
    </div>
  );
}

export default UseLayoutEffectPage;
