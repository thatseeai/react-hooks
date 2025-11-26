import { useId } from 'react';
import { HookDemo } from '@/components/HookDemo';
import { CodeBlock } from '@/components/CodeBlock';

function FormWithUseId(): React.ReactElement {
  const emailId = useId();
  const passwordId = useId();
  const nameId = useId();

  return (
    <form className="space-y-4">
      <div>
        <label htmlFor={nameId} className="mb-1 block text-sm font-medium">
          이름
        </label>
        <input
          id={nameId}
          type="text"
          className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
          placeholder="홍길동"
        />
      </div>
      <div>
        <label htmlFor={emailId} className="mb-1 block text-sm font-medium">
          이메일
        </label>
        <input
          id={emailId}
          type="email"
          className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
          placeholder="hong@example.com"
        />
      </div>
      <div>
        <label htmlFor={passwordId} className="mb-1 block text-sm font-medium">
          비밀번호
        </label>
        <input
          id={passwordId}
          type="password"
          className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
          placeholder="••••••••"
        />
      </div>
      <div className="rounded bg-gray-100 p-3 dark:bg-gray-800">
        <p className="text-xs text-gray-600 dark:text-gray-400">생성된 ID:</p>
        <ul className="mt-1 space-y-1 text-xs font-mono">
          <li>Name ID: {nameId}</li>
          <li>Email ID: {emailId}</li>
          <li>Password ID: {passwordId}</li>
        </ul>
      </div>
    </form>
  );
}

function MultipleInstances(): React.ReactElement {
  const id1 = useId();
  const id2 = useId();

  return (
    <div className="space-y-4">
      <div className="rounded border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <p className="text-sm font-medium">첫 번째 인스턴스</p>
        <p className="mt-1 text-xs font-mono text-gray-600 dark:text-gray-400">
          ID: {id1}
        </p>
      </div>
      <div className="rounded border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <p className="text-sm font-medium">두 번째 인스턴스</p>
        <p className="mt-1 text-xs font-mono text-gray-600 dark:text-gray-400">
          ID: {id2}
        </p>
      </div>
    </div>
  );
}

function UseIdPage(): React.ReactElement {
  const basicUsageCode = `import { useId } from 'react';

function FormField() {
  const id = useId();

  return (
    <>
      <label htmlFor={id}>이메일</label>
      <input id={id} type="email" />
    </>
  );
}`;

  const multipleIdsCode = `function Form() {
  const emailId = useId();
  const passwordId = useId();

  return (
    <form>
      <label htmlFor={emailId}>이메일</label>
      <input id={emailId} type="email" />

      <label htmlFor={passwordId}>비밀번호</label>
      <input id={passwordId} type="password" />
    </form>
  );
}`;

  const prefixSuffixCode = `function Component() {
  const id = useId();

  return (
    <>
      {/* 여러 요소에 같은 ID를 접두사로 사용 */}
      <div>
        <label htmlFor={\`\${id}-email\`}>이메일</label>
        <input id={\`\${id}-email\`} type="email" />
      </div>

      <div>
        <label htmlFor={\`\${id}-phone\`}>전화번호</label>
        <input id={\`\${id}-phone\`} type="tel" />
      </div>
    </>
  );
}`;

  const ssrCode = `// 서버와 클라이언트에서 동일한 ID 생성
function ServerAndClientComponent() {
  const id = useId();

  // SSR 시 서버에서 생성된 ID와
  // 클라이언트 하이드레이션 시 ID가 동일함
  return <div id={id}>Content</div>;
}

// ❌ 절대 이렇게 하지 마세요
function Bad() {
  // Math.random()은 서버/클라이언트에서 다른 값 생성
  const id = Math.random().toString();
  return <div id={id}>Content</div>;
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          useId
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          접근성 속성에 사용할 고유 ID를 생성하는 React Hook
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
        title="폼 필드와 레이블 연결"
        description="각 입력 필드마다 고유한 ID를 생성하여 레이블과 연결합니다"
      >
        <FormWithUseId />
      </HookDemo>

      <CodeBlock
        code={basicUsageCode}
        title="기본 사용법"
        language="typescript"
      />

      <CodeBlock
        code={multipleIdsCode}
        title="여러 개의 ID 생성"
        language="typescript"
      />

      <HookDemo
        title="컴포넌트 인스턴스별 고유 ID"
        description="같은 컴포넌트의 여러 인스턴스가 각각 다른 ID를 받습니다"
        variant="info"
      >
        <MultipleInstances />
      </HookDemo>

      <CodeBlock
        code={prefixSuffixCode}
        title="ID를 접두사로 사용"
        language="typescript"
      />

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          💡 useId의 주요 용도
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• <strong>접근성 속성</strong>: aria-describedby, aria-labelledby 등</li>
          <li>• <strong>폼 요소</strong>: label의 htmlFor와 input의 id 연결</li>
          <li>• <strong>여러 관련 요소</strong>: 같은 ID를 접두사로 사용하여 관련 요소 그룹화</li>
          <li>• <strong>SSR 호환</strong>: 서버와 클라이언트에서 동일한 ID 생성 보장</li>
        </ul>
      </div>

      <CodeBlock
        code={ssrCode}
        title="SSR(서버 사이드 렌더링) 호환성"
        language="typescript"
      />

      <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ✅ 모범 사례
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• 접근성을 위한 ID가 필요할 때 useId를 사용하세요</li>
          <li>• 여러 관련 요소에는 접두사/접미사를 추가하여 사용하세요</li>
          <li>• 컴포넌트를 재사용 가능하게 만들 때 하드코딩된 ID 대신 useId 사용</li>
          <li>• CSS 선택자로는 사용하지 마세요 (예측 불가능한 형식)</li>
        </ul>
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-900 dark:bg-yellow-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ⚠️ 주의사항
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• useId는 리스트의 key로 사용하면 안 됩니다</li>
          <li>• 생성된 ID의 형식에 의존하지 마세요 (구현 세부사항)</li>
          <li>• ID가 필요하지 않은 경우 (예: CSS 스타일링)에는 사용하지 마세요</li>
          <li>• 동일한 컴포넌트의 여러 인스턴스는 각각 다른 ID를 받습니다</li>
        </ul>
      </div>
    </div>
  );
}

export default UseIdPage;
