interface HookDemoProps {
  title: string;
  description: string;
  children: React.ReactNode;
  variant?: 'default' | 'info' | 'warning' | 'success';
}

function HookDemo({
  title,
  description,
  children,
  variant = 'default',
}: HookDemoProps): React.ReactElement {
  const variantStyles = {
    default: 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900',
    info: 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950',
    warning:
      'border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950',
    success:
      'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950',
  };

  return (
    <div className={`my-6 rounded-lg border p-6 ${variantStyles[variant]}`}>
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export default HookDemo;
