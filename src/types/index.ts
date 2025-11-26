export interface HookInfo {
  id: string;
  name: string;
  category: 'state' | 'effect' | 'performance' | 'dom' | 'other' | 'react19' | 'tanstack';
  description: string;
  introduced: string;
  path: string;
}

export interface CodeExample {
  title: string;
  code: string;
  language?: string;
}

export interface DemoSection {
  title: string;
  description?: string;
  component: React.ReactNode;
}
