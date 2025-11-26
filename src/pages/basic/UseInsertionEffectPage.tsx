import { useInsertionEffect, useState } from 'react';
import { HookDemo } from '@/components/HookDemo';
import { CodeBlock } from '@/components/CodeBlock';

// CSS-in-JS 시뮬레이션
function useCSSRule(selector: string, rule: string) {
  useInsertionEffect(() => {
    // DOM 변경 전에 스타일 삽입
    const style = document.createElement('style');
    style.textContent = `${selector} { ${rule} }`;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [selector, rule]);
}

function DynamicStyledComponent() {
  const [color, setColor] = useState('blue');

  // 동적으로 CSS 규칙 삽입
  useCSSRule('.dynamic-box', `background-color: ${color}; padding: 2rem; border-radius: 0.5rem; color: white; text-align: center;`);

  return (
    <div className="space-y-4">
      <div className="dynamic-box">
        <p className="text-lg font-bold">동적 스타일 박스</p>
        <p className="text-sm">useInsertionEffect로 스타일이 적용되었습니다</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setColor('blue')}
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          type="button"
        >
          파란색
        </button>
        <button
          onClick={() => setColor('green')}
          className="rounded bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
          type="button"
        >
          초록색
        </button>
        <button
          onClick={() => setColor('purple')}
          className="rounded bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700"
          type="button"
        >
          보라색
        </button>
      </div>
    </div>
  );
}

function UseInsertionEffectPage(): React.ReactElement {
  const basicUsageCode = `import { useInsertionEffect } from 'react';

function useCSSRule(selector: string, rule: string) {
  useInsertionEffect(() => {
    // DOM 변경 전에 스타일 삽입
    const style = document.createElement('style');
    style.textContent = \`\${selector} { \${rule} }\`;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [selector, rule]);
}

// 사용
function Component() {
  useCSSRule('.my-class', 'color: red; font-size: 20px;');
  return <div className="my-class">Styled content</div>;
}`;

  const cssInJsCode = `// CSS-in-JS 라이브러리 예제
const styleCache = new Map();

function useStyle(css: string) {
  useInsertionEffect(() => {
    if (!styleCache.has(css)) {
      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);
      styleCache.set(css, style);
    }
    return () => {
      const style = styleCache.get(css);
      if (style) {
        document.head.removeChild(style);
        styleCache.delete(css);
      }
    };
  }, [css]);
}`;

  const comparisonCode = `// ❌ useEffect: 레이아웃 계산 후 스타일 삽입 (깜빡임)
useEffect(() => {
  const style = document.createElement('style');
  style.textContent = '.box { color: red; }';
  document.head.appendChild(style);
}, []);

// ❌ useLayoutEffect: 레이아웃 계산 전이지만 DOM 읽기 가능 (성능 문제)
useLayoutEffect(() => {
  const style = document.createElement('style');
  style.textContent = '.box { color: red; }';
  document.head.appendChild(style);
}, []);

// ✅ useInsertionEffect: DOM 변경 전 스타일 삽입 (최적)
useInsertionEffect(() => {
  const style = document.createElement('style');
  style.textContent = '.box { color: red; }';
  document.head.appendChild(style);
}, []);`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          useInsertionEffect
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          CSS-in-JS 라이브러리를 위한 React Hook
        </p>
        <div className="mt-2 flex items-center space-x-2 text-sm">
          <span className="rounded bg-blue-100 px-2 py-1 font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            React 18+
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600 dark:text-gray-400">부수 효과</span>
        </div>
      </div>

      <div className="rounded-lg border border-orange-200 bg-orange-50 p-6 dark:border-orange-900 dark:bg-orange-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ⚠️ 매우 특수한 Hook
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          useInsertionEffect는 CSS-in-JS 라이브러리 제작자를 위한 Hook입니다.
          <br />
          일반 애플리케이션 코드에서는 거의 사용하지 않으며, useEffect나 useLayoutEffect를 사용하는 것이 더 적절합니다.
        </p>
      </div>

      <HookDemo
        title="동적 스타일 삽입"
        description="DOM이 변경되기 전에 스타일을 삽입합니다"
      >
        <DynamicStyledComponent />
      </HookDemo>

      <CodeBlock
        code={basicUsageCode}
        title="기본 사용법"
        language="typescript"
      />

      <CodeBlock
        code={cssInJsCode}
        title="CSS-in-JS 라이브러리 예제"
        language="typescript"
      />

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          💡 실행 순서
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li><strong>useInsertionEffect</strong> 실행 (스타일 삽입)</li>
          <li>DOM 변경</li>
          <li><strong>useLayoutEffect</strong> 실행 (레이아웃 계산 전)</li>
          <li>브라우저가 화면 그리기</li>
          <li><strong>useEffect</strong> 실행 (화면 그린 후)</li>
        </ol>
      </div>

      <CodeBlock
        code={comparisonCode}
        title="useEffect vs useLayoutEffect vs useInsertionEffect"
        language="typescript"
      />

      <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ✅ useInsertionEffect의 장점
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• 레이아웃을 읽기 전에 스타일을 삽입하여 성능 최적화</li>
          <li>• 스타일 깜빡임 방지</li>
          <li>• CSS-in-JS 라이브러리의 성능 개선</li>
          <li>• React 18의 Concurrent 기능과 호환</li>
        </ul>
      </div>

      <div className="rounded-lg border border-purple-200 bg-purple-50 p-6 dark:border-purple-900 dark:bg-purple-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          🎯 사용 사례
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• <strong>CSS-in-JS 라이브러리:</strong> styled-components, emotion 등</li>
          <li>• <strong>동적 스타일 삽입:</strong> 런타임에 CSS 규칙 추가</li>
          <li>• <strong>스타일 우선순위:</strong> DOM 변경 전 스타일 보장</li>
        </ul>
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-900 dark:bg-yellow-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ⚠️ 주의사항
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• useInsertionEffect 내부에서 DOM을 읽거나 쓰지 마세요</li>
          <li>• 상태를 업데이트하지 마세요</li>
          <li>• ref는 아직 연결되지 않았습니다</li>
          <li>• 일반 애플리케이션 코드에서는 사용하지 마세요</li>
          <li>• CSS-in-JS 라이브러리 제작자만 사용하세요</li>
        </ul>
      </div>

      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          🚫 일반적으로는 사용하지 마세요
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          대부분의 경우 <code className="px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-700">useEffect</code> 또는{' '}
          <code className="px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-700">useLayoutEffect</code>를 사용하세요.
          <br />
          <br />
          useInsertionEffect는 매우 특수한 상황(CSS-in-JS 라이브러리 개발)에서만 필요합니다.
        </p>
      </div>
    </div>
  );
}

export default UseInsertionEffectPage;
