'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'ripple.anthropic.apiKey';

export function ApiKeyBar({
  demoMode,
  onToggleDemo,
  onKeyChange,
}: {
  demoMode: boolean;
  onToggleDemo: (v: boolean) => void;
  onKeyChange: (key: string) => void;
}) {
  const [key, setKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (stored) {
      setKey(stored);
      onKeyChange(stored);
    }
  }, [onKeyChange]);

  function save() {
    window.localStorage.setItem(STORAGE_KEY, key);
    onKeyChange(key);
    setSaved(true);
    setTimeout(() => setSaved(false), 1400);
  }

  function clear() {
    window.localStorage.removeItem(STORAGE_KEY);
    setKey('');
    onKeyChange('');
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-3 px-6 py-4 text-sm">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={demoMode}
          onChange={(e) => onToggleDemo(e.target.checked)}
        />
        <span>Demo mode (no API)</span>
      </label>
      <div className="flex-1" />
      {!demoMode && (
        <>
          <input
            type="password"
            placeholder="sk-ant-..."
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-72 rounded-lg border border-ink/15 bg-white px-3 py-1.5 text-sm outline-none focus:border-ripple"
          />
          <button onClick={save} className="rounded-full bg-ink px-4 py-1.5 text-white hover:bg-ink/85">
            {saved ? 'Saved' : 'Save key'}
          </button>
          {key && (
            <button onClick={clear} className="text-xs text-ink/50 underline hover:text-ink">
              clear
            </button>
          )}
        </>
      )}
    </div>
  );
}
