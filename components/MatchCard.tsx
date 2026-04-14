'use client';

import type { MatchResult, UserProfile } from '@/lib/types';

interface Props {
  user: UserProfile;
  result: MatchResult;
  mode: 'similarity' | 'bridge';
  source: 'claude' | 'demo';
  onRestart: () => void;
}

export function MatchCard({ user, result, mode, source, onRestart }: Props) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-ink/50">
            {mode === 'bridge' ? 'Bridge match' : 'Similarity match'} · {source === 'claude' ? 'Claude' : 'Demo mode'}
          </div>
          <h2 className="font-serif text-3xl font-semibold">Your ripple</h2>
        </div>
        <button onClick={onRestart} className="text-sm text-ink/60 underline hover:text-ink">
          Start over
        </button>
      </header>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
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

      <div className="mb-5 rounded-2xl border border-ripple/40 bg-ripple/5 p-6">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-ripple">Warm intro from Claude</h3>
        <p className="whitespace-pre-line text-ink/85">{result.introMessage}</p>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => navigator.clipboard.writeText(result.introMessage)}
            className="rounded-full bg-ink px-5 py-2 text-sm text-white hover:bg-ink/85"
          >
            Copy intro
          </button>
          <div className="text-xs text-ink/50">
            Tailored to your style: {user.commStyle === 'text-first' ? 'text first' : 'meet first'}
          </div>
        </div>
      </div>

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
          How much this match crosses meaningful difference. Higher in Bridge mode.
        </p>
      </div>
    </section>
  );
}
