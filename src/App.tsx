import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import AnalyticsTracker from './components/common/AnalyticsTracker';
import Home from './pages/Home';
import UseStatePage from './pages/basic/UseStatePage';
import UseReducerPage from './pages/basic/UseReducerPage';
import UseContextPage from './pages/basic/UseContextPage';
import UseEffectPage from './pages/basic/UseEffectPage';
import UseRefPage from './pages/basic/UseRefPage';
import UseMemoPage from './pages/basic/UseMemoPage';
import UseCallbackPage from './pages/basic/UseCallbackPage';
import UseIdPage from './pages/basic/UseIdPage';
import UseTransitionPage from './pages/basic/UseTransitionPage';
import UseDeferredValuePage from './pages/basic/UseDeferredValuePage';
import UseLayoutEffectPage from './pages/basic/UseLayoutEffectPage';
import UseImperativeHandlePage from './pages/basic/UseImperativeHandlePage';
import UseDebugValuePage from './pages/basic/UseDebugValuePage';
import UseSyncExternalStorePage from './pages/basic/UseSyncExternalStorePage';
import UseInsertionEffectPage from './pages/basic/UseInsertionEffectPage';
import UseActionStatePage from './pages/basic/UseActionStatePage';
import UseFormStatusPage from './pages/basic/UseFormStatusPage';
import UseOptimisticPage from './pages/basic/UseOptimisticPage';
import UsePage from './pages/basic/UsePage';
import UseQueryPage from './pages/advanced/tanstack/UseQueryPage';
import UseMutationPage from './pages/advanced/tanstack/UseMutationPage';
import UseInfiniteQueryPage from './pages/advanced/tanstack/UseInfiniteQueryPage';
import UseQueriesPage from './pages/advanced/tanstack/UseQueriesPage';
import CustomHookPatterns from './pages/advanced/patterns/CustomHookPatterns';
import CompositionPatterns from './pages/advanced/patterns/CompositionPatterns';

function App(): React.ReactElement {
  return (
    <Layout>
      <AnalyticsTracker />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* 상태 관리 */}
        <Route path="/hooks/useState" element={<UseStatePage />} />
        <Route path="/hooks/useReducer" element={<UseReducerPage />} />
        <Route path="/hooks/useContext" element={<UseContextPage />} />

        {/* 부수 효과 */}
        <Route path="/hooks/useEffect" element={<UseEffectPage />} />
        <Route path="/hooks/useLayoutEffect" element={<UseLayoutEffectPage />} />
        <Route path="/hooks/useInsertionEffect" element={<UseInsertionEffectPage />} />

        {/* 성능 최적화 */}
        <Route path="/hooks/useMemo" element={<UseMemoPage />} />
        <Route path="/hooks/useCallback" element={<UseCallbackPage />} />
        <Route path="/hooks/useDeferredValue" element={<UseDeferredValuePage />} />
        <Route path="/hooks/useTransition" element={<UseTransitionPage />} />

        {/* DOM 접근 */}
        <Route path="/hooks/useRef" element={<UseRefPage />} />
        <Route path="/hooks/useImperativeHandle" element={<UseImperativeHandlePage />} />

        {/* 기타 */}
        <Route path="/hooks/useId" element={<UseIdPage />} />
        <Route path="/hooks/useDebugValue" element={<UseDebugValuePage />} />
        <Route path="/hooks/useSyncExternalStore" element={<UseSyncExternalStorePage />} />

        {/* React 19 신규 Hooks */}
        <Route path="/hooks/useActionState" element={<UseActionStatePage />} />
        <Route path="/hooks/useFormStatus" element={<UseFormStatusPage />} />
        <Route path="/hooks/useOptimistic" element={<UseOptimisticPage />} />
        <Route path="/hooks/use" element={<UsePage />} />

        {/* TanStack Query Hooks */}
        <Route path="/advanced/tanstack/use-query" element={<UseQueryPage />} />
        <Route path="/advanced/tanstack/use-mutation" element={<UseMutationPage />} />
        <Route path="/advanced/tanstack/use-infinite-query" element={<UseInfiniteQueryPage />} />
        <Route path="/advanced/tanstack/use-queries" element={<UseQueriesPage />} />

        {/* 고급 패턴 */}
        <Route path="/advanced/patterns/custom-hooks" element={<CustomHookPatterns />} />
        <Route path="/advanced/patterns/composition" element={<CompositionPatterns />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
