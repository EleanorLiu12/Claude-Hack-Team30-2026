'use client';

import { useState } from 'react';
import { ApiKeyBar } from '@/components/ApiKeyBar';
import { Landing } from '@/components/Landing';
import { Onboarding } from '@/components/Onboarding';
import { MatchCard } from '@/components/MatchCard';
import { generateMatch } from '@/lib/claude';
import { MOCK_CANDIDATES, mockMatch } from '@/lib/mock-data';
import type { BridgeMode, MatchResult, UserProfile } from '@/lib/types';

type Step = 'landing' | 'onboarding' | 'loading' | 'match';

export default function Page() {
  const [step, setStep] = useState<Step>('landing');
  const [apiKey, setApiKey] = useState('');
  const [demoMode, setDemoMode] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [mode, setMode] = useState<BridgeMode>('bridge');
  const [result, setResult] = useState<MatchResult | null>(null);
  const [source, setSource] = useState<'claude' | 'demo'>('demo');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(profile: UserProfile, m: BridgeMode) {
    setUser(profile);
    setMode(m);
    setError(null);
    setStep('loading');

    try {
      if (!demoMode && apiKey) {
        const r = await generateMatch(apiKey, profile, MOCK_CANDIDATES, m);
        setResult(r);
        setSource('claude');
      } else {
        await new Promise((r) => setTimeout(r, 800));
        setResult(mockMatch(profile, m));
        setSource('demo');
      }
      setStep('match');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Something went wrong';
      setError(msg);
      setResult(mockMatch(profile, m));
      setSource('demo');
      setStep('match');
    }
  }

  return (
    <main>
      {step !== 'landing' && (
        <ApiKeyBar
          demoMode={demoMode}
          onToggleDemo={setDemoMode}
          onKeyChange={setApiKey}
        />
      )}

      {step === 'landing' && <Landing onStart={() => setStep('onboarding')} />}
      {step === 'onboarding' && <Onboarding onSubmit={handleSubmit} />}
      {step === 'loading' && <Loading />}
      {step === 'match' && user && result && (
        <>
          {error && (
            <div className="mx-auto max-w-3xl px-6">
              <div className="mb-4 rounded-lg border border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Claude call failed ({error}). Showing demo response instead.
              </div>
            </div>
          )}
          <MatchCard
            user={user}
            result={result}
            mode={mode}
            source={source}
            onRestart={() => setStep('onboarding')}
          />
        </>
      )}

      <footer className="mx-auto max-w-3xl px-6 pb-12 pt-6 text-center text-xs text-ink/40">
        Ripple · built for a one-hour hackathon. Powered by Claude.
      </footer>
    </main>
  );
}

function Loading() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="relative mx-auto mb-6 h-16 w-16">
          <div className="ripple-anim absolute inset-0 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-3 w-3 rounded-full bg-ripple" />
          </div>
        </div>
        <div className="text-sm text-ink/60">Sending ripples through your lecture...</div>
      </div>
    </section>
  );
}
