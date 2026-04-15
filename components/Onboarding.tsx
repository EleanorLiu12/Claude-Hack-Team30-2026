'use client';

import { useState, useEffect } from 'react';
import type { BridgeMode, CommStyle, MBTI, SeatZone, UserProfile } from '@/lib/types';
import { SeatGrid } from './SeatGrid';
import { MOCK_CANDIDATES } from '@/lib/mock-data';

const MBTIS: MBTI[] = [
  'INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP',
  'ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP',
];

interface Props {
  onSubmit: (profile: UserProfile, mode: BridgeMode) => void;
}

export function Onboarding({ onSubmit }: Props) {
  const [demoIndex, setDemoIndex] = useState(0);
  const [name, setName] = useState('Alex');
  const [course, setCourse] = useState('ECON 101');
  const [seatZone, setSeatZone] = useState<SeatZone | undefined>('back-center');
  const [commStyle, setCommStyle] = useState<CommStyle>('text-first');
  const [mbti, setMbti] = useState<MBTI | ''>('INFP');
  const [hometown, setHometown] = useState('Green Bay, WI');
  const [languages, setLanguages] = useState('English');
  const [zodiac, setZodiac] = useState('Taurus');
  const [resumeText, setResumeText] = useState(
    'Junior, political science + environmental studies. Campus garden volunteer. Intern at a local policy think tank. Interested in rural development.',
  );
  const [struggle, setStruggle] = useState('Raising my hand in a 300-person lecture');
  const [failure, setFailure] = useState('Ran for student gov, lost badly');
  const [curiosity, setCuriosity] = useState('How people from opposite sides of my home state actually talk to each other');
  const [bridgeMode, setBridgeMode] = useState<BridgeMode>('bridge');
  const [introvertMode, setIntrovertMode] = useState<boolean>(false);

  // Keyboard shortcut to cycle through demo profiles
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const nextIndex = (demoIndex + 1) % MOCK_CANDIDATES.length;
        setDemoIndex(nextIndex);
        const candidate = MOCK_CANDIDATES[nextIndex];
        setName(candidate.name);
        setCourse(candidate.course);
        setSeatZone(candidate.seatZone);
        setCommStyle(candidate.commStyle);
        setMbti(candidate.mbti);
        setHometown(candidate.hometown);
        setLanguages(candidate.languages.join(', '));
        setZodiac(candidate.zodiac);
        setResumeText(candidate.resumeText);
        setStruggle(candidate.antiResume.struggle);
        setFailure(candidate.antiResume.failure);
        setCuriosity(candidate.antiResume.curiosity);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [demoIndex]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!seatZone) return;
    const profile: UserProfile = {
      name,
      course,
      seatZone,
      commStyle,
      introvertMode,
      mbti: mbti || undefined,
      hometown: hometown || undefined,
      languages: languages ? languages.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
      zodiac: zodiac || undefined,
      resumeText: resumeText || undefined,
      antiResume: (struggle || failure || curiosity) ? { struggle, failure, curiosity } : undefined,
    };
    onSubmit(profile, bridgeMode);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-8 px-6 py-10">
      <header>
        <h2 className="font-serif text-3xl font-semibold">Tell Ripple a little</h2>
        <p className="mt-1 text-sm text-ink/60">Only class, seat, and how you like to connect are required.</p>
        <p className="mt-2 text-xs text-ripple/70">💡 Demo tip: Press Cmd+K (Mac) or Ctrl+K (Windows) to cycle through demo profiles</p>
      </header>

      <section className="space-y-4 rounded-2xl border border-ink/10 bg-white p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-ink/60">Required</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Your name">
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Course">
            <input className={inputCls} value={course} onChange={(e) => setCourse(e.target.value)} />
          </Field>
        </div>

        <Field label="Where do you usually sit?">
          <SeatGrid value={seatZone} onChange={setSeatZone} />
        </Field>

        <Field label="How do you prefer to connect first?">
          <div className="grid grid-cols-2 gap-2">
            {(['text-first', 'meet-first'] as CommStyle[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCommStyle(c)}
                className={`rounded-xl border px-4 py-3 text-sm transition ${
                  commStyle === c
                    ? 'border-ripple bg-ripple text-white'
                    : 'border-ink/15 bg-white hover:border-ripple/60'
                }`}
              >
                {c === 'text-first' ? 'A message first' : 'Meet in person'}
              </button>
            ))}
          </div>
        </Field>

        <button
          type="button"
          onClick={() => setIntrovertMode((v) => !v)}
          className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition ${
            introvertMode
              ? 'border-calm bg-calmSoft'
              : 'border-ink/15 bg-white hover:border-calm/60'
          }`}
        >
          <span
            className={`mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full transition ${
              introvertMode ? 'bg-calm' : 'bg-ink/15'
            }`}
          >
            <span
              className={`h-4 w-4 rounded-full bg-white shadow transition ${
                introvertMode ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </span>
          <span>
            <span className="block font-medium">Introvert Mode</span>
            <span className="block text-xs text-ink/60">
              Smaller matches, lower-stimulation pacing, an editable draft before anything goes out. You can change this anytime.
            </span>
          </span>
        </button>
      </section>

      <section className="space-y-4 rounded-2xl border border-ink/10 bg-white p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-ink/60">Optional psych signals</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="MBTI">
            <select className={inputCls} value={mbti} onChange={(e) => setMbti(e.target.value as MBTI | '')}>
              <option value="">Prefer not to say</option>
              {MBTIS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Zodiac">
            <input className={inputCls} value={zodiac} onChange={(e) => setZodiac(e.target.value)} />
          </Field>
          <Field label="Hometown">
            <input className={inputCls} value={hometown} onChange={(e) => setHometown(e.target.value)} />
          </Field>
          <Field label="Languages (comma separated)">
            <input className={inputCls} value={languages} onChange={(e) => setLanguages(e.target.value)} />
          </Field>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-ink/10 bg-white p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-ink/60">Resume</h3>
        <Field label="Paste your resume text (Claude will extract the useful bits)">
          <textarea
            className={`${inputCls} min-h-[110px]`}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
        </Field>
      </section>

      <section className="space-y-4 rounded-2xl border border-ink/10 bg-white p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-ink/60">Anti-resume</h3>
        <p className="text-sm text-ink/60">Ripple matches on the rough edges, not the polished ones.</p>
        <Field label="One struggle">
          <input className={inputCls} value={struggle} onChange={(e) => setStruggle(e.target.value)} />
        </Field>
        <Field label="One failure">
          <input className={inputCls} value={failure} onChange={(e) => setFailure(e.target.value)} />
        </Field>
        <Field label="One thing you are curious about">
          <input className={inputCls} value={curiosity} onChange={(e) => setCuriosity(e.target.value)} />
        </Field>
      </section>

      <section className="rounded-2xl border border-ink/10 bg-white p-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink/60">Matching mode</h3>
        <div className="grid grid-cols-2 gap-2">
          {(['similarity', 'bridge'] as BridgeMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setBridgeMode(m)}
              className={`rounded-xl border px-4 py-4 text-left transition ${
                bridgeMode === m
                  ? 'border-ripple bg-ripple/10'
                  : 'border-ink/15 bg-white hover:border-ripple/60'
              }`}
            >
              <div className="font-medium">{m === 'similarity' ? 'Similarity' : 'Bridge'}</div>
              <div className="text-xs text-ink/60">
                {m === 'similarity' ? 'People like you. Lower anxiety.' : 'People unlike you. Shared spark.'}
              </div>
            </button>
          ))}
        </div>
      </section>

      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={!seatZone}
          className="rounded-full bg-ink px-8 py-3 text-white transition hover:bg-ink/85 disabled:opacity-40"
        >
          Find my ripple
        </button>
      </div>
    </form>
  );
}

const inputCls = 'w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-ripple';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-ink/70">{label}</span>
      {children}
    </label>
  );
}
