'use client';

import { useEffect, useState } from 'react';
import type { MatchResult, UserProfile } from '@/lib/types';

interface Props {
  user: UserProfile;
  result: MatchResult;
  mode: 'similarity' | 'bridge';
  source: 'claude' | 'demo';
  onRestart: () => void;
}

export function MatchCard({ user, result, mode, source, onRestart }: Props) {
  const introvert = Boolean(user.introvertMode);
  const [draft, setDraft] = useState(result.introMessage);
  const [holdFor24h, setHoldFor24h] = useState(false);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    setDraft(result.introMessage);
  }, [result.introMessage]);

  if (skipped) {
    return (
      <section className="mx-auto max-w-xl px-6 py-20 text-center">
        <h2 className="font-serif text-2xl font-semibold">Set aside for now.</h2>
        <p className="mt-3 text-ink/70">
          Ripple will hold onto this match. Come back whenever you want.
        </p>
        <button
          onClick={onRestart}
          className={`mt-6 rounded-full bg-ink px-6 py-2 text-sm text-white hover:bg-ink/85`}
        >
          Start over
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-ink/50">
            {mode === 'bridge' ? 'Bridge match' : 'Similarity match'}
            {introvert ? ' · Introvert Mode' : ''} · {source === 'claude' ? 'Claude' : 'Demo mode'}
          </div>
          <h2 className="font-serif text-3xl font-semibold">
            {introvert ? 'A quiet ripple' : 'Your ripple'}
          </h2>
        </div>
        <button onClick={onRestart} className="text-sm text-ink/60 underline hover:text-ink">
          Start over
        </button>
      </header>

      <div className={`mb-6 grid gap-3 ${result.candidates.length > 2 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
        {result.candidates.map((c) => (
          <div key={c.id} className="rounded-2xl border border-ink/10 bg-white p-4">
            <div className="mb-1 text-xs uppercase tracking-wider text-ink/50">{c.course}</div>
            <div className="text-lg font-semibold">{c.name}</div>
            <div className="mt-2 text-xs text-ink/60">{c.seatZone.replace('-', ' ')} · {c.mbti} · {c.hometown}</div>
            <div className="mt-3 rounded-lg bg-soft px-3 py-2 text-xs text-ink/70">
              Shared this room <span className="font-semibold text-ink">{c.sharedLectures}</span> times
            </div>
            {c.antiResume && (
              <div className="mt-3 text-xs text-ink/70">
                <span className="font-medium">Curious about:</span> {c.antiResume.curiosity}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mb-5 rounded-2xl border border-ink/10 bg-white p-6">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-ink/60">Shared ground</h3>
        <p className="text-ink/85">{result.sharedGround}</p>
      </div>

      <div className={`mb-5 rounded-2xl border p-6 ${introvert ? 'border-calm/40 bg-calmSoft' : 'border-ripple/40 bg-ripple/5'}`}>
        <div className="mb-2 flex items-center justify-between">
          <h3 className={`text-sm font-semibold uppercase tracking-wider ${introvert ? 'text-calm' : 'text-ripple'}`}>
            Warm intro from Claude
          </h3>
          {introvert && (
            <span className="text-xs text-ink/50">Editable draft. Nothing sends yet.</span>
          )}
        </div>

        {introvert ? (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="min-h-[150px] w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm text-ink/85 outline-none focus:border-calm"
          />
        ) : (
          <p className="whitespace-pre-line text-ink/85">{result.introMessage}</p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigator.clipboard.writeText(introvert ? draft : result.introMessage)}
            className="rounded-full bg-ink px-5 py-2 text-sm text-white hover:bg-ink/85"
          >
            Copy {introvert ? 'draft' : 'intro'}
          </button>
          {introvert && (
            <label className="flex items-center gap-2 text-xs text-ink/60">
              <input
                type="checkbox"
                checked={holdFor24h}
                onChange={(e) => setHoldFor24h(e.target.checked)}
              />
              Hold 24 hours before sending
            </label>
          )}
          <div className="ml-auto text-xs text-ink/50">
            Tailored to your style: {user.commStyle === 'text-first' ? 'text first' : 'meet first'}
          </div>
        </div>
      </div>

      <div className={`grid gap-3 ${introvert && result.depthScore !== undefined ? 'sm:grid-cols-2' : ''}`}>
        <div className="rounded-2xl border border-ink/10 bg-white p-6">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-ink/60">Bridge score</h3>
            <span className="text-2xl font-semibold">{result.bridgeScore}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-soft">
            <div
              className="h-full bg-ripple transition-all"
              style={{ width: `${Math.max(0, Math.min(100, result.bridgeScore))}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-ink/60">
            How much this match crosses meaningful difference.
          </p>
        </div>

        {introvert && result.depthScore !== undefined && (
          <div className="rounded-2xl border border-ink/10 bg-white p-6">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-ink/60">Depth score</h3>
              <span className="text-2xl font-semibold">{result.depthScore}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-calmSoft">
              <div
                className="h-full bg-calm transition-all"
                style={{ width: `${Math.max(0, Math.min(100, result.depthScore))}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-ink/60">
              How substantive the overlap is. Up-weights specific curiosity and shared themes.
            </p>
          </div>
        )}
      </div>

      {introvert && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setSkipped(true)}
            className="rounded-full border border-ink/20 bg-white px-5 py-2 text-sm text-ink/70 hover:border-ink/40 hover:text-ink"
          >
            Not this week
          </button>
        </div>
      )}
    </section>
  );
}
