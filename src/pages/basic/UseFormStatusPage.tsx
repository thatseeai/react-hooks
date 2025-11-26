import { useActionState } from 'react';
import { HookDemo } from '@/components/HookDemo';
import { CodeBlock } from '@/components/CodeBlock';

async function submitMessage(_prevState: { message: string }, formData: FormData): Promise<{ message: string }> {
  const text = formData.get('message') as string;

  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (!text || text.trim() === '') {
    return { message: '❌ 메시지를 입력해주세요' };
  }

  return { message: `✅ 메시지가 전송되었습니다: "${text}"` };
}

function UseFormStatusPage(): React.ReactElement {
  const [state, formAction, isPending] = useActionState(
    submitMessage,
    { message: '' }
  );

  const basicUsageCode = `import { useFormStatus } from 'react';

// 주의: useFormStatus는 <form> 내부의 컴포넌트에서만 작동합니다
function SubmitButton() {
  const { pending, data, method, action } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? '제출 중...' : '제출'}
    </button>
  );
}

function Form() {
  return (
    <form action={handleSubmit}>
      <input name="email" type="email" />
      {/* SubmitButton은 form의 자식 컴포넌트여야 함 */}
      <SubmitButton />
    </form>
  );
}`;

  const completeExampleCode = `import { useFormStatus, useActionState } from 'react';

async function submitForm(prevState, formData) {
  const email = formData.get('email');
  await api.submit(email);
  return { message: 'Success!' };
}

// Form 내부의 컴포넌트
function FormButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Spinner /> 제출 중...
        </>
      ) : (
        '제출'
      )}
    </button>
  );
}

function FormFields() {
  const { pending } = useFormStatus();

  return (
    <input
      type="email"
      name="email"
      disabled={pending}
      placeholder="이메일을 입력하세요"
    />
  );
}

// 메인 컴포넌트
function ContactForm() {
  const [state, formAction] = useActionState(submitForm, {});

  return (
    <form action={formAction}>
      <FormFields />
      <FormButton />
      {state.message && <p>{state.message}</p>}
    </form>
  );
}`;

  const returnValuesCode = `const { pending, data, method, action } = useFormStatus();

// pending: boolean - 폼이 제출 중인지 여부
// data: FormData | null - 제출 중인 폼 데이터
// method: string - HTTP 메서드 ("get" 또는 "post")
// action: string | null - action prop에 전달된 URL 또는 함수`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          useFormStatus
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          폼 제출 상태 정보를 제공하는 React 19 Hook
        </p>
        <div className="mt-2 flex items-center space-x-2 text-sm">
          <span className="rounded bg-green-100 px-2 py-1 font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
            React 19+
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600 dark:text-gray-400">신규 Hook</span>
        </div>
      </div>

      <div className="rounded-lg border border-orange-200 bg-orange-50 p-6 dark:border-orange-900 dark:bg-orange-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ⚠️ 중요한 제약사항
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          useFormStatus는 반드시 <code className="px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-700">&lt;form&gt;</code> 태그 내부의 컴포넌트에서 호출되어야 합니다.
          <br />
          부모 폼의 상태만 읽을 수 있으며, 같은 컴포넌트나 자식 컴포넌트의 폼은 읽을 수 없습니다.
        </p>
      </div>

      <HookDemo
        title="폼 제출 상태 예제"
        description="useActionState와 함께 사용하여 제출 상태 표시"
      >
        <form action={formAction} className="space-y-4">
          <input
            name="message"
            type="text"
            placeholder="메시지를 입력하세요..."
            className="w-full rounded border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
            disabled={isPending}
          />

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? '⏳ 제출 중...' : '제출'}
          </button>

          {state.message && (
            <div className={`rounded p-3 ${
              state.message.includes('✅')
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {state.message}
            </div>
          )}
        </form>
      </HookDemo>

      <CodeBlock
        code={basicUsageCode}
        title="기본 사용법"
        language="typescript"
      />

      <CodeBlock
        code={completeExampleCode}
        title="완전한 예제"
        language="typescript"
      />

      <CodeBlock
        code={returnValuesCode}
        title="반환값"
        language="typescript"
      />

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          💡 useFormStatus의 장점
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• 제출 버튼의 상태를 자동으로 관리</li>
          <li>• 여러 필드를 동시에 disable 처리 가능</li>
          <li>• 부모 폼의 제출 상태를 자식 컴포넌트에서 접근</li>
          <li>• 로딩 인디케이터 표시가 간단함</li>
          <li>• useActionState와 완벽하게 통합</li>
        </ul>
      </div>

      <div className="rounded-lg border border-purple-200 bg-purple-50 p-6 dark:border-purple-900 dark:bg-purple-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          🎯 사용 사례
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• <strong>제출 버튼:</strong> pending 상태에 따라 비활성화</li>
          <li>• <strong>로딩 스피너:</strong> 제출 중 표시</li>
          <li>• <strong>입력 필드:</strong> 제출 중 비활성화</li>
          <li>• <strong>진행 표시:</strong> 제출 진행 상태 시각화</li>
        </ul>
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-900 dark:bg-yellow-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ⚠️ 주의사항
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• useFormStatus는 폼 태그의 자식 컴포넌트에서만 호출 가능</li>
          <li>• 부모 폼의 상태만 읽을 수 있습니다</li>
          <li>• 중첩된 폼의 경우 가장 가까운 부모 폼의 상태를 반환</li>
          <li>• React 19 이상에서만 사용 가능</li>
        </ul>
      </div>

      <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ✅ 모범 사례
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• 재사용 가능한 폼 버튼 컴포넌트를 만드세요</li>
          <li>• pending 상태일 때 입력 필드를 비활성화하세요</li>
          <li>• 명확한 로딩 상태를 사용자에게 보여주세요</li>
          <li>• useActionState와 함께 사용하여 완전한 폼 관리</li>
        </ul>
      </div>
    </div>
  );
}

export default UseFormStatusPage;
