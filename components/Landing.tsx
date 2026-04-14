'use client';

export function Landing({ onStart }: { onStart: () => void }) {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
      <div className="relative mb-10 h-24 w-24">
        <div className="ripple-anim absolute inset-0 rounded-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-4 rounded-full bg-ripple" />
        </div>
      </div>
      <h1 className="mb-3 font-serif text-6xl font-semibold tracking-tight">Ripple</h1>
      <p className="mb-8 text-lg text-ink/70">Small nods. Wide ripples.</p>
      <p className="mb-10 max-w-lg text-ink/70">
        A campus already forming around your seat. Ripple surfaces the people
        you have been sharing space with — and the people most worth meeting
        across difference. Claude writes the first message so you do not have to.
      </p>
      <button
        onClick={onStart}
        className="rounded-full bg-ink px-8 py-3 text-white transition hover:bg-ink/85"
      >
        Start a ripple
      </button>
      <p className="mt-6 text-xs text-ink/50">
        Demo runs in your browser. Bring your own Anthropic key, or try Demo Mode.
      </p>
    </section>
  );
}
