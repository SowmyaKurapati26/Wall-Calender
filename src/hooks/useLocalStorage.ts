'use client';

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, fallback: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(fallback);
  const [hydrated, setHydrated] = useState(false);

  // Sync from localStorage after mount to avoid SSR/client mismatch
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw));
    } catch {
      // Corrupt or missing — fall back silently
    }
    setHydrated(true);
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue(prev => {
        const resolved = next instanceof Function ? next(prev) : next;
        try { window.localStorage.setItem(key, JSON.stringify(resolved)); } catch { /* quota */ }
        return resolved;
      });
    },
    [key]
  );

  return [hydrated ? value : fallback, update];
}
