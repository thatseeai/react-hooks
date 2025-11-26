import { useActionState } from 'react';
import { HookDemo } from '@/components/HookDemo';
import { CodeBlock } from '@/components/CodeBlock';

// 폼 액션 타입
async function addToCart(_prevState: { message: string }, formData: FormData): Promise<{ message: string }> {
  const product = formData.get('product') as string;

  // 비동기 작업 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (!product || product.trim() === '') {
    return { message: '❌ 제품 이름을 입력해주세요' };
  }

  return { message: `✅ "${product}" 장바구니에 추가되었습니다!` };
}

async function submitFeedback(_prevState: { message: string; success: boolean }, formData: FormData): Promise<{ message: string; success: boolean }> {
  const feedback = formData.get('feedback') as string;

  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (feedback.length < 10) {
    return { message: '피드백은 최소 10자 이상이어야 합니다', success: false };
  }

  return { message: '피드백이 성공적으로 제출되었습니다!', success: true };
}

function UseActionStatePage(): React.ReactElement {
  const [cartState, cartAction, isCartPending] = useActionState(
    addToCart,
    { message: '' }
  );

  const [feedbackState, feedbackAction, isFeedbackPending] = useActionState(
    submitFeedback,
    { message: '', success: false }
  );

  const basicUsageCode = `import { useActionState } from 'react';

async function addToCart(prevState, formData) {
  const product = formData.get('product');

  // 비동기 작업 (API 호출 등)
  await saveToDatabase(product);

  return { message: '장바구니에 추가되었습니다!' };
}

function Component() {
  const [state, formAction, isPending] = useActionState(
    addToCart,      // 액션 함수
    { message: '' } // 초기 상태
  );

  return (
    <form action={formAction}>
      <input name="product" />
      <button disabled={isPending}>
        {isPending ? '추가 중...' : '추가'}
      </button>
      {state.message && <p>{state.message}</p>}
    </form>
  );
}`;

  const withValidationCode = `async function submitForm(prevState, formData) {
  const email = formData.get('email');

  // 유효성 검사
  if (!email.includes('@')) {
    return { error: '유효한 이메일을 입력하세요' };
  }

  // API 호출
  const result = await api.submit(email);

  if (result.success) {
    return { message: '제출 완료!' };
  } else {
    return { error: result.error };
  }
}

function Form() {
  const [state, formAction, isPending] = useActionState(
    submitForm,
    { message: '', error: '' }
  );

  return (
    <form action={formAction}>
      <input name="email" type="email" />
      <button disabled={isPending}>제출</button>
      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
      {state.message && <p style={{ color: 'green' }}>{state.message}</p>}
    </form>
  );
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          useActionState
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          폼 액션 결과를 기반으로 상태를 업데이트하는 React 19 Hook
        </p>
        <div className="mt-2 flex items-center space-x-2 text-sm">
          <span className="rounded bg-green-100 px-2 py-1 font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
            React 19+
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600 dark:text-gray-400">신규 Hook</span>
        </div>
      </div>

      <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ✨ React 19의 새로운 기능
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          useActionState는 React 19에서 도입된 새로운 Hook으로, 폼 제출과 비동기 액션을 더 쉽게 관리할 수 있게 해줍니다.
          이전의 useFormState를 대체합니다.
        </p>
      </div>

      <HookDemo
        title="장바구니 추가 폼"
        description="제품을 장바구니에 추가하는 비동기 액션"
      >
        <form action={cartAction} className="space-y-4">
          <input
            name="product"
            type="text"
            placeholder="제품 이름을 입력하세요..."
            className="w-full rounded border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
            disabled={isCartPending}
          />

          <button
            type="submit"
            disabled={isCartPending}
            className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isCartPending ? '추가 중...' : '장바구니에 추가'}
          </button>

          {cartState.message && (
            <div className={`rounded p-3 ${
              cartState.message.includes('✅')
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {cartState.message}
            </div>
          )}
        </form>
      </HookDemo>

      <CodeBlock
        code={basicUsageCode}
        title="기본 사용법"
        language="typescript"
      />

      <HookDemo
        title="피드백 제출 폼"
        description="유효성 검사가 포함된 폼 액션"
        variant="info"
      >
        <form action={feedbackAction} className="space-y-4">
          <textarea
            name="feedback"
            rows={4}
            placeholder="피드백을 입력하세요 (최소 10자)..."
            className="w-full rounded border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
            disabled={isFeedbackPending}
          />

          <button
            type="submit"
            disabled={isFeedbackPending}
            className="w-full rounded bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {isFeedbackPending ? '제출 중...' : '피드백 제출'}
          </button>

          {feedbackState.message && (
            <div className={`rounded p-3 ${
              feedbackState.success
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            }`}>
              {feedbackState.message}
            </div>
          )}
        </form>
      </HookDemo>

      <CodeBlock
        code={withValidationCode}
        title="유효성 검사 포함"
        language="typescript"
      />

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          💡 useActionState의 장점
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• 폼 제출 상태를 자동으로 관리 (pending, success, error)</li>
          <li>• 서버 액션과 완벽하게 통합</li>
          <li>• 낙관적 UI 업데이트와 함께 사용 가능</li>
          <li>• 프로그레시브 인핸스먼트 지원 (JavaScript 없이도 작동)</li>
          <li>• 에러 처리가 간단함</li>
        </ul>
      </div>

      <div className="rounded-lg border border-purple-200 bg-purple-50 p-6 dark:border-purple-900 dark:bg-purple-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          🔄 반환값
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• <strong>state:</strong> 액션의 현재 상태 (초기값 또는 액션 함수의 반환값)</li>
          <li>• <strong>action:</strong> form의 action prop에 전달할 함수</li>
          <li>• <strong>isPending:</strong> 액션이 실행 중인지 여부 (boolean)</li>
        </ul>
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-900 dark:bg-yellow-950">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          ⚠️ 주의사항
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• 액션 함수는 반드시 Promise를 반환해야 합니다</li>
          <li>• 액션 함수의 첫 번째 인자는 이전 상태입니다</li>
          <li>• 두 번째 인자는 FormData 객체입니다</li>
          <li>• React 19 이상에서만 사용 가능합니다</li>
        </ul>
      </div>
    </div>
  );
}

export default UseActionStatePage;
