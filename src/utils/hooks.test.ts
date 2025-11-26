import { describe, it, expect } from 'vitest';
import { HOOKS_DATA, getHooksByCategory, getHookById } from './hooks';

describe('hooks utility', () => {
  describe('HOOKS_DATA', () => {
    it('should contain 19 hooks', () => {
      expect(HOOKS_DATA).toHaveLength(19);
    });

    it('should have all required properties for each hook', () => {
      HOOKS_DATA.forEach((hook) => {
        expect(hook).toHaveProperty('id');
        expect(hook).toHaveProperty('name');
        expect(hook).toHaveProperty('category');
        expect(hook).toHaveProperty('description');
        expect(hook).toHaveProperty('introduced');
        expect(hook).toHaveProperty('path');
      });
    });

    it('should have unique IDs', () => {
      const ids = HOOKS_DATA.map((hook) => hook.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(HOOKS_DATA.length);
    });

    it('should have valid categories', () => {
      const validCategories = ['state', 'effect', 'performance', 'dom', 'other', 'react19'];
      HOOKS_DATA.forEach((hook) => {
        expect(validCategories).toContain(hook.category);
      });
    });

    it('should have correct paths format', () => {
      HOOKS_DATA.forEach((hook) => {
        expect(hook.path).toMatch(/^\/hooks\//);
      });
    });
  });

  describe('getHooksByCategory', () => {
    it('should return state management hooks', () => {
      const stateHooks = getHooksByCategory('state');
      expect(stateHooks).toHaveLength(3);
      expect(stateHooks.map((h) => h.id)).toContain('useState');
      expect(stateHooks.map((h) => h.id)).toContain('useReducer');
      expect(stateHooks.map((h) => h.id)).toContain('useContext');
    });

    it('should return effect hooks', () => {
      const effectHooks = getHooksByCategory('effect');
      expect(effectHooks).toHaveLength(3);
      expect(effectHooks.map((h) => h.id)).toContain('useEffect');
      expect(effectHooks.map((h) => h.id)).toContain('useLayoutEffect');
      expect(effectHooks.map((h) => h.id)).toContain('useInsertionEffect');
    });

    it('should return performance hooks', () => {
      const performanceHooks = getHooksByCategory('performance');
      expect(performanceHooks).toHaveLength(4);
      expect(performanceHooks.map((h) => h.id)).toContain('useMemo');
      expect(performanceHooks.map((h) => h.id)).toContain('useCallback');
      expect(performanceHooks.map((h) => h.id)).toContain('useDeferredValue');
      expect(performanceHooks.map((h) => h.id)).toContain('useTransition');
    });

    it('should return DOM hooks', () => {
      const domHooks = getHooksByCategory('dom');
      expect(domHooks).toHaveLength(2);
      expect(domHooks.map((h) => h.id)).toContain('useRef');
      expect(domHooks.map((h) => h.id)).toContain('useImperativeHandle');
    });

    it('should return other hooks', () => {
      const otherHooks = getHooksByCategory('other');
      expect(otherHooks).toHaveLength(3);
      expect(otherHooks.map((h) => h.id)).toContain('useId');
      expect(otherHooks.map((h) => h.id)).toContain('useDebugValue');
      expect(otherHooks.map((h) => h.id)).toContain('useSyncExternalStore');
    });

    it('should return React 19 hooks', () => {
      const react19Hooks = getHooksByCategory('react19');
      expect(react19Hooks).toHaveLength(4);
      expect(react19Hooks.map((h) => h.id)).toContain('useActionState');
      expect(react19Hooks.map((h) => h.id)).toContain('useFormStatus');
      expect(react19Hooks.map((h) => h.id)).toContain('useOptimistic');
      expect(react19Hooks.map((h) => h.id)).toContain('use');
    });

    it('should return empty array for invalid category', () => {
      // @ts-expect-error - Testing invalid category
      const result = getHooksByCategory('invalid');
      expect(result).toEqual([]);
    });
  });

  describe('getHookById', () => {
    it('should return useState hook', () => {
      const hook = getHookById('useState');
      expect(hook).toBeDefined();
      expect(hook?.name).toBe('useState');
      expect(hook?.category).toBe('state');
    });

    it('should return useEffect hook', () => {
      const hook = getHookById('useEffect');
      expect(hook).toBeDefined();
      expect(hook?.name).toBe('useEffect');
      expect(hook?.category).toBe('effect');
    });

    it('should return useActionState hook', () => {
      const hook = getHookById('useActionState');
      expect(hook).toBeDefined();
      expect(hook?.name).toBe('useActionState');
      expect(hook?.category).toBe('react19');
      expect(hook?.introduced).toBe('19+');
    });

    it('should return undefined for non-existent hook', () => {
      const hook = getHookById('nonExistentHook');
      expect(hook).toBeUndefined();
    });

    it('should return correct path for hooks', () => {
      const hook = getHookById('useMemo');
      expect(hook?.path).toBe('/hooks/useMemo');
    });
  });

  describe('Hook data integrity', () => {
    it('should have correct React 19 hooks with 19+ version', () => {
      const react19Hooks = ['useActionState', 'useFormStatus', 'useOptimistic', 'use'];
      react19Hooks.forEach((hookId) => {
        const hook = getHookById(hookId);
        expect(hook?.introduced).toBe('19+');
      });
    });

    it('should have correct React 18 hooks with 18+ version', () => {
      const react18Hooks = [
        'useInsertionEffect',
        'useDeferredValue',
        'useTransition',
        'useId',
        'useSyncExternalStore',
      ];
      react18Hooks.forEach((hookId) => {
        const hook = getHookById(hookId);
        expect(hook?.introduced).toBe('18+');
      });
    });

    it('should have correct React 16.8+ hooks', () => {
      const react168Hooks = [
        'useState',
        'useReducer',
        'useContext',
        'useEffect',
        'useLayoutEffect',
        'useMemo',
        'useCallback',
        'useRef',
        'useImperativeHandle',
        'useDebugValue',
      ];
      react168Hooks.forEach((hookId) => {
        const hook = getHookById(hookId);
        expect(hook?.introduced).toBe('16.8+');
      });
    });
  });
});
