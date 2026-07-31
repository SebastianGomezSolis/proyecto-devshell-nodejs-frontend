import { useEffect, useCallback } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;

interface Shortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: KeyHandler;
}

export function useKeyboardShortcut(shortcuts: Shortcut[]): void {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    for (const s of shortcuts) {
      const ctrl = s.ctrl ?? false;
      const shift = s.shift ?? false;
      const alt = s.alt ?? false;
      if (
        event.key.toLowerCase() === s.key.toLowerCase() &&
        event.ctrlKey === ctrl &&
        event.shiftKey === shift &&
        event.altKey === alt
      ) {
        event.preventDefault();
        s.handler(event);
        return;
      }
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
