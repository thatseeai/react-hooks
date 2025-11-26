function Footer(): React.ReactElement {
  return (
    <footer className="border-t border-gray-200 bg-white py-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>
          React Hooks 완벽 가이드 - React 19의 모든 Hook을 실제 예제와 함께 학습
        </p>
        <p className="mt-2">
          Built with React 19, TypeScript, Vite, Tailwind CSS, TanStack Query
        </p>
      </div>
    </footer>
  );
}

export default Footer;
