import type { HookInfo } from '@/types';

export const HOOKS_DATA: HookInfo[] = [
  // 상태 관리
  {
    id: 'useState',
    name: 'useState',
    category: 'state',
    description: '컴포넌트 상태 관리',
    introduced: '16.8+',
    path: '/hooks/useState',
  },
  {
    id: 'useReducer',
    name: 'useReducer',
    category: 'state',
    description: '복잡한 상태 로직 관리',
    introduced: '16.8+',
    path: '/hooks/useReducer',
  },
  {
    id: 'useContext',
    name: 'useContext',
    category: 'state',
    description: 'Context 값 구독',
    introduced: '16.8+',
    path: '/hooks/useContext',
  },
  // 부수 효과
  {
    id: 'useEffect',
    name: 'useEffect',
    category: 'effect',
    description: '사이드 이펙트 처리',
    introduced: '16.8+',
    path: '/hooks/useEffect',
  },
  {
    id: 'useLayoutEffect',
    name: 'useLayoutEffect',
    category: 'effect',
    description: 'DOM 변경 후 동기적 실행',
    introduced: '16.8+',
    path: '/hooks/useLayoutEffect',
  },
  {
    id: 'useInsertionEffect',
    name: 'useInsertionEffect',
    category: 'effect',
    description: 'CSS-in-JS 라이브러리용',
    introduced: '18+',
    path: '/hooks/useInsertionEffect',
  },
  // 성능 최적화
  {
    id: 'useMemo',
    name: 'useMemo',
    category: 'performance',
    description: '계산 결과 메모이제이션',
    introduced: '16.8+',
    path: '/hooks/useMemo',
  },
  {
    id: 'useCallback',
    name: 'useCallback',
    category: 'performance',
    description: '함수 메모이제이션',
    introduced: '16.8+',
    path: '/hooks/useCallback',
  },
  {
    id: 'useDeferredValue',
    name: 'useDeferredValue',
    category: 'performance',
    description: '값 업데이트 지연',
    introduced: '18+',
    path: '/hooks/useDeferredValue',
  },
  {
    id: 'useTransition',
    name: 'useTransition',
    category: 'performance',
    description: '비긴급 상태 업데이트',
    introduced: '18+',
    path: '/hooks/useTransition',
  },
  // DOM 접근
  {
    id: 'useRef',
    name: 'useRef',
    category: 'dom',
    description: '가변 참조 객체',
    introduced: '16.8+',
    path: '/hooks/useRef',
  },
  {
    id: 'useImperativeHandle',
    name: 'useImperativeHandle',
    category: 'dom',
    description: 'ref로 노출할 인스턴스 커스터마이징',
    introduced: '16.8+',
    path: '/hooks/useImperativeHandle',
  },
  // 기타
  {
    id: 'useId',
    name: 'useId',
    category: 'other',
    description: '고유 ID 생성',
    introduced: '18+',
    path: '/hooks/useId',
  },
  {
    id: 'useDebugValue',
    name: 'useDebugValue',
    category: 'other',
    description: 'DevTools 커스텀 라벨',
    introduced: '16.8+',
    path: '/hooks/useDebugValue',
  },
  {
    id: 'useSyncExternalStore',
    name: 'useSyncExternalStore',
    category: 'other',
    description: '외부 스토어 구독',
    introduced: '18+',
    path: '/hooks/useSyncExternalStore',
  },
  // React 19 신규
  {
    id: 'useActionState',
    name: 'useActionState',
    category: 'react19',
    description: '폼 액션 상태 관리',
    introduced: '19+',
    path: '/hooks/useActionState',
  },
  {
    id: 'useFormStatus',
    name: 'useFormStatus',
    category: 'react19',
    description: '폼 제출 상태 접근',
    introduced: '19+',
    path: '/hooks/useFormStatus',
  },
  {
    id: 'useOptimistic',
    name: 'useOptimistic',
    category: 'react19',
    description: '낙관적 UI 업데이트',
    introduced: '19+',
    path: '/hooks/useOptimistic',
  },
  {
    id: 'use',
    name: 'use',
    category: 'react19',
    description: 'Promise/Context 읽기',
    introduced: '19+',
    path: '/hooks/use',
  },
  // TanStack Query
  {
    id: 'useQuery',
    name: 'useQuery',
    category: 'tanstack',
    description: '데이터 페칭 및 캐싱',
    introduced: 'TanStack Query 5+',
    path: '/advanced/tanstack/use-query',
  },
  {
    id: 'useMutation',
    name: 'useMutation',
    category: 'tanstack',
    description: '데이터 변경 작업',
    introduced: 'TanStack Query 5+',
    path: '/advanced/tanstack/use-mutation',
  },
  {
    id: 'useInfiniteQuery',
    name: 'useInfiniteQuery',
    category: 'tanstack',
    description: '무한 스크롤 데이터',
    introduced: 'TanStack Query 5+',
    path: '/advanced/tanstack/use-infinite-query',
  },
  {
    id: 'useQueries',
    name: 'useQueries',
    category: 'tanstack',
    description: '병렬 쿼리 실행',
    introduced: 'TanStack Query 5+',
    path: '/advanced/tanstack/use-queries',
  },
  // 고급 패턴
  {
    id: 'customHooks',
    name: '커스텀 Hook 패턴',
    category: 'patterns',
    description: '재사용 가능한 Hook 작성',
    introduced: 'React 16.8+',
    path: '/advanced/patterns/custom-hooks',
  },
  {
    id: 'composition',
    name: 'Hook 조합 패턴',
    category: 'patterns',
    description: 'Hook들을 조합하는 고급 패턴',
    introduced: 'React 16.8+',
    path: '/advanced/patterns/composition',
  },
];

export function getHooksByCategory(category: HookInfo['category']): HookInfo[] {
  return HOOKS_DATA.filter((hook) => hook.category === category);
}

export function getHookById(id: string): HookInfo | undefined {
  return HOOKS_DATA.find((hook) => hook.id === id);
}
