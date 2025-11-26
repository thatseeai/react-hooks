# React Hooks 완벽 가이드 프로젝트

## 프로젝트 개요

"React Hook의 모든 것" - React 19의 모든 Hook을 실제 사용 예제와 함께 학습할 수 있는 종합 가이드 애플리케이션

### 기술 스택

| 기술 | 버전 | 용도 |
|------|------|------|
| React | 19.x | UI 라이브러리 |
| TypeScript | 5.x | 정적 타입 시스템 |
| Vite | 6.x | 빌드 도구 |
| Vitest | 2.x | 테스트 프레임워크 |
| Tailwind CSS | 4.x | 스타일링 |
| TanStack Query | 5.x | 서버 상태 관리 |
| React Router | 7.x | 라우팅 |

## 프로젝트 구조

```
react-hooks-guide/
├── src/
│   ├── components/           # 공통 컴포넌트
│   │   ├── Layout/
│   │   ├── CodeBlock/
│   │   └── HookDemo/
│   ├── hooks/               # 커스텀 훅 예제
│   │   ├── basic/          # 기본 React 훅 래퍼
│   │   └── advanced/       # 고급 훅 패턴
│   ├── pages/
│   │   ├── basic/          # 기본 훅 데모 페이지
│   │   │   ├── UseStatePage.tsx
│   │   │   ├── UseEffectPage.tsx
│   │   │   ├── UseContextPage.tsx
│   │   │   ├── UseReducerPage.tsx
│   │   │   ├── UseCallbackPage.tsx
│   │   │   ├── UseMemoPage.tsx
│   │   │   ├── UseRefPage.tsx
│   │   │   ├── UseImperativeHandlePage.tsx
│   │   │   ├── UseLayoutEffectPage.tsx
│   │   │   ├── UseDebugValuePage.tsx
│   │   │   ├── UseDeferredValuePage.tsx
│   │   │   ├── UseTransitionPage.tsx
│   │   │   ├── UseIdPage.tsx
│   │   │   ├── UseSyncExternalStorePage.tsx
│   │   │   ├── UseInsertionEffectPage.tsx
│   │   │   ├── UseActionStatePage.tsx      # React 19 신규
│   │   │   ├── UseFormStatusPage.tsx       # React 19 신규
│   │   │   ├── UseOptimisticPage.tsx       # React 19 신규
│   │   │   └── UsePage.tsx                 # React 19 신규 (use hook)
│   │   └── advanced/       # 고급 훅 데모 페이지
│   │       ├── tanstack/
│   │       │   ├── UseQueryPage.tsx
│   │       │   ├── UseMutationPage.tsx
│   │       │   ├── UseInfiniteQueryPage.tsx
│   │       │   └── UseQueriesPage.tsx
│   │       └── patterns/
│   │           ├── CustomHookPatterns.tsx
│   │           └── CompositionPatterns.tsx
│   ├── contexts/            # Context 예제
│   ├── utils/               # 유틸리티 함수
│   ├── types/               # TypeScript 타입 정의
│   ├── __tests__/           # 테스트 파일
│   │   ├── hooks/
│   │   ├── components/
│   │   └── pages/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── docs/                    # 가이드 문서
│   ├── basic/
│   │   ├── useState.md
│   │   ├── useEffect.md
│   │   ├── useContext.md
│   │   ├── useReducer.md
│   │   ├── useCallback.md
│   │   ├── useMemo.md
│   │   ├── useRef.md
│   │   ├── useImperativeHandle.md
│   │   ├── useLayoutEffect.md
│   │   ├── useDebugValue.md
│   │   ├── useDeferredValue.md
│   │   ├── useTransition.md
│   │   ├── useId.md
│   │   ├── useSyncExternalStore.md
│   │   ├── useInsertionEffect.md
│   │   ├── useActionState.md
│   │   ├── useFormStatus.md
│   │   ├── useOptimistic.md
│   │   └── use.md
│   ├── advanced/
│   │   ├── tanstack-query.md
│   │   └── custom-hooks.md
│   └── patterns/
│       ├── composition.md
│       └── best-practices.md
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── tailwind.config.ts
├── eslint.config.js
└── CLAUDE.md
```

## 코딩 컨벤션

### TypeScript

- strict 모드 활성화
- 명시적 반환 타입 선언
- interface 우선 사용 (type alias는 유니온/교차 타입에만)
- 제네릭은 의미있는 이름 사용 (T보다 TData, TError 등)

```typescript
// ✅ Good
interface HookDemoProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function HookDemo({ title, description, children }: HookDemoProps): React.ReactElement {
  return (/* ... */);
}

// ❌ Bad
type Props = { title: string; }
const HookDemo = (props: Props) => {/* ... */}
```

### React 컴포넌트

- 함수 선언문 사용 (function 키워드)
- Props는 interface로 정의
- 커스텀 훅은 use 접두사 필수
- 훅 호출은 컴포넌트 최상단에서만

```typescript
// ✅ Good - 함수 선언문
function UseStatePage(): React.ReactElement {
  const [count, setCount] = useState(0);
  
  return (/* ... */);
}

// ❌ Bad - 화살표 함수
const UseStatePage = () => {
  // ...
}
```

### 파일 명명 규칙

| 유형 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `HookDemo.tsx` |
| 훅 | camelCase, use 접두사 | `useCounter.ts` |
| 유틸리티 | camelCase | `formatCode.ts` |
| 테스트 | 원본파일명.test.tsx | `useCounter.test.ts` |
| 타입 정의 | camelCase | `hookTypes.ts` |
| 문서 | kebab-case | `use-state.md` |

### 디렉토리 규칙

- 관련 파일은 같은 디렉토리에 배치
- index.ts로 public API 노출
- 테스트 파일은 `__tests__` 디렉토리 또는 동일 디렉토리의 `.test.ts` 파일

## React 19 Hook 목록

### 기본 Hooks (React Core)

#### 상태 관리
| Hook | 설명 | React 버전 |
|------|------|-----------|
| `useState` | 컴포넌트 상태 관리 | 16.8+ |
| `useReducer` | 복잡한 상태 로직 관리 | 16.8+ |
| `useContext` | Context 값 구독 | 16.8+ |

#### 부수 효과
| Hook | 설명 | React 버전 |
|------|------|-----------|
| `useEffect` | 사이드 이펙트 처리 | 16.8+ |
| `useLayoutEffect` | DOM 변경 후 동기적 실행 | 16.8+ |
| `useInsertionEffect` | CSS-in-JS 라이브러리용 | 18+ |

#### 성능 최적화
| Hook | 설명 | React 버전 |
|------|------|-----------|
| `useMemo` | 계산 결과 메모이제이션 | 16.8+ |
| `useCallback` | 함수 메모이제이션 | 16.8+ |
| `useDeferredValue` | 값 업데이트 지연 | 18+ |
| `useTransition` | 비긴급 상태 업데이트 | 18+ |

#### DOM 접근
| Hook | 설명 | React 버전 |
|------|------|-----------|
| `useRef` | 가변 참조 객체 | 16.8+ |
| `useImperativeHandle` | ref로 노출할 인스턴스 커스터마이징 | 16.8+ |

#### 기타
| Hook | 설명 | React 버전 |
|------|------|-----------|
| `useId` | 고유 ID 생성 | 18+ |
| `useDebugValue` | DevTools 커스텀 라벨 | 16.8+ |
| `useSyncExternalStore` | 외부 스토어 구독 | 18+ |

#### React 19 신규 Hooks
| Hook | 설명 | 용도 |
|------|------|------|
| `useActionState` | 폼 액션 상태 관리 | 폼 제출, 비동기 작업 |
| `useFormStatus` | 폼 제출 상태 접근 | 부모 폼의 pending 상태 |
| `useOptimistic` | 낙관적 UI 업데이트 | 즉각적 UI 피드백 |
| `use` | Promise/Context 읽기 | 조건부 데이터 페칭 |

### 고급 Hooks (Third-party)

#### TanStack Query v5
| Hook | 설명 | 주요 옵션 |
|------|------|----------|
| `useQuery` | 데이터 페칭 | queryKey, queryFn, staleTime, gcTime |
| `useMutation` | 데이터 변경 | mutationFn, onSuccess, onError, onSettled |
| `useInfiniteQuery` | 무한 스크롤 | getNextPageParam, getPreviousPageParam |
| `useQueries` | 병렬 쿼리 | queries 배열, combine 함수 |
| `useQueryClient` | QueryClient 접근 | invalidateQueries, setQueryData |
| `useMutationState` | 뮤테이션 상태 관찰 | filters, select |
| `useSuspenseQuery` | Suspense 통합 | throwOnError 기본 true |
| `useIsFetching` | 페칭 상태 카운트 | queryKey 필터 |
| `useIsMutating` | 뮤테이션 상태 카운트 | mutationKey 필터 |

## 테스트 가이드

### 테스트 구조

```typescript
// src/__tests__/hooks/useCounter.test.ts
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCounter } from '../../hooks/useCounter';

describe('useCounter', () => {
  it('초기값이 0이어야 한다', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('increment 호출 시 1 증가해야 한다', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

### 테스트 커버리지 목표

| 영역 | 최소 커버리지 | 목표 커버리지 |
|------|-------------|-------------|
| Hooks | 70% | 85% |
| Components | 70% | 80% |
| Utils | 80% | 95% |
| 전체 | 70% | 80% |

### TanStack Query 테스트

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

describe('useQuery 데모', () => {
  it('데이터를 성공적으로 페칭해야 한다', async () => {
    const { result } = renderHook(() => useQuery({
      queryKey: ['test'],
      queryFn: () => Promise.resolve({ data: 'test' }),
    }), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ data: 'test' });
  });
});
```

## 문서 작성 가이드

### 문서 구조 템플릿

```markdown
# {Hook 이름}

## 개요
- 한 줄 설명
- 도입 버전
- 사용 시나리오

## API 레퍼런스

### 시그니처
\`\`\`typescript
const [state, setState] = useState<T>(initialState);
\`\`\`

### 파라미터
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| initialState | T \| () => T | 선택 | 초기 상태값 |

### 반환값
| 값 | 타입 | 설명 |
|----|------|------|
| state | T | 현재 상태 |
| setState | Dispatch<SetStateAction<T>> | 상태 업데이트 함수 |

## 사용 예제

### 기본 사용법
\`\`\`typescript
// 코드 예제
\`\`\`

### 고급 패턴
\`\`\`typescript
// 코드 예제
\`\`\`

## 주의사항
- 렌더링 중 호출 금지 (이벤트 핸들러/useEffect 내에서만)
- 조건문/반복문 내 호출 금지

## 관련 Hooks
- useReducer: 복잡한 상태 로직
- useRef: 렌더링 없이 값 저장

## 성능 고려사항
- 객체/배열 상태 시 불변성 유지
- 함수형 업데이트 활용
```

## 빌드 및 실행 명령어

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 빌드 미리보기
pnpm preview

# 테스트 실행
pnpm test

# 테스트 (watch 모드)
pnpm test:watch

# 커버리지 리포트
pnpm test:coverage

# 린트 검사
pnpm lint

# 타입 검사
pnpm typecheck
```

## 의존성 설치 명령어

```bash
# 프로젝트 생성
pnpm create vite@latest react-hooks-guide -- --template react-ts

# 핵심 의존성
pnpm add react@^19.0.0 react-dom@^19.0.0
pnpm add @tanstack/react-query@^5.60.0
pnpm add react-router-dom@^7.0.0

# 개발 의존성
pnpm add -D typescript@^5.6.0
pnpm add -D @types/react@^19.0.0 @types/react-dom@^19.0.0
pnpm add -D vite@^6.0.0
pnpm add -D vitest@^2.1.0 @vitest/coverage-v8
pnpm add -D @testing-library/react @testing-library/dom @testing-library/jest-dom
pnpm add -D tailwindcss@^4.0.0 @tailwindcss/vite
pnpm add -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks
pnpm add -D jsdom happy-dom
```

## 주요 설정 파일

### vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
```

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/test/**'],
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
    },
  },
});
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Hook 규칙 (Rules of Hooks)

### 필수 규칙

1. **최상위에서만 호출**
   - 조건문, 반복문, 중첩 함수 내에서 호출 금지
   - 예외: `use` Hook은 조건부 호출 가능 (React 19)

2. **React 함수 내에서만 호출**
   - 함수 컴포넌트
   - 커스텀 Hook (use 접두사)

3. **use 접두사 규칙**
   - 다른 Hook을 호출하는 함수는 반드시 use 접두사 사용
   - Hook을 호출하지 않는 함수는 use 접두사 사용 금지

### 잘못된 패턴

```typescript
// ❌ 조건문 내 Hook 호출
function Bad({ cond }: { cond: boolean }) {
  if (cond) {
    const [value, setValue] = useState(0); // Error!
  }
}

// ❌ 반복문 내 Hook 호출
function Bad() {
  for (let i = 0; i < 10; i++) {
    const theme = useContext(ThemeContext); // Error!
  }
}

// ❌ 조건부 return 후 Hook 호출
function Bad({ cond }: { cond: boolean }) {
  if (cond) return null;
  const [value, setValue] = useState(0); // Error!
}

// ❌ 이벤트 핸들러 내 Hook 호출
function Bad() {
  function handleClick() {
    const [value, setValue] = useState(0); // Error!
  }
}
```

### 올바른 패턴

```typescript
// ✅ 최상위 레벨에서 Hook 호출
function Good({ cond }: { cond: boolean }) {
  const [value, setValue] = useState(0);
  
  if (cond) {
    return <div>{value}</div>;
  }
  return null;
}

// ✅ use Hook은 조건부 호출 가능 (React 19)
function Good({ shouldFetch, promise }: Props) {
  const [count, setCount] = useState(0);
  
  if (shouldFetch) {
    const data = use(promise); // OK in React 19
    return <div>{data}</div>;
  }
  
  return <div>{count}</div>;
}
```

## 성능 최적화 가이드

### 메모이제이션 기준

| 상황 | 권장 Hook | 이유 |
|------|----------|------|
| 비용이 큰 계산 | `useMemo` | 불필요한 재계산 방지 |
| 자식에 전달하는 콜백 | `useCallback` | 자식 리렌더링 방지 |
| 외부 스토어 구독 | `useSyncExternalStore` | 티어링 방지 |
| 비긴급 업데이트 | `useTransition` | UI 응답성 유지 |
| 검색/필터 | `useDeferredValue` | 입력 지연 방지 |

### 메모이제이션 안티패턴

```typescript
// ❌ 모든 함수에 useCallback 남용
const handleClick = useCallback(() => {
  console.log('clicked');
}, []); // 불필요

// ❌ 원시값에 useMemo 사용
const doubled = useMemo(() => count * 2, [count]); // 불필요

// ✅ 객체/배열 생성 시에만 useMemo
const config = useMemo(() => ({
  theme: 'dark',
  items: data.filter(x => x.active),
}), [data]);

// ✅ 자식 컴포넌트에 전달하는 콜백에만 useCallback
const handleSubmit = useCallback((data: FormData) => {
  mutation.mutate(data);
}, [mutation.mutate]);
```

## 에러 처리 패턴

### React 19 Error Boundary + useActionState

```typescript
function FormWithErrorHandling() {
  const [error, submitAction, isPending] = useActionState(
    async (previousState: string | null, formData: FormData) => {
      const result = await submitForm(formData);
      if (result.error) {
        return result.error;
      }
      redirect('/success');
      return null;
    },
    null
  );

  return (
    <form action={submitAction}>
      <input name="email" type="email" required />
      <button type="submit" disabled={isPending}>
        {isPending ? '제출 중...' : '제출'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
```

### TanStack Query 에러 처리

```typescript
function QueryWithErrorHandling() {
  const { data, error, isError, refetch } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  if (isError) {
    return (
      <div className="error-container">
        <p>에러 발생: {error.message}</p>
        <button onClick={() => refetch()}>다시 시도</button>
      </div>
    );
  }

  return <div>{/* 데이터 렌더링 */}</div>;
}
```

## 접근성 고려사항

- 모든 인터랙티브 요소에 적절한 ARIA 레이블
- 키보드 네비게이션 지원
- 포커스 관리 (useRef, useImperativeHandle 활용)
- 로딩 상태 스크린 리더 안내

## 참고 자료

- [React 공식 문서](https://react.dev)
- [React 19 업그레이드 가이드](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [TanStack Query v5 문서](https://tanstack.com/query/latest)
- [Vitest 문서](https://vitest.dev)
- [Testing Library 문서](https://testing-library.com/docs/react-testing-library/intro)
