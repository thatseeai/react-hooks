# React Hooks 완벽 가이드

React 19의 모든 Hook을 실제 사용 예제와 함께 학습할 수 있는 종합 가이드 애플리케이션

## 🚀 데모

https://thatseeai.github.io/react-hooks/

## ✨ 특징

- **19개 Hook 페이지** - React 19의 모든 Hook 완벽 구현
- **인터랙티브 데모** - 각 Hook의 실제 동작을 직접 체험
- **코드 예제** - 복사 가능한 TypeScript 코드 스니펫
- **최신 React 19** - useActionState, useFormStatus, useOptimistic, use Hook 포함
- **다크 모드** - 눈이 편한 다크 테마 지원
- **반응형 디자인** - 모든 화면 크기에 최적화

## 📚 구현된 Hooks

### 상태 관리 (3개)
- `useState` - 컴포넌트 상태 관리
- `useReducer` - 복잡한 상태 로직 관리
- `useContext` - Context 값 구독

### 부수 효과 (3개)
- `useEffect` - 사이드 이펙트 처리
- `useLayoutEffect` - DOM 변경 후 동기적 실행
- `useInsertionEffect` - CSS-in-JS 라이브러리용

### 성능 최적화 (4개)
- `useMemo` - 계산 결과 메모이제이션
- `useCallback` - 함수 메모이제이션
- `useDeferredValue` - 값 업데이트 지연
- `useTransition` - 비긴급 상태 업데이트

### DOM 접근 (2개)
- `useRef` - 가변 참조 객체
- `useImperativeHandle` - ref로 노출할 인스턴스 커스터마이징

### 기타 (3개)
- `useId` - 고유 ID 생성
- `useDebugValue` - DevTools 커스텀 라벨
- `useSyncExternalStore` - 외부 스토어 구독

### React 19 신규 (4개)
- `useActionState` - 폼 액션 상태 관리
- `useFormStatus` - 폼 제출 상태 접근
- `useOptimistic` - 낙관적 UI 업데이트
- `use` - Promise/Context 읽기

## 🛠️ 기술 스택

| 기술 | 버전 | 용도 |
|------|------|------|
| React | 19.2.0 | UI 라이브러리 |
| TypeScript | 5.6+ | 정적 타입 시스템 |
| Vite | 6.4.1 | 빌드 도구 |
| Vitest | 2.1+ | 테스트 프레임워크 |
| Tailwind CSS | 4.0 | 스타일링 |
| TanStack Query | 5.90.10 | 서버 상태 관리 |
| React Router | 7.9.6 | 라우팅 |

## 📦 설치 및 실행

### 의존성 설치
```bash
pnpm install
```

### 개발 서버 실행
```bash
pnpm dev
```

### 프로덕션 빌드
```bash
pnpm build
```

### 빌드 미리보기
```bash
pnpm preview
```

### 테스트 실행
```bash
pnpm test
```

### 타입 체크
```bash
pnpm typecheck
```

### 린트 검사
```bash
pnpm lint
```

## 📁 프로젝트 구조

```
react-hooks-guide/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages 배포 워크플로우
├── src/
│   ├── components/
│   │   ├── Layout/            # Header, Sidebar, Footer
│   │   ├── CodeBlock/         # 코드 표시 컴포넌트
│   │   └── HookDemo/          # 데모 래퍼 컴포넌트
│   ├── pages/
│   │   ├── Home.tsx           # 메인 페이지
│   │   └── basic/             # 19개 Hook 페이지
│   ├── contexts/              # Context 예제
│   ├── utils/                 # 유틸리티 함수
│   ├── types/                 # TypeScript 타입
│   ├── App.tsx                # 라우팅 설정
│   └── main.tsx               # 앱 엔트리 포인트
├── CLAUDE.md                  # 프로젝트 가이드
└── README.md
```

## 🚀 GitHub Pages 배포

이 프로젝트는 GitHub Actions를 통해 자동으로 배포됩니다.

### 배포 설정

1. GitHub 저장소의 **Settings > Pages** 이동
2. **Source**를 "GitHub Actions"로 설정
3. `main` 브랜치에 푸시하면 자동 배포

### 수동 배포 트리거

GitHub Actions 탭에서 "Deploy to GitHub Pages" 워크플로우를 수동으로 실행할 수 있습니다.

## 📝 라이선스

MIT License

## 🤝 기여

이슈와 PR을 환영합니다!

## 📖 참고 자료

- [React 공식 문서](https://react.dev)
- [React 19 업그레이드 가이드](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [TanStack Query 문서](https://tanstack.com/query/latest)
